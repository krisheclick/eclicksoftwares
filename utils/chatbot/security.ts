import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
const buckets = new Map<string, { count: number; expires: number }>();
// Single-process guard. A trusted proxy and shared limiter are required for scaling.
export function protect(request: NextRequest, limit = 20): NextResponse | null {
    if (process.env.CHATBOT_ENABLED === "false")
        return NextResponse.json(
            { error: "Assistant disabled." },
            { status: 404 },
        );
    const origin = request.headers.get("origin");
    if (
        !origin ||
        origin !== request.nextUrl.origin ||
        request.headers.get("sec-fetch-site") === "cross-site"
    )
        return NextResponse.json(
            { error: "Request not allowed." },
            { status: 403 },
        );
    if (!request.headers.get("content-type")?.startsWith("application/json"))
        return NextResponse.json({ error: "JSON required." }, { status: 415 });
    const identity =
        process.env.CHATBOT_TRUST_PROXY === "true"
            ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
              "unknown"
            : "single-origin";
    const key = createHash("sha256")
        .update(identity + "|" + request.nextUrl.pathname)
        .digest("hex");
    const now = Date.now();
    for (const [k, v] of buckets) if (v.expires <= now) buckets.delete(k);
    const bucket = buckets.get(key) || { count: 0, expires: now + 60000 };
    if (bucket.count >= limit)
        return NextResponse.json(
            { error: "Please wait a minute before trying again." },
            {
                status: 429,
                headers: {
                    "Retry-After": String(
                        Math.ceil((bucket.expires - now) / 1000),
                    ),
                },
            },
        );
    if (buckets.size >= 10000 && !buckets.has(key))
        return NextResponse.json(
            { error: "Please try again shortly." },
            { status: 429 },
        );
    bucket.count++;
    buckets.set(key, bucket);
    return null;
}
export async function readBody(
    request: NextRequest,
    max = 16000,
): Promise<Record<string, unknown>> {
    if (Number(request.headers.get("content-length")) > max)
        throw new Error("Request too large.");
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Invalid request.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > max) {
            await reader.cancel();
            throw new Error("Request too large.");
        }
        chunks.push(value);
    }
    const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data))
        throw new Error("Invalid request.");
    return data as Record<string, unknown>;
}
export function redact(text: string): string {
    return text
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email removed]")
        .replace(/(?:\+?\d[\d ()-]{6,}\d)/g, "[number removed]")
        .replace(
            /(?:api[_ -]?key|password|secret|token)\s*[:=]\s*\S+/gi,
            "[credential removed]",
        );
}
export const safePage = (value: unknown): string =>
    typeof value === "string" && /^\/(?!\/)[a-zA-Z0-9/_-]{0,250}$/.test(value)
        ? value
        : "/";
