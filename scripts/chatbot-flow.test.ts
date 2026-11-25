import test from "node:test";
import assert from "node:assert/strict";
import {
    answer,
    back,
    go,
    initialState,
    validate,
    options,
} from "../utils/chatbot/flow";
import type { Catalogue } from "../utils/chatbot/types";
import { NextRequest } from "next/server";
import { protect, readBody, redact, safePage } from "../utils/chatbot/security";
test("conditional enquiry skips URL and back restores original answer", () => {
    let s = { ...initialState(), step: "EXISTING_WEBSITE", enquiry: true };
    s = answer(s, "No").state;
    assert.equal(s.step, "PROJECT_REQUIREMENTS");
    assert.equal(s.draft.website, "");
    s = back(s);
    assert.equal(s.step, "EXISTING_WEBSITE");
    assert.equal(s.draft.existingWebsite, undefined);
    s = answer(s, "Yes").state;
    assert.equal(s.step, "WEBSITE_URL");
    assert.ok(answer(s, "javascript:alert(1)").error);
    s = answer(s, "https://example.org").state;
    assert.equal(s.step, "PROJECT_REQUIREMENTS");
});
test("edits return to review and optional phone changes preference safely", () => {
    let s = {
        ...initialState(),
        step: "CONTACT_EMAIL",
        editing: true,
        draft: { name: "A Visitor" },
    };
    assert.ok(answer(s, "invalid").error);
    const result = answer(s, "visitor@example.org");
    assert.equal(result.state.step, "REVIEW_ENQUIRY");
    assert.equal(result.state.draft.name, "A Visitor");
    const phone = answer(
        {
            ...result.state,
            step: "CONTACT_PHONE",
            draft: { ...result.state.draft, preference: "Phone Call" },
        },
        "",
        true,
    );
    assert.equal(phone.state.draft.preference, "Email");
    assert.ok(validate("preference", "Phone Call", {}));
    assert.ok(validate("phone", "123"));
    assert.equal(validate("phone", "+91 98765 43210"), "");
});
test("required fields cannot be skipped and consent cancellation clears draft", () => {
    const s = {
        ...initialState(),
        step: "CONTACT_NAME",
        draft: { email: "private@example.org" },
        enquiry: true,
    };
    assert.ok(answer(s, "", true).error);
    const result = answer({ ...s, step: "PRIVACY_CONSENT" }, "Cancel");
    assert.equal(result.state.step, "MAIN_MENU");
    assert.deepEqual(result.state.draft, {});
    assert.equal(result.state.enquiry, false);
});
test("navigation and branching preserve draft, service and selected context", () => {
    const s = {
        ...initialState(),
        step: "PROJECT_BUDGET",
        draft: { service: "cms-web-development", name: "Visitor" },
        context: { category: "web-development" },
    };
    const paused = go(s, "MAIN_MENU");
    assert.deepEqual(paused.draft, s.draft);
    assert.equal(back(paused).step, "PROJECT_BUDGET");
    assert.deepEqual(back(paused).context, s.context);
    const c = {
        categories: [{ id: "graphics-design", services: [{ id: "logo" }] }],
        industries: [],
        budgets: ["Flexible"],
    } as unknown as Catalogue;
    const opts = options(
        { ...s, step: "PROJECT_TYPE", draft: { service: "logo" } },
        c,
    );
    assert.ok(!opts.some((o) => o.label === "Redesign Existing Website"));
});
test("origin, content-type, size and rate limits reject abusive requests", async () => {
    const req = (origin: string, type = "application/json", body = "{}") =>
        new NextRequest("http://localhost/api/chat", {
            method: "POST",
            headers: { origin, "Content-Type": type },
            body,
        });
    assert.equal(protect(req("https://attacker.invalid"))?.status, 403);
    assert.equal(protect(req("http://localhost", "text/plain"))?.status, 415);
    assert.equal(protect(req("http://localhost"), 1), null);
    assert.equal(protect(req("http://localhost"), 1)?.status, 429);
    await assert.rejects(() =>
        readBody(
            req(
                "http://localhost",
                "application/json",
                JSON.stringify({ message: "x".repeat(100) }),
            ),
            10,
        ),
    );
});
test("personal data redaction and page validation", () => {
    const text = redact(
        "Email visitor@example.org or +91 98765 43210, api_key=abc123",
    );
    assert.ok(!text.includes("visitor@"));
    assert.ok(!text.includes("98765"));
    assert.ok(!text.includes("abc123"));
    assert.equal(safePage("//evil.invalid"), "/");
    assert.equal(
        safePage("/solutions/web-development"),
        "/solutions/web-development",
    );
});
test("optional AI followup appends to requirements and skip preserves them", () => {
    const s = {
        ...initialState(),
        step: "PROJECT_FOLLOWUP",
        draft: { requirements: "Original project description" },
    };
    assert.equal(
        answer(s, "", true).state.draft.requirements,
        "Original project description",
    );
    assert.match(
        answer(s, "Needs product filters").state.draft.requirements || "",
        /Original project description\nAdditional detail: Needs product filters/,
    );
});
