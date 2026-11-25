import { stepById } from "@/data/chatbotFlow";
import type { Catalogue, Draft, Option } from "./types";
export type FlowState = {
    step: string;
    draft: Draft;
    context: { category?: string; group?: string; followup?: string };
    history: { step: string; draft: Draft; context: FlowState["context"] }[];
    editing?: boolean;
    selectingService?: boolean;
    enquiry: boolean;
    suspended: boolean;
    requestId: string;
};
export function initialState(): FlowState {
    return {
        step: "MAIN_MENU",
        draft: {},
        context: {},
        history: [],
        enquiry: false,
        suspended: false,
        requestId: crypto.randomUUID(),
    };
}
export function go(
    state: FlowState,
    step: string,
    draft = state.draft,
): FlowState {
    return {
        ...state,
        step,
        draft,
        history: [
            ...state.history.slice(-39),
            {
                step: state.step,
                draft: { ...state.draft },
                context: { ...state.context },
            },
        ],
        suspended: false,
    };
}
export function back(state: FlowState): FlowState {
    const previous = state.history.at(-1);
    return previous
        ? {
              ...state,
              ...previous,
              history: state.history.slice(0, -1),
              suspended: false,
              editing: false,
          }
        : state;
}
export function validate(
    field: keyof Draft,
    value: string,
    draft: Draft = {},
): string {
    if (value.length > (field === "requirements" ? 4000 : 200))
        return "Please shorten your answer.";
    if (!value.trim())
        return "Please enter an answer or use Skip where available.";
    if (field === "name" && value.trim().length < 2)
        return "Please enter your name.";
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
        return "Please enter a valid email address.";
    if (
        field === "phone" &&
        !/^\+[1-9]\d{6,14}$/.test(value.replace(/[\s()-]/g, ""))
    )
        return "Use an international number, such as + followed by country code and number (7–15 digits).";
    if (field === "website") {
        try {
            const u = new URL(value);
            if (
                !["http:", "https:"].includes(u.protocol) ||
                !u.hostname.includes(".") ||
                u.username ||
                u.password
            )
                return "Please enter a complete http:// or https:// website URL.";
        } catch {
            return "Please enter a complete http:// or https:// website URL.";
        }
    }
    if (field === "preference" && value === "Phone Call" && !draft.phone)
        return "Please add a phone number first, or choose Email.";
    return "";
}
export function answer(
    state: FlowState,
    value: string,
    skip = false,
): { state: FlowState; error?: string } {
    const step = stepById[state.step];
    if (!step) return { state, error: "Please select an option." };
    if (skip && !step.optional)
        return { state, error: "This answer is required." };
    const error = skip ? "" : validate(step.field, value, state.draft);
    if (error) return { state, error };
    const draft = { ...state.draft, [step.field]: skip ? "" : value.trim() };
    if (state.step === "PROJECT_FOLLOWUP")
        draft.requirements = skip
            ? state.draft.requirements
            : `${state.draft.requirements || ""}\nAdditional detail: ${value.trim()}`.slice(
                  0,
                  4000,
              );
    if (step.field === "existingWebsite" && value === "No") draft.website = "";
    if (step.field === "phone" && skip) draft.preference = "Email";
    if (step.field === "consent" && value !== "I agree")
        return {
            state: {
                ...go(state, "MAIN_MENU", {}),
                enquiry: false,
                editing: false,
            },
        };
    let next = state.editing ? "REVIEW_ENQUIRY" : step.next;
    while (stepById[next]?.when && !stepById[next].when!(draft))
        next = stepById[next].next;
    if (
        state.editing &&
        step.field === "existingWebsite" &&
        value === "Yes" &&
        !draft.website
    )
        next = "WEBSITE_URL";
    return {
        state: {
            ...go(state, next, draft),
            editing: state.editing && next !== "REVIEW_ENQUIRY",
        },
    };
}
export function prompt(state: FlowState): string {
    return (
        state.step === "PROJECT_FOLLOWUP" && state.context.followup
            ? state.context.followup
            : stepById[state.step]?.message || ""
    ).replace("{name}", state.draft.name || "there");
}
export function options(state: FlowState, catalogue: Catalogue): Option[] {
    const step = stepById[state.step];
    if (!step) return [];
    let values = step.options || [];
    if (state.step === "BUSINESS_INDUSTRY")
        values = [...catalogue.industries, "Other"];
    if (state.step === "PROJECT_BUDGET") values = catalogue.budgets;
    if (state.step === "CONTACT_PREFERENCE" && !state.draft.phone)
        values = ["Email"];
    if (state.step === "PROJECT_TYPE") {
        const category = catalogue.categories.find((c) =>
            c.services.some((s) => s.id === state.draft.service),
        )?.id;
        if (category && !/web|mobile/.test(category))
            values = [
                "New Project",
                "Maintenance & Support",
                "Custom Development",
                "Not Sure Yet",
            ];
    }
    return [
        ...values.map((label) => ({ label, action: "ANSWER", value: label })),
        ...(state.step === "PROJECT_BUDGET" && !state.context.followup
            ? [
                  {
                      label: "Refine Requirements with AI",
                      action: "REFINE_REQUIREMENTS",
                  },
              ]
            : []),
        ...(step.optional &&
        !(
            catalogue.enquiryMode === "website" &&
            ["CONTACT_PHONE", "CONTACT_COMPANY"].includes(state.step)
        )
            ? [{ label: "Skip", action: "SKIP" }]
            : []),
    ];
}
