import { mockContactSave, completeContactGate } from "./chatbot-contact-browser-helper.mjs";
import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
    executablePath:
        process.env.CHROME_PATH ||
        "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
});
try {
    const page = await browser.newPage();
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
    await chat.waitFor();
    await page.evaluate(() => {
        window.sequenceErrors = [];
        const inspect = () => {
            const replies = [
                ...document.querySelectorAll("#eclick-chat p[aria-busy]"),
            ];
            const typing = replies.filter(
                (p) => p.getAttribute("aria-busy") === "true",
            );
            if (typing.length > 1)
                window.sequenceErrors.push("Multiple replies typing at once");
            if (
                replies
                    .slice(0, -1)
                    .some((p) => p.getAttribute("aria-busy") === "true")
            )
                window.sequenceErrors.push(
                    "Next reply appeared before the previous finished",
                );
        };
        window.sequenceObserver = new MutationObserver(inspect);
        window.sequenceObserver.observe(
            document.getElementById("eclick-chat"),
            {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ["aria-busy"],
            },
        );
        inspect();
    });
    await chat
        .getByRole("button", { name: "View Case Studies", exact: true })
        .waitFor({ timeout: 30000 });
    assert.equal(await chat.locator("p[aria-busy]").count(), 2);
    assert.equal(await chat.locator('p[aria-busy="true"]').count(), 0);
    await chat
        .getByRole("button", { name: "View Case Studies", exact: true })
        .click();
    await completeContactGate(chat);
    await chat.locator('p[aria-busy="true"]').waitFor();
    assert.equal(
        await chat.locator("article").count(),
        0,
        "Cards wait for the reply to finish",
    );
    assert.equal(await chat.locator("textarea").isDisabled(), true);
    await chat
        .getByRole("button", { name: "Show More Case Studies", exact: true })
        .waitFor({ timeout: 30000 });
    assert.equal(await chat.locator("article").count(), 3);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await chat.getByRole("button", { name: "Main Menu", exact: true }).click();
    await chat
        .getByRole("button", { name: "View Case Studies", exact: true })
        .waitFor();
    assert.equal(await chat.locator('p[aria-busy="true"]').count(), 0);
    await chat
        .getByRole("button", { name: "Close conversation", exact: true })
        .click();
    await page
        .getByRole("button", { name: "Open Eclick AI Assistant", exact: true })
        .click();
    assert.equal(
        await chat.locator('p[aria-busy="true"]').count(),
        0,
        "Completed replies do not replay on reopen",
    );
    const failures = await page.evaluate(() => {
        window.sequenceObserver.disconnect();
        return window.sequenceErrors;
    });
    assert.deepEqual(failures, []);
    console.log(
        "Verified sequential welcome and multi-message replies, delayed cards/options, reduced motion and no replay on reopen.",
    );
} finally {
    await browser.close();
}
