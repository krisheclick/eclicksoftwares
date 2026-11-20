// Server-only retrieval from the public CMS used by the website.
type Document = { title: string; url: string; text: string };
type Data = Record<string, unknown>;
const pages = ["home", "about-us", "contact-us", "solutions", "service-details", "hire-developers", "our-journey", "our-clients", "our-partners", "our-testimonials", "portfolio", "case-studies", "blog", "career", "privacy-policy", "terms-and-conditions", "refund-policy", "cookie-policy", "disclaimer"];
let snapshot: { base: string; expires: number; documents: Document[] } | undefined;
let loading: { base: string; promise: Promise<Document[]> } | undefined;
function record(value: unknown): Data {
    return value && typeof value === "object" && !Array.isArray(value) ? value as Data : {};
}
export function publicText(value: unknown, depth = 0): string {
    if (depth > 12 || value == null) return "";
    if (typeof value === "string") {
        if (/^\s*[\[{]/.test(value)) {
            try { return publicText(JSON.parse(value), depth + 1); } catch { /* ordinary text */ }
        }
        return value.replace(/<(script|style|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
            .replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/\s+/g, " ").trim();
    }
    if (typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.map(item => publicText(item, depth + 1)).filter(Boolean).join("\n");
    return Object.entries(record(value))
        .filter(([key]) => !/(password|secret|token|api.?key|image|filename|icon|iframe|created|updated|deleted|(^|_)id$|^is_|status|seo|meta_|color)/i.test(key))
        .map(([key, item]) => {
            const text = publicText(item, depth + 1);
            return text ? `${key.replace(/_/g, " ")}: ${text}` : "";
        }).filter(Boolean).join("\n");
}
async function cms(base: string, path: string): Promise<unknown> {
    try {
        const response = await fetch(new URL(path, base), { next: { revalidate: 600 }, signal: AbortSignal.timeout(6000) });
        if (!response.ok) return null;
        const data = await response.json();
        return data.response_code === false ? null : data.response_data ?? null;
    } catch { return null; }
}
async function collection(base: string, endpoint: string, field: string): Promise<Data[]> {
    const items: Data[] = [];
    const seen = new Set<string>();
    // Follow pagination rather than silently stopping at the first 100 records.
    for (let page = 1; page <= 100; page++) {
        const value = await cms(base, `${endpoint}?limit=100&page=${page}`);
        if (!value) break;
        const data = record(value);
        const rows = Array.isArray(value) ? value : data[field];
        if (!Array.isArray(rows) || !rows.length) break;
        let added = 0;
        for (const row of rows) {
            const item = record(row);
            const signature = JSON.stringify(item);
            if (seen.has(signature)) continue;
            seen.add(signature); items.push(item); added++;
        }
        const pagination = record(data.pagination);
        const total = Number(pagination.total_pages ?? pagination.totalPages);
        if (!added || Array.isArray(value) || pagination.has_next === false || (total > 0 && page >= total)) break;
        if (!pagination.has_next && !total && rows.length < 100) break;
    }
    return items;
}
async function build(base: string): Promise<Document[]> {
    const result: Document[] = [];
    function add(title: string, url: string, data: unknown) {
        const text = publicText(data);
        if (text) result.push({ title, url, text });
    }
    // Fixed public read endpoints only; never fetch visitor-supplied URLs.
    const sources = [
        ...pages.map(page => ({ path: `page/${page}`, title: page, url: page === "home" ? "/" : `/${page === "case-studies" ? "casestudies" : page}` })),
        { path: "location", title: "Office addresses, phone numbers and emails", url: "/contact-us" },
        { path: "category/with-projects", title: "Portfolio and case studies", url: "/casestudies" },
        { path: "testimonial", title: "Client testimonials", url: "/our-testimonials" },
        { path: "industry", title: "Industries served", url: "/" },
    ];
    const [settings, categories, blogs, projects, products, careers, groups] = await Promise.all([
        cms(base, "site-setting"), cms(base, "category/with-service"),
        collection(base, "blogs", "blogData"), collection(base, "project", "data"),
        collection(base, "products", "data"), collection(base, "careers", "careers"), cms(base, "group"),
    ]);
    const site = record(record(settings).filteredSettings);
    add("Official contact details", "/contact-us", { title: site.site_title, description: site.site_description, email: site.site_footer_email, phone: site.site_footer_phone });
    if (Array.isArray(categories)) {
        const catalogue: string[] = [];
        for (const raw of categories) {
            const category = record(raw);
            if (!Array.isArray(category.services)) continue;
            for (const rawService of category.services) {
                const service = record(rawService);
                if (typeof service.service_slug !== "string" || typeof category.service_category_slug !== "string") continue;
                const slug = encodeURIComponent(service.service_slug);
                const url = `/solutions/${encodeURIComponent(category.service_category_slug)}/${slug}`;
                catalogue.push(`${service.service_title}: ${url}`);
                sources.push({ path: `services/${slug}`, title: String(service.service_title), url });
            }
        }
        add("All available services and official links", "/solutions", catalogue);
    }
    // Each article/project gets its own document, preserving full body content.
    // The descriptors come from our CMS, never directly from user input.
    for (const blog of blogs) {
        if (typeof blog.blog_slug !== "string") continue;
        const slug = encodeURIComponent(blog.blog_slug);
        const url = `/blog/${slug}`;
        add(String(blog.blog_title), url, blog);
        sources.push({ path: `blogs/${slug}`, title: String(blog.blog_title), url });
    }
    const projectSlugs = new Set<string>();
    for (const project of [...projects, ...products]) {
        if (typeof project.proj_slug !== "string" || projectSlugs.has(project.proj_slug)) continue;
        projectSlugs.add(project.proj_slug);
        const slug = encodeURIComponent(project.proj_slug);
        const url = `/casestudies/${slug}`;
        add(String(project.proj_name), url, project);
        sources.push({ path: `project/${slug}`, title: String(project.proj_name), url });
    }
    for (const career of careers) {
        if (typeof career.career_slug !== "string") continue;
        const slug = encodeURIComponent(career.career_slug);
        const url = `/career/apply-job/${slug}`;
        add(String(career.career_name), url, career);
        sources.push({ path: `careers/${slug}`, title: String(career.career_name), url });
    }
    if (Array.isArray(groups)) {
        for (const raw of groups) {
            const group = record(raw);
            if (typeof group.portfolio_group_slug !== "string") continue;
            const slug = encodeURIComponent(group.portfolio_group_slug);
            const url = `/portfolio/${slug}`;
            sources.push({ path: `group/${slug}`, title: String(group.portfolio_group_title), url });
            sources.push({ path: `projects/group/${slug}`, title: `${group.portfolio_group_title} portfolio entries`, url });
        }
    }
    for (let index = 0; index < sources.length; index += 8) {
        await Promise.all(sources.slice(index, index + 8).map(async source => add(source.title, source.url, await cms(base, source.path))));
    }
    return result;
}
async function documents(): Promise<Document[]> {
    const configured = process.env.NEXT_PUBLIC_API_URL;
    if (!configured) return [];
    const base = configured.replace(/\/+$/, "") + "/";
    if (snapshot?.base === base && snapshot.expires > Date.now()) return snapshot.documents;
    if (loading?.base === base) return loading.promise;
    const promise = build(base).then(result => {
        snapshot = { base, documents: result, expires: Date.now() + (result.length ? 600000 : 30000) };
        return result;
    }).finally(() => { if (loading?.promise === promise) loading = undefined; });
    loading = { base, promise };
    return promise;
}
export async function getWebsiteKnowledge(question: string, currentPage = ""): Promise<string> {
    const all = await documents();
    if (!all.length) return "Website CMS information is currently unavailable. Do not guess company facts; offer the contact form.";
    const aliases: [RegExp, string][] = [
        [/ঠিকানা|অফিস|যোগাযোগ|ফোন|ইমেইল|contact|address|phone|email/i, "contact office location email phone"],
        [/কোম্পানি|প্রতিষ্ঠা|সম্পর্কে|company|about|founded/i, "about established company journey"],
        [/ওয়েব|ওয়েব|ওয়েবসাইট|website/i, "web website development design"],
        [/দাম|খরচ|মূল্য|price|cost/i, "pricing cost quote"],
        [/চাকরি|নিয়োগ|নিয়োগ|job|career/i, "career jobs hiring"],
        [/সার্ভিস|সেবা|service/i, "services solutions"],
        [/ব্লগ|blog/i, "blog articles"],
        [/পোর্টফোলিও|কাজ|portfolio|project/i, "portfolio projects case studies"],
    ];
    const expanded = question + " " + aliases.filter(([pattern]) => pattern.test(question)).map(([, words]) => words).join(" ");
    const terms = [...new Set(expanded.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [])].filter(term => !["the", "and", "for", "you", "your", "what", "can", "are", "have", "this", "that", "with"].includes(term));
    const chunks = all.flatMap(doc => {
        const result = [];
        for (let offset = 0; offset < doc.text.length; offset += 1400) {
            const text = doc.text.slice(offset, offset + 1800);
            const lower = text.toLowerCase();
            const title = doc.title.toLowerCase();
            const score = terms.reduce((total, term) => total + (title.includes(term) ? 8 : 0) + (lower.includes(term) ? 2 : 0), 0)
                + (currentPage && doc.url === currentPage ? 12 : 0);
            result.push({ ...doc, text, score });
        }
        return result;
    }).sort((a, b) => b.score - a.score);
    const core = all.filter(doc => ["Official contact details", "All available services and official links", "about-us"].includes(doc.title))
        .map(doc => `[${doc.title}] ${doc.url}\n${doc.text.slice(0, doc.title === "about-us" ? 3500 : 7000)}`);
    const relevant = chunks.slice(0, 10).map(doc => `[${doc.title}] ${doc.url}\n${doc.text}`);
    return [...core, ...relevant].join("\n\n").slice(0, 30000);
}
