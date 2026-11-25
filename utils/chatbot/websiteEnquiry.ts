import type { Draft } from "./types";

export type WebsiteEnquiryPrefill = {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    service: string;
    requirement: string;
};

export function websiteEnquiryPrefill(
    draft: Draft,
    serviceTitle = "",
    sourcePage = "/",
    utm: Record<string, string> = {},
): WebsiteEnquiryPrefill {
    const details = [
        ["Service", serviceTitle || draft.service],
        ["Company", draft.company],
        ["Project type", draft.projectType],
        ["Industry", draft.industry],
        ["Existing website", draft.website || draft.existingWebsite],
        ["Budget", draft.budget],
        ["Timeline", draft.timeline],
        ["Preferred contact", draft.preference],
        ["Project inspiration", draft.project],
        ["Source page", sourcePage],
        ...Object.entries(utm),
    ]
        .filter(([, value]) => Boolean(value))
        .map(([label, value]) => `${label}: ${value}`);
    return {
        fullName: draft.name || "",
        email: draft.email || "",
        phone: draft.phone || "",
        company: draft.company || "",
        service: draft.service || "",
        requirement: [
            draft.requirements,
            Object.values(draft).some(Boolean) ? details.join("\n") : "",
        ]
            .filter(Boolean)
            .join("\n\n"),
    };
}

// Same field names and endpoint contract used by the website's Let's Connect form.
export function websiteEnquiryPayload(
    form: WebsiteEnquiryPrefill,
    action: string | null | undefined,
) {
    return {
        service: form.service,
        sc_full_name: form.fullName,
        sc_business_email: form.email,
        sc_phone_number: form.phone,
        sc_message:
            form.company &&
            !form.requirement.includes(`Company: ${form.company}`)
                ? `${form.requirement}\n\nCompany: ${form.company}`
                : form.requirement,
        sc_flag: action || "Chatbot enquiry",
    };
}
