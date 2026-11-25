import { publicText } from "@/utils/chatbotKnowledge";
import type { Catalogue, Project, Service } from "./types";

type Row = Record<string, unknown>;
export const row = (v: unknown): Row =>
    v && typeof v === "object" && !Array.isArray(v) ? (v as Row) : {};
const rows = (v: unknown): Row[] => (Array.isArray(v) ? v.map(row) : []);
const text = (v: unknown) =>
    typeof v === "string" ? publicText(v).trim() : "";
export async function cms(path: string): Promise<unknown> {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return null;
    try {
        const r = await fetch(`${base.replace(/\/+$/, "")}/${path}`, {
            next: { revalidate: 300 },
            signal: AbortSignal.timeout(8000),
        });
        if (!r.ok) return null;
        const d = await r.json();
        return d.response_code === true ? d.response_data : null;
    } catch {
        return null;
    }
}
const slug = (v: unknown) =>
    typeof v === "string" && /^[a-z0-9][a-z0-9-]*$/i.test(v) ? v : "";
const names = (v: unknown, field: string) =>
    rows(v)
        .map((r) => text(r[field]))
        .filter(Boolean);
function mediaImage(value: unknown): string | undefined {
    if (
        typeof value !== "string" ||
        !/^\/uploads\/[a-zA-Z0-9_ /().,&%+-]+$/.test(value) ||
        !process.env.NEXT_PUBLIC_MEDIA_URL
    )
        return;
    try {
        const url = new URL(value, process.env.NEXT_PUBLIC_MEDIA_URL);
        if (url.protocol === "https:") return url.href;
    } catch {
        /* Invalid media configuration must not break browsing. */
    }
}
export function project(v: unknown, category = ""): Project | null {
    const p = row(v);
    const id = slug(p.proj_slug);
    if (!id || !text(p.proj_name)) return null;
    const image = mediaImage(p.proj_feature_image_path);
    return {
        id,
        title: text(p.proj_name),
        category,
        description: text(p.proj_short_desc).slice(0, 500),
        url: `/casestudies/${id}`,
        image,
        technologies: names(p.technologies, "technology_title"),
    };
}
export async function getCatalogue(): Promise<Catalogue> {
    const [raw, groups, industry, about, settings, locations, privacy] =
        await Promise.all([
            cms("category/with-service"),
            cms("group"),
            cms("industry"),
            cms("page/about-us"),
            cms("site-setting"),
            cms("location"),
            cms("page/privacy-policy"),
        ]);
    const site = row(row(settings).filteredSettings);
    const company = row(about);
    let mission = "";
    try {
        const custom = row(JSON.parse(String(company.pages_custom_field)));
        mission = Object.entries(row(row(custom.group_name)["vision-mission"]))
            .filter(([key]) => /_(title|heading|description)$/.test(key))
            .map(([, value]) => text(value))
            .filter(Boolean)
            .join("\n\n")
            .slice(0, 1800);
    } catch {
        /* unpublished */
    }
    return {
        categories: rows(raw)
            .filter((c) => slug(c.service_category_slug))
            .map((c) => {
                const id = slug(c.service_category_slug);
                const title = text(c.service_category_title);
                return {
                    id,
                    title,
                    services: rows(c.services)
                        .filter((s) => slug(s.service_slug))
                        .map((s) => ({
                            id: slug(s.service_slug),
                            title: text(s.service_title),
                            category: id,
                            url: `/solutions/${id}/${slug(s.service_slug)}`,
                        })),
                };
            }),
        portfolio: rows(groups)
            .filter((g) => slug(g.portfolio_group_slug))
            .map((g) => ({
                id: slug(g.portfolio_group_slug),
                title: text(g.portfolio_group_title),
            })),
        industries: names(industry, "industry_title"),
        about: text(company.description),
        mission,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(site.site_footer_email))
            ? text(site.site_footer_email)
            : "",
        phone: /^\+?[\d ()-]{7,30}$/.test(text(site.site_footer_phone))
            ? text(site.site_footer_phone)
            : "",
        locations: rows(locations).map((l) =>
            [text(l.location_title), text(l.location_address)]
                .filter(Boolean)
                .join(": "),
        ),
        privacyUrl: privacy ? "/privacy-policy" : undefined,
        updatedAt: new Date().toISOString(),
        welcomeDelay: Math.max(
            0,
            Math.min(60000, Number(process.env.CHATBOT_WELCOME_DELAY) || 5000),
        ),
        budgets: (
            process.env.CHATBOT_BUDGET_RANGES ||
            "Under $500|$500–$1,000|$1,000–$3,000|$3,000–$5,000|$5,000–$10,000|Above $10,000|Not Decided Yet"
        )
            .split("|")
            .slice(0, 12),
        enquiryEnabled: Boolean(
            (process.env.CHATBOT_ENQUIRY_API_URL &&
                process.env.CHATBOT_BACKEND_TOKEN) ||
            process.env.NEXT_PUBLIC_API_URL,
        ),
        enquiryMode:
            process.env.CHATBOT_ENQUIRY_API_URL &&
            process.env.CHATBOT_BACKEND_TOKEN
                ? "dedicated"
                : "website",
    };
}
export async function getService(id: string): Promise<Service | null> {
    if (!slug(id)) return null;
    const data = await cms(`services/${id}`);
    if (!data) {
        // Some published menu entries have no detail record. Preserve the verified
        // offering, explain the gap and link to the working catalogue page.
        const categories = rows(await cms("category/with-service"));
        for (const category of categories) {
            const listed = rows(category.services).find(
                (s) => s.service_slug === id,
            );
            if (listed)
                return {
                    id,
                    title: text(listed.service_title),
                    category: slug(category.service_category_slug),
                    url: "/solutions",
                    detailAvailable: false,
                    description:
                        "The detailed information for this listed service is currently unavailable. Our team can provide the latest details.",
                    features: [],
                    benefits: [],
                    technologies: [],
                    projects: [],
                };
        }
        return null;
    }
    const s = row(data);
    const category = slug(row(s.Category).service_category_slug);
    if (!category || !text(s.service_title)) return null;
    return {
        id,
        title: text(s.service_title),
        category,
        url: `/solutions/${category}/${id}`,
        description: text(s.service_description || s.service_short_description),
        features: rows(s.wcp).map((f) =>
            [text(f.wcp_title), text(f.wcp_short_description)]
                .filter(Boolean)
                .join(": "),
        ),
        benefits: rows(s.value_points)
            .map((f) => text(f.description || f.title))
            .filter(Boolean),
        technologies: names(s.technologies, "technology_title"),
        projects: rows(s.projects)
            .map((p) => project(p, text(s.service_title)))
            .filter((p): p is Project => Boolean(p)),
    };
}
export async function getProjects(group: string): Promise<Project[]> {
    if (!slug(group)) return [];
    const [projectData, portfolioData] = await Promise.all([
        cms(`projects/group/${group}`),
        cms(`group/${group}`),
    ]);
    const d = row(projectData);
    const g = row(d.projectGroup);
    const projects = rows(g.Projects)
        .map((p) => project(p, text(g.project_group_title)))
        .filter((p): p is Project => Boolean(p));
    const portfolio = row(portfolioData);
    const seen = new Set(projects.map((p) => p.id));
    for (const [index, item] of rows(portfolio.Portfolios).entries()) {
        if (
            item.portfolio_status !== undefined &&
            String(item.portfolio_status) !== "1"
        )
            continue;
        const linked = project(
            item.Project,
            text(portfolio.portfolio_group_title),
        );
        if (linked) {
            if (!seen.has(linked.id)) {
                projects.push(linked);
                seen.add(linked.id);
            }
            continue;
        }
        const title = text(item.portfolio_title);
        if (!title) continue;
        projects.push({
            id: `${group}-${index}`,
            title,
            category: text(portfolio.portfolio_group_title),
            description: text(item.portfolio_description),
            image: mediaImage(item.portfolio_feature_image_path),
            url: `/portfolio/${group}`,
            technologies: [],
        });
    }
    return projects;
}

