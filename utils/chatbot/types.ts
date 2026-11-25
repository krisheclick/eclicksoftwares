export type Service = {
    detailAvailable?: boolean;
    id: string;
    title: string;
    category: string;
    url: string;
    description?: string;
    features?: string[];
    benefits?: string[];
    technologies?: string[];
    projects?: Project[];
};
export type Project = {
    kind?: "case-study";
    sections?: { title: string; content: string }[];
    id: string;
    title: string;
    category: string;
    description: string;
    url: string;
    image?: string;
    technologies: string[];
};
export type Category = { id: string; title: string; services: Service[] };
export type Catalogue = {
    categories: Category[];
    portfolio: { id: string; title: string }[];
    industries: string[];
    about: string;
    mission: string;
    email: string;
    phone: string;
    locations: string[];
    offices?: {
        title: string;
        address: string;
        phone: string;
        email: string;
    }[];
    journey?: string;
    privacyUrl?: string;
    updatedAt: string;
    welcomeDelay: number;
    budgets: string[];
    enquiryEnabled: boolean;
    enquiryMode?: "website" | "dedicated";
};
export type Draft = Partial<
    Record<
        | "service"
        | "project"
        | "projectType"
        | "industry"
        | "existingWebsite"
        | "website"
        | "requirements"
        | "budget"
        | "timeline"
        | "name"
        | "email"
        | "phone"
        | "company"
        | "preference"
        | "consent",
        string
    >
>;
export type Option = { label: string; action: string; value?: string };
export type Message = {
    id: string;
    role: "assistant" | "user";
    text: string;
    time: number;
    links?: { title: string; url: string }[];
    projects?: Project[];
};
