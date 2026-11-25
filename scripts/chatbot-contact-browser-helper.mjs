// All browser fixtures stay local; no contact is posted to the public CMS.
export async function mockContactSave(page) {
    await page.route("**/api/chatbot/contact", (route) =>
        route.fulfill({ json: { accepted: true } }),
    );
}
export async function completeContactGate(chat) {
    const form = chat.getByRole("form", { name: "Your contact details" });
    await form.waitFor({ timeout: 30000 });
    await form
        .getByLabel("Your Name", { exact: true })
        .fill("Browser Test Visitor");
    await form
        .getByLabel("Mobile Number", { exact: true })
        .fill("+12025550123");
    await form
        .getByLabel("Email Id", { exact: true })
        .fill("browser-test@example.invalid");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Submit", exact: true }).click();
    await form.waitFor({ state: "detached" });
}
