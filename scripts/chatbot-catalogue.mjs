import assert from "node:assert/strict";
const base = process.env.CHATBOT_TEST_URL || "http://localhost:3000/";
async function get(query = "") {
    const r = await fetch(new URL(`/api/chatbot/catalogue${query}`, base), {
        signal: AbortSignal.timeout(30000),
    });
    assert.equal(r.status, 200, query);
    return r.json();
}
const data = await get();
const services = data.categories.flatMap((c) => c.services);
assert.ok(services.length);
const results = [];
for (let offset = 0; offset < services.length; offset += 4) {
    await Promise.all(
        services.slice(offset, offset + 4).map(async (s) => {
            const d = await get(`?service=${s.id}`);
            assert.ok(d.title);
            assert.equal(d.id, s.id);
            assert.equal(
                d.url,
                d.detailAvailable === false ? "/solutions" : s.url,
            );
            results.push({
                id: s.id,
                description: !!d.description,
                detailAvailable: d.detailAvailable !== false,
                technologies: d.technologies.length,
            });
        }),
    );
}
const portfolio = [];
for (const group of data.portfolio) {
    const projects = await get(`?group=${group.id}`);
    for (const p of projects) {
        assert.ok(p.title);
        assert.ok(/^\/(casestudies|portfolio)\/[a-zA-Z0-9-]+$/.test(p.url));
    }
    portfolio.push({ category: group.title, count: projects.length });
}
console.log(
    JSON.stringify(
        {
            categories: data.categories.length,
            services: results.length,
            servicesWithoutDescription: results
                .filter((s) => !s.description)
                .map((s) => s.id),
            listedServicesWithoutDetailPage: results
                .filter((s) => !s.detailAvailable)
                .map((s) => s.id),
            portfolio,
        },
        null,
        2,
    ),
);
