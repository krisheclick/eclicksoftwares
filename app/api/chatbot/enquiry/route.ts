import { NextRequest, NextResponse } from "next/server";
import { protect, readBody, safePage } from "@/utils/chatbot/security";
import { validate } from "@/utils/chatbot/flow";
import { getCatalogue } from "@/utils/chatbot/catalogue";
import type { Draft } from "@/utils/chatbot/types";
import {
    websiteEnquiryPayload,
    websiteEnquiryPrefill,
} from "@/utils/chatbot/websiteEnquiry";
import { createHash } from "node:crypto";
export const runtime = "nodejs";
type WebsiteReceipt = { accepted: true; reference?: string };
// Short-lived process-local retry protection. The existing API must implement
// durable idempotency to guarantee this across multiple server instances.
const websiteRequests = new Map<
    string,
    { hash: string; expires: number; task: Promise<WebsiteReceipt> }
>();
export async function POST(request: NextRequest) {
    const denied = protect(request, 5);
    if (denied) return denied;
    let body: Record<string, unknown>;
    try {
        body = await readBody(request);
    } catch {
        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 },
        );
    }
    const raw = body.draft;
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
        return NextResponse.json(
            { error: "Invalid enquiry." },
            { status: 400 },
        );
    const fields = [
        "service",
        "project",
        "projectType",
        "industry",
        "existingWebsite",
        "website",
        "requirements",
        "budget",
        "timeline",
        "name",
        "email",
        "phone",
        "company",
        "preference",
        "consent",
    ] as const;
    const draft: Draft = {};
    for (const field of fields) {
        const value = (raw as Record<string, unknown>)[field];
        if (value !== undefined && typeof value !== "string")
            return NextResponse.json(
                { error: "Invalid enquiry field." },
                { status: 400 },
            );
        if (typeof value === "string") draft[field] = value.trim();
    }
    const catalogue = await getCatalogue();
    const service = catalogue.categories
        .flatMap((c) => c.services)
        .find((s) => s.id === draft.service);
    if (!service)
        return NextResponse.json(
            { error: "Please select an available service." },
            { status: 400 },
        );
    for (const field of [
        "projectType",
        "requirements",
        "budget",
        "timeline",
        "name",
        "email",
        "preference",
    ] as const) {
        const error = validate(field, draft[field] || "", draft);
        if (error) return NextResponse.json({ error }, { status: 422 });
    }
    for (const field of [
        "company",
        "industry",
        "project",
        "phone",
        "website",
    ] as const) {
        if (draft[field]) {
            const error = validate(field, draft[field]!, draft);
            if (error) return NextResponse.json({ error }, { status: 422 });
        }
    }
    if (
        !["Yes", "No"].includes(draft.existingWebsite || "") ||
        (draft.existingWebsite === "Yes" && !draft.website) ||
        !["Email", "Phone Call"].includes(draft.preference || "") ||
        draft.consent !== "I agree" ||
        body.confirmed !== true ||
        !catalogue.privacyUrl
    )
        return NextResponse.json(
            {
                error: "Please complete your enquiry and confirm privacy consent.",
            },
            { status: 422 },
        );
    const id = request.headers.get("Idempotency-Key");
    if (!id || !/^[a-f0-9-]{36}$/i.test(id))
        return NextResponse.json(
            { error: "Invalid submission identifier." },
            { status: 400 },
        );
    const dedicated = Boolean(
        process.env.CHATBOT_ENQUIRY_API_URL &&
        process.env.CHATBOT_BACKEND_TOKEN,
    );
    const endpoint = dedicated
        ? process.env.CHATBOT_ENQUIRY_API_URL
        : process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "")}/schedule-a-call`
          : undefined;
    const token = process.env.CHATBOT_BACKEND_TOKEN;
    if (!endpoint || (dedicated && !token))
        return NextResponse.json(
            {
                error: "Online enquiry submission is not connected yet. Please use our contact page; your draft remains available here.",
            },
            { status: 503 },
        );
    let url: URL;
    try {
        url = new URL(endpoint);
        if (url.protocol !== "https:") throw new Error();
    } catch {
        return NextResponse.json(
            { error: "Enquiry submission is unavailable." },
            { status: 503 },
        );
    }
    const utm: Record<string, string> = {};
    if (body.utm && typeof body.utm === "object")
        for (const k of [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_term",
            "utm_content",
        ]) {
            const v = (body.utm as Record<string, unknown>)[k];
            if (typeof v === "string") utm[k] = v.slice(0, 200);
        }
    if (!dedicated) {
        for (const field of ["phone", "company"] as const) {
            const error = validate(field, draft[field] || "", draft);
            if (error)
                return NextResponse.json(
                    {
                        error:
                            field === "company"
                                ? "Please add your company name using Edit Details."
                                : error,
                    },
                    { status: 422 },
                );
        }
        const form = websiteEnquiryPrefill(
            draft,
            service.title,
            safePage(body.sourcePage),
            utm,
        );
        form.requirement += `\nPrivacy consent: confirmed ${new Date().toISOString().slice(0, 10)}`;
        const payload = websiteEnquiryPayload(form, "Chatbot enquiry");
        // Do not include the changing consent timestamp in the request fingerprint.
        const hash = createHash("sha256")
            .update(
                JSON.stringify({
                    draft,
                    sourcePage: safePage(body.sourcePage),
                    utm,
                }),
            )
            .digest("hex");
        const now = Date.now();
        for (const [key, entry] of websiteRequests)
            if (entry.expires < now) websiteRequests.delete(key);
        const previous = websiteRequests.get(id);
        if (previous && previous.hash !== hash)
            return NextResponse.json(
                {
                    error: "This enquiry was already submitted or is awaiting confirmation. Please contact our team before submitting changed details.",
                },
                { status: 409 },
            );
        if (!previous && websiteRequests.size >= 1000)
            return NextResponse.json(
                { error: "Please try again shortly." },
                { status: 429 },
            );
        try {
            const task =
                previous?.task ||
                (async () => {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "Idempotency-Key": id,
                        },
                        body: JSON.stringify(payload),
                        signal: AbortSignal.timeout(15000),
                        cache: "no-store",
                        redirect: "error",
                    });
                    const data = await response.json();
                    if (!response.ok || data.status !== "success")
                        throw new Error("Could not confirm submission.");
                    const reference =
                        data.reference ?? data.response_data?.reference;
                    return {
                        accepted: true as const,
                        ...(typeof reference === "string" &&
                        /^[a-zA-Z0-9_-]{3,100}$/.test(reference)
                            ? { reference }
                            : {}),
                    };
                })();
            if (!previous)
                websiteRequests.set(id, {
                    hash,
                    expires: now + 30 * 60 * 1000,
                    task,
                });
            return NextResponse.json(await task, {
                headers: { "Cache-Control": "no-store" },
            });
        } catch {
            return NextResponse.json(
                {
                    error: "We could not confirm submission. Please contact our team before trying again, as the website may already have received your enquiry. Your draft is still available.",
                },
                { status: 502 },
            );
        }
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "Idempotency-Key": id,
            },
            body: JSON.stringify({
                draft,
                serviceTitle: service.title,
                sourcePage: safePage(body.sourcePage),
                utm,
                consentAt: new Date().toISOString(),
            }),
            signal: AbortSignal.timeout(15000),
            cache: "no-store",
            redirect: "error",
        });
        if (!response.ok) throw new Error();
        const receipt = await response.json();
        if (
            receipt.stored !== true ||
            typeof receipt.reference !== "string" ||
            !/^[a-zA-Z0-9_-]{3,100}$/.test(receipt.reference) ||
            !["sent", "queued", "failed"].includes(receipt.notificationStatus)
        )
            throw new Error();
        return NextResponse.json(
            {
                reference: receipt.reference,
                notificationStatus: receipt.notificationStatus,
            },
            { headers: { "Cache-Control": "no-store" } },
        );
    } catch {
        return NextResponse.json(
            {
                error: "We could not confirm receipt. Please retry with the same enquiry or contact our team. Your draft is still available.",
            },
            { status: 502 },
        );
    }
}
