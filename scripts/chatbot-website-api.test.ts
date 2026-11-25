import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../app/api/chatbot/enquiry/route";
import {
    websiteEnquiryPayload,
    websiteEnquiryPrefill,
} from "../utils/chatbot/websiteEnquiry";

test("chat and website form share the existing field names and preserve project context", () => {
    const form = websiteEnquiryPrefill(
        {
            name: "Test",
            email: "test@example.invalid",
            phone: "+919876543210",
            company: "Test Company",
            service: "cms-web-development",
            requirements: "A catalogue",
            budget: "Flexible",
            project: "Example project",
        },
        "CMS Web Development",
        "/solutions",
    );
    const payload = websiteEnquiryPayload(form, "Chatbot enquiry");
    assert.equal(payload.sc_full_name, "Test");
    assert.equal(payload.service, "cms-web-development");
    assert.match(payload.sc_message, /Company: Test Company/);
    assert.match(payload.sc_message, /Project inspiration: Example project/);
    assert.equal(
        (payload.sc_message.match(/Company: Test Company/g) || []).length,
        1,
    );
});

test("website API accepts only confirmed success and duplicate requests reuse the receipt", async () => {
    const old = {
        api: process.env.NEXT_PUBLIC_API_URL,
        url: process.env.CHATBOT_ENQUIRY_API_URL,
        token: process.env.CHATBOT_BACKEND_TOKEN,
    };
    process.env.NEXT_PUBLIC_API_URL = "https://cms.example.invalid/api/v1/";
    delete process.env.CHATBOT_ENQUIRY_API_URL;
    delete process.env.CHATBOT_BACKEND_TOKEN;
    const original = global.fetch;
    let posts = 0;
    let payload: Record<string, unknown> = {};
    global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const path = new URL(String(input)).pathname;
        if (init?.method === "POST") {
            assert.equal(path, "/api/v1/schedule-a-call");
            posts++;
            payload = JSON.parse(String(init.body));
            return Response.json({
                status: "success",
                msg: "Enquiry received",
            });
        }
        const value = path.endsWith("category/with-service")
            ? [
                  {
                      service_category_slug: "web-development",
                      service_category_title: "Web Development",
                      services: [
                          {
                              service_slug: "cms-web-development",
                              service_title: "CMS Web Development",
                          },
                      ],
                  },
              ]
            : path.endsWith("page/privacy-policy")
              ? { description: "Policy" }
              : [];
        return Response.json({ response_code: true, response_data: value });
    }) as typeof fetch;
    const draft = {
        service: "cms-web-development",
        projectType: "New Project",
        existingWebsite: "No",
        requirements: "A product catalogue",
        budget: "Flexible",
        timeline: "Flexible",
        name: "Test Visitor",
        email: "test@example.invalid",
        phone: "+919876543210",
        company: "Test Company",
        preference: "Email",
        consent: "I agree",
    };
    const request = (changes = {}) =>
        new NextRequest("http://localhost/api/chatbot/enquiry", {
            method: "POST",
            headers: {
                Origin: "http://localhost",
                "Content-Type": "application/json",
                "Idempotency-Key": "22222222-2222-4222-8222-222222222222",
            },
            body: JSON.stringify({
                draft: { ...draft, ...changes },
                confirmed: true,
                sourcePage: "/solutions",
            }),
        });
    try {
        assert.equal((await POST(request({ phone: "" }))).status, 422);
        assert.equal(posts, 0);
        const success = await POST(request());
        assert.equal(success.status, 200);
        assert.deepEqual(await success.json(), { accepted: true });
        const retry = await POST(request());
        assert.equal(retry.status, 200);
        assert.deepEqual(await retry.json(), { accepted: true });
        assert.equal(posts, 1);
        assert.equal(payload.sc_business_email, draft.email);
        assert.equal(payload.sc_flag, "Chatbot enquiry");
        assert.match(String(payload.sc_message), /A product catalogue/);
        assert.equal(
            (await POST(request({ requirements: "Changed after submission" })))
                .status,
            409,
        );
        assert.equal(posts, 1);
    } finally {
        global.fetch = original;
        for (const [key, value] of [
            ["NEXT_PUBLIC_API_URL", old.api],
            ["CHATBOT_ENQUIRY_API_URL", old.url],
            ["CHATBOT_BACKEND_TOKEN", old.token],
        ]) {
            if (value === undefined) delete process.env[key!];
            else process.env[key!] = value;
        }
    }
});
