import { mockContactSave, completeContactGate } from "./chatbot-contact-browser-helper.mjs";
import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
    executablePath:
        process.env.CHROME_PATH ||
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
let posts = 0;
// All enquiry writes are intercepted in this browser; no test lead is sent.
await page.route(/\/schedule-a-call(?:\?.*)?$/, async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    posts++;
    const body = route.request().postDataJSON();
    assert.equal(body.sc_full_name, "Website Form Test");
    assert.equal(body.sc_business_email, "website-test@example.invalid");
    assert.equal(body.service, "cms-web-development");
    assert.equal(body.sc_flag, "Chatbot enquiry");
    assert.match(body.sc_message, /A catalogue website/);
    assert.match(body.sc_message, /Company: Test Company/);
    await route.fulfill({
        status: 200,
        json: { status: "success", msg: "Local test only" },
    });
});
try {
    await mockContactSave(page);
    await page.goto(process.env.CHATBOT_TEST_URL || "http://localhost:3000/", {
        waitUntil: "domcontentloaded",
        timeout: 90000,
    });
    await page
        .getByRole("button", {
            name: "Would You Like Some Assistance?",
            exact: true,
        })
        .waitFor({ timeout: 30000 });
    await page
        .getByRole("button", { name: "Open Eclick AI Assistant", exact: true })
        .click();
    const chat = page.getByRole("dialog", { name: "Eclick AI Assistant" });
    await chat
        .getByRole("button", { name: "Explore Our Services", exact: true })
        .waitFor({ timeout: 30000 });
    await chat
        .getByRole("button", { name: "Explore Our Services", exact: true })
        .click();
    await completeContactGate(chat);
    await chat
        .getByRole("button", { name: "Web Development", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "CMS Web Development", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "Discuss My Project", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "New Project", exact: true })
        .click();
    await chat.getByRole("button", { name: "Skip", exact: true }).click();
    await chat.getByRole("button", { name: "No", exact: true }).click();
    const field = chat.locator("textarea");
    await field.fill("A catalogue website");
    await field.press("Enter");
    await chat
        .getByRole("button", { name: "Not Decided Yet", exact: true })
        .click();
    await chat.getByRole("button", { name: "Flexible", exact: true }).click();
    await field.fill("Website Form Test");
    await field.press("Enter");
    await field.fill("website-test@example.invalid");
    await field.press("Enter");
    await chat
        .getByText(
            "Could you provide a contact number, including your country code?",
            { exact: true },
        )
        .first()
        .waitFor();
    assert.equal(
        await chat.getByRole("button", { name: "Skip", exact: true }).count(),
        0,
    );
    await field.fill("+919876543210");
    await field.press("Enter");
    await field.fill("Test Company");
    await field.press("Enter");
    await chat.getByRole("button", { name: "Email", exact: true }).click();
    await chat.getByRole("button", { name: "I agree", exact: true }).click();
    await chat
        .getByRole("button", { name: "Use Website Form", exact: true })
        .click();
    const form = page
        .getByRole("dialog")
        .filter({ has: page.locator('input[name="fullName"]') });
    await form.waitFor();
    assert.equal(
        await form.locator('input[name="fullName"]').inputValue(),
        "Website Form Test",
    );
    assert.equal(
        await form.locator('input[name="email"]').inputValue(),
        "website-test@example.invalid",
    );
    assert.equal(
        await form.locator('input[name="phone"]').inputValue(),
        "+919876543210",
    );
    assert.match(
        await form.locator('textarea[name="requirement"]').inputValue(),
        /A catalogue website/,
    );
    assert.equal(posts, 0);
    await form
        .getByRole("button", { name: "Send Enquiry", exact: true })
        .click();
    assert.equal(
        posts,
        0,
        "Consent is required before the existing website API is called",
    );
    await form.locator('input[name="privacyConsent"]').check();
    await form
        .getByRole("button", { name: "Send Enquiry", exact: true })
        .click();
    await page.waitForURL("**/lets-connect/thank-you");
    assert.equal(posts, 1);
    await page
        .getByRole("button", { name: "Open Eclick AI Assistant", exact: true })
        .click();
    await chat
        .getByText(
            "Your enquiry has been submitted successfully through our website form. Our team will review your requirements and contact you as soon as possible.",
            { exact: true },
        )
        .first()
        .waitFor();
    assert.equal(
        await chat
            .getByRole("button", { name: "Confirm & Submit", exact: true })
            .count(),
        0,
    );
    console.log(
        "Verified: existing website form, chat prefill, privacy consent and original API payload. Submission intercepted locally.",
    );
} catch (error) {
    await page.screenshot({
        path: "test-results/chatbot-website-form-failure.png",
    });
    throw error;
} finally {
    await browser.close();
}