export async function getCaseStudies(): Promise<Project[] | null> {
    const projects: Project[] = [];
    const seen = new Set<string>();
    for (let page = 1; page <= 20; page++) {
        const data = await cms(`project?limit=100&page=${page}`);
        if (!data) return page === 1 ? null : projects;
        const result = row(data);
        let added = 0;
        for (const item of rows(result.data)) {
            const card = project(item, "Case Study");
            if (!card || seen.has(card.id)) continue;
            seen.add(card.id);
            projects.push({ ...card, kind: "case-study" });
            added++;
        }
        if (!added || row(result.pagination).has_next !== true) break;
    }
    return projects;
}

function detailText(value: unknown): string {
    if (typeof value !== "string") return "";
    return value
        .replace(/<\/t[dh]>/gi, " | ")
        .replace(/<br\s*\/?\s*>|<\/(?:p|li|tr|h[1-6])>/gi, "\n")
        .split(/\n+/)
        .map((line) => publicText(line).replace(/\s*\|\s*$/, ""))
        .filter(Boolean)
        .join("\n");
}

export async function getCaseStudy(id: string): Promise<Project | null> {
    if (!slug(id)) return null;
    const data = await cms(`project/${id}`);
    if (!data) return null;
    const item = row(data);
    if (
        (item.proj_status !== undefined && String(item.proj_status) !== "1") ||
        item.proj_deleted_at
    )
        return null;
    const card = project(
        item,
        text(row(item.Group).project_group_title) || "Case Study",
    );
    if (!card) return null;
    const sections: { title: string; content: string }[] = [];
    const fields: [string, string][] = [
        ["proj_timeline", "Project timeline"],
        ["proj_business_objectives", "Business objectives"],
        ["proj_goals", "Project goals"],
        ["proj_scope", "Project scope"],
        ["proj_initial_challenges", "Initial challenges"],
        ["proj_implementation_phases", "Implementation"],
        ["proj_key_milestones", "Key milestones"],
        ["proj_challenges_faced", "Challenges faced"],
        ["proj_our_achievements", "Results & achievements"],
    ];
    for (const [key, title] of fields) {
        const content = detailText(item[key]);
        if (content) sections.push({ title, content });
    }
    for (const study of rows(item.case_study)) {
        const title = text(study.ca_std_name);
        for (const [key, label] of [
            ["ca_std_problem_statement", "Challenge"],
            ["ca_std_approach", "Approach"],
            ["ca_std_technical_barriers", "Technical barriers"],
            ["ca_std_custom_solution", "Solution"],
            ["ca_std_results", "Results"],
            ["ca_std_metrics", "Metrics"],
            ["ca_std_lessons_learned", "Lessons learned"],
            ["ca_std_conclusion", "Conclusion"],
        ]) {
            const content = detailText(study[key]);
            if (content)
                sections.push({
                    title: [title, label].filter(Boolean).join(" · "),
                    content,
                });
        }
    }
    const services = names(item.services, "service_title");
    if (services.length)
        sections.unshift({
            title: "Services delivered",
            content: services.join(", "),
        });
    return {
        ...card,
        kind: "case-study",
        description: text(item.proj_short_desc),
        sections,
    };
}
