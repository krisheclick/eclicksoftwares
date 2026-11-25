import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("requestfailed", (r) =>
    console.log("REQUEST FAILED", r.url(), r.failure()?.errorText),
);
await page.goto("https://modibuilders.com/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
});
await page.waitForTimeout(12000);
await page.locator("#floatPositionChange").click();
await page.waitForTimeout(4000);
console.log(
    "FRAMES",
    page.frames().map((f) => ({ url: f.url(), name: f.name() })),
);
for (const [i, frame] of page.frames().entries()) {
    console.log(
        "FRAME",
        i,
        (
            await frame
                .locator("body")
                .innerText()
                .catch(() => "")
        ).slice(-16000),
    );
    console.log(
        "BUTTONS",
        i,
        await frame
            .locator("button,[role=button],iframe")
            .evaluateAll((nodes) =>
                nodes.map((n) => ({
                    text: n.textContent?.slice(0, 120),
                    label: n.getAttribute("aria-label"),
                    id: n.id,
                    class: n.className,
                    src: n.getAttribute("src"),
                })),
            )
            .catch(() => []),
    );
}
await page.screenshot({
    path: "docs/chatbot/reference-desktop.png",
    fullPage: false,
});
await writeFile("docs/chatbot/reference-dom.html", await page.content());
await page.setViewportSize({ width: 375, height: 812 });
await page.screenshot({ path: "docs/chatbot/reference-mobile.png" });
console.log(
    "MOBILE",
    await page
        .locator(".whatsapp-container,.whatsapp-widget,.whatsapp-body")
        .innerText()
        .catch(() => ""),
);
await browser.close();
