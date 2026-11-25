import { NextRequest, NextResponse } from "next/server";
import { protect, readBody, redact } from "@/utils/chatbot/security";

export async function POST(request: NextRequest) {
    const blocked = protect(request, 5);
    if (blocked) return blocked;
    let body: Record<string, unknown>;
    try {
        body = await readBody(request, 5000);
    } catch {
        return NextResponse.json(
            { error: "Invalid contact details." },
            { status: 400 },
        );
    }
    const clean = (key: string) =>
        typeof body[key] === "string" ? String(body[key]).trim() : "";
    const name = clean("name"),
        email = clean("email"),
        phone = clean("phone");
    if (
        name.length < 2 ||
        name.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 254 ||
        !/^\+?[\d ()-]{7,25}$/.test(phone) ||
        phone.replace(/\D/g, "").length < 7 ||
        body.consent !== true
    ) {
        return NextResponse.json(
            {
                error: "Please enter valid contact details and accept the Privacy Policy.",
            },
            { status: 400 },
        );
    }
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base)
        return NextResponse.json(
            { error: "Contact submission is temporarily unavailable." },
            { status: 503 },
        );
    try {
        const response = await fetch(`${base.replace(/\/+$/, "")}/contact-us`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            cache: "no-store",
            signal: AbortSignal.timeout(20000),
            body: JSON.stringify({
                name,
                email,
                phone_number: phone,
                service: "",
                budget: "Not specified",
                message: `Chatbot contact request. Interested in: ${redact(clean("interest")).slice(0, 500) || "Website assistance"}`,
                policyCheck: true,
                newsletterCheck: false,
            }),
        });
        const result = await response.json();
        if (
            !response.ok ||
            result.response_code === false ||
            result.status === "error" ||
            !(result.response_code === true || result.status === "success")
        ) {
            return NextResponse.json(
                {
                    error: "Your contact details were not confirmed as saved. Please try again.",
                },
                { status: 502 },
            );
        }
        return NextResponse.json(
            { accepted: true },
            { headers: { "Cache-Control": "no-store" } },
        );
    } catch {
        return NextResponse.json(
            {
                error: "We could not confirm your submission. Please try again shortly.",
            },
            { status: 502 },
        );
    }
}
