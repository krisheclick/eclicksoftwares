import { mockContactSave, completeContactGate } from "./chatbot-contact-browser-helper.mjs";
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({
    executablePath:
        process.env.CHROME_PATH ||
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
});
await mkdir("test-results", { recursive: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
let submitted = 0;
let submissionKey = "";
await page.route("**/api/chatbot/catalogue", async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    // Enable only inside this isolated test browser. Submission is always intercepted.
    await route.fulfill({ response, json: { ...data, enquiryEnabled: true, enquiryMode: 'dedicated' } });
});
await page.route("**/api/chatbot/enquiry", async (route) => {
    submitted++;
    const body = route.request().postDataJSON();
    assert.equal(body.confirmed, true);
    assert.equal(body.draft.consent, "I agree");
    const key = route.request().headers()["idempotency-key"];
    if (submissionKey) assert.equal(key, submissionKey);
    else submissionKey = key;
    if (submitted === 1)
        return route.fulfill({
            status: 503,
            json: { error: "Test backend unavailable" },
        });
    await route.fulfill({
        status: 200,
        json: { reference: "TEST-LOCAL-ONLY", notificationStatus: "failed" },
    });
});
await page.route("**/api/chat", async (route) => {
    const body = route.request().postDataJSON();
    assert.equal(body.draft, undefined);
    assert.equal(
        (body.history || []).some((h) => h.text.includes("browser-test@")),
        false,
    );
    if (body.purpose === "requirements")
        return route.fulfill({
            status: 200,
            json: {
                answer: "Should customers be able to search and filter your products?",
            },
        });
    await route.fulfill({
        status: 503,
        json: { error: "AI is unavailable in this offline test" },
    });
});
try {
    await mockContactSave(page);
    const r = await page.goto(
        process.env.CHATBOT_TEST_URL || "http://localhost:3000/",
        { waitUntil: "domcontentloaded", timeout: 90000 },
    );
    assert.equal(r.status(), 200);
    // The assistance timer is installed by the hydrated launcher. Avoid clicking
    // server-rendered markup before React has attached the event handlers.
    await page
        .getByRole("button", {
            name: "Would You Like Some Assistance?",
            exact: true,
        })
        .waitFor({ timeout: 30000 });
    assert.equal(
        await page.getByRole("dialog", { name: "Eclick AI Assistant" }).count(),
        0,
    );
    await page
        .getByRole("button", {
            name: "Dismiss assistance message",
            exact: true,
        })
        .click();
    await page
        .getByRole("button", { name: "Open Eclick AI Assistant", exact: true })
        .click();
    const chat = page.getByRole("dialog", { name: "Eclick AI Assistant" });
    await chat
        .getByRole("button", { name: "Explore Our Services", exact: true })
        .waitFor({ timeout: 45000 });
    await page.screenshot({ path: "test-results/chatbot-desktop.png" });
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
        .waitFor({ timeout: 30000 });
    assert.match(await chat.innerText(), /WordPress/);
    await chat
        .getByRole("button", { name: "Discuss My Project", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "New Project", exact: true })
        .click();
    await chat.getByRole("button", { name: "Skip", exact: true }).click();
    await chat.getByRole("button", { name: "No", exact: true }).click();
    const input = chat.locator("textarea");
    await input.fill("A company website with a product catalogue.");
    await input.press("Enter");
    await chat
        .getByRole("button", {
            name: "Refine Requirements with AI",
            exact: true,
        })
        .click();
    await chat
        .getByText(
            "Should customers be able to search and filter your products?",
            { exact: true },
        )
        .waitFor();
    await input.fill("Search and category filters.");
    await input.press("Enter");
    await chat
        .getByRole("button", { name: "Ask a Question", exact: true })
        .click();
    await input.fill("Do you support WordPress?");
    await input.press("Enter");
    await chat.getByRole("alert").filter({ hasText: "offline test" }).waitFor();
    await chat
        .getByRole("button", { name: "Continue My Enquiry", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "Not Decided Yet", exact: true })
        .waitFor();
    await chat
        .getByRole("button", { name: "Not Decided Yet", exact: true })
        .click();
    await chat.getByRole("button", { name: "Flexible", exact: true }).click();
    await input.fill("Browser Test");
    await input.press("Enter");
    await input.fill("bad-email");
    await input.press("Enter");
    await chat.getByRole("alert").filter({ hasText: "valid email" }).waitFor();
    await input.fill("browser-test@example.invalid");
    await input.press("Enter");
    await chat.getByRole("button", { name: "Skip", exact: true }).click();
    await chat.getByRole("button", { name: "Skip", exact: true }).click();
    await chat.getByRole("button", { name: "Email", exact: true }).click();
    await chat.getByRole("button", { name: "I agree", exact: true }).click();
    await chat
        .getByRole("button", { name: "Confirm & Submit", exact: true })
        .waitFor();
    await chat.getByRole('link',{name:'Read service details',exact:true}).first().click();
    await page.waitForURL('**/solutions/web-development/cms-web-development');
    assert.match(await chat.locator('dl').innerText(),/browser-test@example.invalid/);
    await page.screenshot({ path: "test-results/chatbot-review.png" });
    // Never submit a test enquiry to the real backend. Verify client isolation.
    await chat
        .getByRole("button", { name: "Edit Details", exact: true })
        .click();
    await chat.getByRole("button", { name: "Name", exact: true }).click();
    await input.fill("Updated Browser Test");
    await input.press("Enter");
    assert.match(await chat.locator("dl").innerText(), /Updated Browser Test/);
    await chat.getByRole("button", { name: "Main Menu", exact: true }).click();
    await chat
        .getByRole("button", { name: "Continue Enquiry", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "Confirm & Submit", exact: true })
        .waitFor();
    await chat
        .getByRole("button", { name: "Confirm & Submit", exact: true })
        .click();
    await chat
        .getByRole("alert")
        .filter({ hasText: "Test backend unavailable" })
        .waitFor();
    await chat
        .getByRole("button", { name: "Confirm & Submit", exact: true })
        .click();
    await chat.getByText(/Enquiry reference: TEST-LOCAL-ONLY/).waitFor();
    assert.equal(submitted, 2);
    for (const width of [300, 375, 768, 1920]) {
        await page.setViewportSize({ width, height: width < 500 ? 812 : 1000 });
        const b = await chat.boundingBox();
        assert.ok(
            b.x >= 0 && b.x + b.width <= width + 1,
            `Panel fits ${width}px`,
        );
        assert.ok(await input.isVisible());
        assert.ok(
            await chat.evaluate((el) => el.scrollWidth <= el.clientWidth),
        );
        await page.screenshot({ path: `test-results/chatbot-${width}.png` });
    }
    await chat.getByRole("button", { name: "Main Menu", exact: true }).click();
    await chat
        .getByRole("button", { name: "About Eclick Softwares", exact: true })
        .click();
    await chat
        .getByRole("link", { name: "Read More", exact: true })
        .last()
        .waitFor();
    await chat.getByRole("button", { name: "Main Menu", exact: true }).click();
    await chat
        .getByRole("button", { name: "View Our Portfolio", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "Website Design", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "Use as Inspiration", exact: true })
        .first()
        .waitFor();
    await chat
        .getByRole("button", { name: "Use as Inspiration", exact: true })
        .first()
        .click();
    await chat.getByText(/as inspiration for your enquiry/).waitFor();
    await chat.getByRole("button", { name: "Main Menu", exact: true }).click();
    await chat
        .getByRole("button", { name: "Technologies We Use", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "Web Development", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "CMS Web Development", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "WordPress", exact: true })
        .waitFor();
    await chat.getByRole("button", { name: "Main Menu", exact: true }).click();
    await chat
        .getByRole("button", { name: "Contact Our Team", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "View Office Locations", exact: true })
        .click();
    await chat.getByText(/Godrej Genesis/).waitFor();
    await chat
        .getByRole("button", { name: "Restart conversation", exact: true })
        .click();
    await chat
        .getByRole("button", { name: "Start New Conversation", exact: true })
        .click();
    assert.equal(await chat.locator("dl").count(), 0);
    await chat.getByRole('button',{name:'Get a Free Quote',exact:true}).click();
    await completeContactGate(chat);
    await chat.getByRole('button',{name:'Main Menu',exact:true}).click();
    await chat.getByRole('button',{name:'Continue Enquiry',exact:true}).click();
    await chat.getByRole('button',{name:'Web Development',exact:true}).click();
    await chat.getByRole('button',{name:'Main Menu',exact:true}).click();
    await chat.getByRole('button',{name:'Continue Enquiry',exact:true}).click();
    await chat.getByRole('button',{name:'CMS Web Development',exact:true}).waitFor();
    await input.press("Escape");
    await chat.waitFor({ state: "hidden" });
    assert.equal(
        await page.evaluate(() =>
            sessionStorage.getItem("eclick-assistance-dismissed"),
        ),
        "1",
    );
    console.log(
        "Browser service, about, portfolio, technology, contact, enquiry, AI failure/resume, edit, consent, submission failure/retry/receipt, restart and responsive checks passed.",
    );
    console.log("Page errors:", JSON.stringify(errors));
} catch (error) {
    await page.screenshot({ path: "test-results/chatbot-failure.png" });
    console.log(
        "Failure view:",
        (
            await page
                .locator("#eclick-chat")
                .innerText()
                .catch(() => "")
        ).slice(-3000),
    );
    console.log("Page errors:", JSON.stringify(errors));
    throw error;
} finally {
    await browser.close();
}
