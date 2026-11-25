import type { Draft } from "@/utils/chatbot/types";
export type StepDefinition = {
    id: string;
    field: keyof Draft;
    message: string;
    options?: string[];
    optional?: boolean;
    input?: "email" | "tel" | "url" | "text";
    next: string;
    when?: (draft: Draft) => boolean;
};
export const steps: StepDefinition[] = [
    {
        id: "PROJECT_TYPE",
        field: "projectType",
        message: "Could you tell me a little more about your project?",
        options: [
            "New Project",
            "Redesign Existing Website",
            "Upgrade Existing Application",
            "Maintenance & Support",
            "Custom Development",
            "Not Sure Yet",
        ],
        next: "BUSINESS_INDUSTRY",
    },
    {
        id: "BUSINESS_INDUSTRY",
        field: "industry",
        message: "What type of business or industry do you operate in?",
        optional: true,
        next: "EXISTING_WEBSITE",
    },
    {
        id: "EXISTING_WEBSITE",
        field: "existingWebsite",
        message: "Do you have an existing website?",
        options: ["Yes", "No"],
        next: "WEBSITE_URL",
    },
    {
        id: "WEBSITE_URL",
        field: "website",
        message: "What is your existing website URL?",
        input: "url",
        when: (d) => d.existingWebsite === "Yes",
        next: "PROJECT_REQUIREMENTS",
    },
    {
        id: "PROJECT_REQUIREMENTS",
        field: "requirements",
        message:
            "Please briefly describe your project requirements. Please leave contact details out of this description.",
        next: "PROJECT_BUDGET",
    },
    {
        id: "PROJECT_FOLLOWUP",
        field: "requirements",
        message: "Could you share one more detail about your project?",
        optional: true,
        next: "PROJECT_BUDGET",
    },
    {
        id: "PROJECT_BUDGET",
        field: "budget",
        message:
            "What is your estimated budget? These are your planning ranges, not Eclick service prices.",
        next: "PROJECT_TIMELINE",
    },
    {
        id: "PROJECT_TIMELINE",
        field: "timeline",
        message: "When would you like to start your project?",
        options: [
            "Immediately",
            "Within 2 Weeks",
            "Within 1 Month",
            "Within 3 Months",
            "Flexible",
        ],
        next: "CONTACT_NAME",
    },
    {
        id: "CONTACT_NAME",
        field: "name",
        message: "Great! May I know your name?",
        next: "CONTACT_EMAIL",
    },
    {
        id: "CONTACT_EMAIL",
        field: "email",
        message: "Thank you, {name}. What is your email address?",
        input: "email",
        next: "CONTACT_PHONE",
    },
    {
        id: "CONTACT_PHONE",
        field: "phone",
        message:
            "Could you provide a contact number, including your country code?",
        input: "tel",
        optional: true,
        next: "CONTACT_COMPANY",
    },
    {
        id: "CONTACT_COMPANY",
        field: "company",
        message: "What is the name of your company or business?",
        optional: true,
        next: "CONTACT_PREFERENCE",
    },
    {
        id: "CONTACT_PREFERENCE",
        field: "preference",
        message: "How would you prefer our team to contact you?",
        options: ["Email", "Phone Call"],
        next: "PRIVACY_CONSENT",
    },
    {
        id: "PRIVACY_CONSENT",
        field: "consent",
        message:
            "May we store your enquiry and contact you about this project? Review our privacy policy before agreeing.",
        options: ["I agree", "Cancel"],
        next: "REVIEW_ENQUIRY",
    },
];
export const stepById = Object.fromEntries(
    steps.map((step) => [step.id, step]),
);
export const mainMenu = [
    { label: "Explore Our Services", action: "SERVICES" },
    { label: "Get a Free Quote", action: "START_ENQUIRY" },
    { label: "Open Enquiry Form", action: "WEBSITE_FORM" },
    { label: "View Our Portfolio", action: "PORTFOLIO" },
    { label: "View Case Studies", action: "CASE_STUDIES" },
    { label: "About Eclick Softwares", action: "ABOUT" },
    { label: "Technologies We Use", action: "TECHNOLOGIES" },
    { label: "Ask a Question", action: "ASK" },
    { label: "Contact Our Team", action: "CONTACT" },
];
