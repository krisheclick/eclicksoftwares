import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../app/api/chatbot/contact/route";

test("contact gate validates consent, uses contact-us schema and requires confirmed success", async () => {
    const originalFetch = global.fetch;
    const originalBase = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://cms.example.invalid/api/v1/";
    const contact = {
        name: "Test Visitor",
        phone: "+12025550123",
        email: "visitor@example.com",
        consent: true,
        interest: "Explore Our Services",
    };
    const request = (body: object) =>
        new NextRequest("http://localhost/api/chatbot/contact", {
            method: "POST",
            headers: {
                origin: "http://localhost",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    let calls = 0;
    let accepted = false;
    global.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
        calls++;
        assert.equal(
            String(url),
            "https://cms.example.invalid/api/v1/contact-us",
        );
        const payload = JSON.parse(String(init?.body));
        assert.equal(payload.phone_number, contact.phone);
        assert.equal(payload.name, contact.name);
        assert.equal(payload.email, contact.email);
        assert.equal(payload.policyCheck, true);
        assert.equal(payload.newsletterCheck, false);
        assert.match(payload.message, /Explore Our Services/);
        return Response.json({ response_code: accepted });
    }) as typeof fetch;
    try {
        assert.equal(
            (await POST(request({ ...contact, consent: false }))).status,
            400,
        );
        assert.equal(
            (await POST(request({ ...contact, phone: "invalid" }))).status,
            400,
        );
        assert.equal(calls, 0);
        const failed = await POST(request(contact));
        assert.equal(failed.status, 502);
        assert.equal((await failed.json()).accepted, undefined);
        accepted = true;
        const success = await POST(request(contact));
        assert.equal(success.status, 200);
        assert.equal((await success.json()).accepted, true);
    } finally {
        global.fetch = originalFetch;
        if (originalBase === undefined) delete process.env.NEXT_PUBLIC_API_URL;
        else process.env.NEXT_PUBLIC_API_URL = originalBase;
    }
});
