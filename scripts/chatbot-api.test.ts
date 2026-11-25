import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../app/api/chatbot/enquiry/route";
import {
    getProjects,
    getCaseStudies,
    getCaseStudy,
} from "../utils/chatbot/catalogue";

test("case studies follow pagination and expose only published project details", async () => {
    const original = global.fetch;
    const api = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://cms.example.invalid/api/";
    const entry = {
        proj_slug: "published-project",
        proj_name: "Published Project",
        proj_status: "1",
        proj_short_desc: "Project overview",
        proj_business_objectives:
            "<ul><li>Improve usability</li><li>Improve accessibility</li></ul>",
        technologies: [{ technology_title: "Next.js" }],
        client_id: 123,
        internal_secret: "must not be returned",
    };
    global.fetch = (async (input: RequestInfo | URL) => {
        const url = new URL(String(input));
        if (url.pathname.endsWith("/project/published-project"))
            return Response.json({ response_code: true, response_data: entry });
        const second = url.searchParams.get("page") === "2";
        return Response.json({
            response_code: true,
            response_data: {
                data: second
                    ? [entry, { ...entry, proj_slug: "second-project" }]
                    : [entry],
                pagination: { has_next: !second },
            },
        });
    }) as typeof fetch;
    try {
        const listing = await getCaseStudies();
        assert.equal(listing?.length, 2);
        assert.equal(listing?.[0].kind, "case-study");
        const detail = await getCaseStudy("published-project");
        assert.equal(detail?.url, "/casestudies/published-project");
        assert.deepEqual(detail?.technologies, ["Next.js"]);
        assert.equal(
            detail?.sections?.[0].content,
            "Improve usability\nImprove accessibility",
        );
        assert.ok(!JSON.stringify(detail).includes("must not be returned"));
        assert.equal(await getCaseStudy("../private"), null);
    } finally {
        global.fetch = original;
        if (api === undefined) delete process.env.NEXT_PUBLIC_API_URL;
        else process.env.NEXT_PUBLIC_API_URL = api;
    }
});

test("enquiry adapter validates consent and requires a durable backend receipt", async () => {
    const previous = {
        api: process.env.NEXT_PUBLIC_API_URL,
        endpoint: process.env.CHATBOT_ENQUIRY_API_URL,
        token: process.env.CHATBOT_BACKEND_TOKEN,
    };
    process.env.NEXT_PUBLIC_API_URL = "https://cms.example.invalid/api/";
    process.env.CHATBOT_ENQUIRY_API_URL =
        "https://cms.example.invalid/chatbot/enquiries";
    process.env.CHATBOT_BACKEND_TOKEN = "test-only-secret";
    const original = global.fetch;
    let upstream = 0;
    let stored = false;
    let submitted: Record<string, unknown> | undefined;
    global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("/chatbot/enquiries")) {
            upstream++;
            assert.equal(
                (init?.headers as Record<string, string>).Authorization,
                "Bearer test-only-secret",
            );
            assert.equal(
                (init?.headers as Record<string, string>)["Idempotency-Key"],
                "11111111-1111-4111-8111-111111111111",
            );
            submitted = JSON.parse(String(init?.body));
            return Response.json(
                stored
                    ? {
                          stored: true,
                          reference: "LOCAL-TEST-REF",
                          notificationStatus: "failed",
                      }
                    : {
                          stored: false,
                          reference: "DO-NOT-SHOW",
                          notificationStatus: "queued",
                      },
            );
        }
        const path = new URL(url).pathname;
        const data = path.endsWith("/category/with-service")
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
            : path.endsWith("/page/privacy-policy")
              ? { description: "Test policy" }
              : [];
        return Response.json({ response_code: true, response_data: data });
    }) as typeof fetch;
    const draft = {
        service: "cms-web-development",
        projectType: "New Project",
        existingWebsite: "No",
        requirements: "A business website",
        budget: "Not Decided Yet",
        timeline: "Flexible",
        name: "Test Visitor",
        email: "visitor@example.invalid",
        preference: "Email",
        consent: "I agree",
    };
    const request = (changes: Record<string, unknown> = {}, confirmed = true) =>
        new NextRequest("http://localhost/api/chatbot/enquiry", {
            method: "POST",
            headers: {
                Origin: "http://localhost",
                "Content-Type": "application/json",
                "Idempotency-Key": "11111111-1111-4111-8111-111111111111",
            },
            body: JSON.stringify({
                draft: { ...draft, ...changes },
                confirmed,
                sourcePage: "//untrusted.invalid",
                utm: { utm_source: "local-test", private: "ignored" },
            }),
        });
    try {
        assert.equal((await POST(request({ email: "invalid" }))).status, 422);
        assert.equal((await POST(request({ consent: "No" }))).status, 422);
        assert.equal(upstream, 0);
        const failed = await POST(request());
        assert.equal(failed.status, 502);
        assert.ok(!(await failed.text()).includes("DO-NOT-SHOW"));
        stored = true;
        const success = await POST(request());
        assert.equal(success.status, 200);
        assert.deepEqual(await success.json(), {
            reference: "LOCAL-TEST-REF",
            notificationStatus: "failed",
        });
        assert.equal(submitted?.sourcePage, "/");
        assert.deepEqual(submitted?.utm, { utm_source: "local-test" });
        assert.ok(!JSON.stringify(submitted).includes("test-only-secret"));
        assert.equal(upstream, 2);
    } finally {
        global.fetch = original;
        for (const [key, value] of [
            ["NEXT_PUBLIC_API_URL", previous.api],
            ["CHATBOT_ENQUIRY_API_URL", previous.endpoint],
            ["CHATBOT_BACKEND_TOKEN", previous.token],
        ]) {
            if (value === undefined) delete process.env[key!];
            else process.env[key!] = value;
        }
    }
});
test("portfolio adapter supports graphic records and linked case studies without inventing URLs", async () => {
    const original = global.fetch;
    const api = process.env.NEXT_PUBLIC_API_URL;
    const media = process.env.NEXT_PUBLIC_MEDIA_URL;
    process.env.NEXT_PUBLIC_API_URL = "https://cms.example.invalid/api/";
    process.env.NEXT_PUBLIC_MEDIA_URL = "https://cms.example.invalid/";
    global.fetch = (async (input: RequestInfo | URL) =>
        Response.json({
            response_code: true,
            response_data: String(input).includes("projects/group/")
                ? {
                      projectGroup: {
                          project_group_title: "Logo Design",
                          Projects: [],
                      },
                  }
                : {
                      portfolio_group_title: "Logo Design",
                      Portfolios: [
                          {
                              portfolio_title: "Published Design",
                              portfolio_status: "1",
                              portfolio_feature_image_path:
                                  "/uploads/portfolio/design.webp",
                          },
                          {
                              portfolio_title: "Hidden Design",
                              portfolio_status: "0",
                          },
                      ],
                  },
        })) as typeof fetch;
    try {
        const items = await getProjects("logo-design");
        assert.equal(items.length, 1);
        assert.equal(items[0].url, "/portfolio/logo-design");
        assert.equal(
            items[0].image,
            "https://cms.example.invalid/uploads/portfolio/design.webp",
        );
        assert.deepEqual(await getProjects("../private"), []);
    } finally {
        global.fetch = original;
        if (api === undefined) delete process.env.NEXT_PUBLIC_API_URL;
        else process.env.NEXT_PUBLIC_API_URL = api;
        if (media === undefined) delete process.env.NEXT_PUBLIC_MEDIA_URL;
        else process.env.NEXT_PUBLIC_MEDIA_URL = media;
    }
});
