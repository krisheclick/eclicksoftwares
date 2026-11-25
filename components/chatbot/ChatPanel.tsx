"use client";
import {
    CSSProperties,
    FormEvent,
    KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { mainMenu, stepById, steps } from "@/data/chatbotFlow";
import {
    answer,
    back,
    go,
    initialState,
    options,
    prompt,
    type FlowState,
} from "@/utils/chatbot/flow";
import type {
    Catalogue,
    Draft,
    Message,
    Option,
    Project,
    Service,
} from "@/utils/chatbot/types";
import styles from "./Chatbot.module.css";
import { useScheduleCall, useLetsConnect } from "@/utils/useLetsConnect";
import { websiteEnquiryPrefill } from "@/utils/chatbot/websiteEnquiry";
import AnimatedReply from "./AnimatedReply";
import ContactGate, { type ContactDetails } from "./ContactGate";
import ProjectCarousel from "./ProjectCarousel";
import { useThemeContext } from "@/context/ThemeContext";

const labels: Record<string, string> = {
    service: "Service",
    project: "Project inspiration",
    projectType: "Project type",
    industry: "Industry",
    existingWebsite: "Existing website?",
    website: "Website URL",
    requirements: "Project requirements",
    budget: "Visitor budget",
    timeline: "Timeline",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    preference: "Contact preference",
    consent: "Privacy consent",
};
const actionLabels: Record<string, string> = {
    START_ENQUIRY: "Get a Free Quote",
    SERVICES: "Explore Our Services",
    PORTFOLIO: "View Our Portfolio",
    CASE_STUDIES: "View Case Studies",
    CONTACT: "Contact Our Team",
    RESUME: "Continue My Enquiry",
    MAIN_MENU: "Back to Main Menu",
};
const serviceActions: Option[] = [
    { label: "View Related Projects", action: "RELATED_PROJECTS" },
    { label: "Discuss My Project", action: "START_ENQUIRY" },
    { label: "Get a Free Quote", action: "START_ENQUIRY" },
    { label: "Ask a Question", action: "ASK" },
    { label: "Explore Other Services", action: "SERVICES" },
];
function msg(
    role: Message["role"],
    text: string,
    extra: Partial<Message> = {},
): Message {
    return { id: crypto.randomUUID(), role, text, time: Date.now(), ...extra };
}
async function getData<T>(query = ""): Promise<T> {
    const r = await fetch(`/api/chatbot/catalogue${query}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
    });
    if (!r.ok)
        throw new Error(
            "We could not load this information. Please try again or visit our contact page.",
        );
    return r.json();
}

export default function ChatPanel({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const { openScheduleModal } = useScheduleCall();
    const { openLetsConnectModal } = useLetsConnect();
    const { chatEnquirySubmitted } = useThemeContext();
    const seenWebsiteSubmission = useRef(chatEnquirySubmitted);
    const pathname = usePathname();
    const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
    const catalogueReady = catalogue !== null;
    const [state, setState] = useState<FlowState>(initialState);
    const stateRef = useRef(state);
    const [messages, setMessages] = useState<Message[]>([]);
    const [completedReplies, setCompletedReplies] = useState<Set<string>>(
        () => new Set(),
    );
    const activeReplyIndex = messages.findIndex(
        (message) =>
            message.role === "assistant" && !completedReplies.has(message.id),
    );
    const activeReplyId =
        activeReplyIndex < 0 ? null : messages[activeReplyIndex].id;
    const visibleMessages =
        activeReplyIndex < 0
            ? messages
            : messages.slice(0, activeReplyIndex + 1);
    const [choices, setChoices] = useState<Option[]>([]);
    const [input, setInput] = useState("");
    const contactSaved = useRef(false);
    const [contactIntent, setContactIntent] = useState<Option | null>(null);
    const [savingContact, setSavingContact] = useState(false);
    const [busy, setBusy] = useState(true);
    const responding = busy || activeReplyId !== null;
    const [error, setError] = useState("");
    const [questionMode, setQuestionMode] = useState(false);
    const [currentService, setCurrentService] = useState<Service | null>(null);
    const [viewport, setViewport] = useState<{
        height: number;
        top: number;
    } | null>(null);
    const [projectList, setProjectList] = useState<Project[]>([]);
    const [projectOffset, setProjectOffset] = useState(0);
    const [restartCheck, setRestartCheck] = useState(false);
    const [lastQuestion, setLastQuestion] = useState("");
    const restartPopup = useRef<HTMLDivElement>(null);
    const restartTrigger = useRef<HTMLButtonElement>(null);
    const field = useRef<HTMLTextAreaElement>(null);
    const panel = useRef<HTMLElement>(null);
    const log = useRef<HTMLDivElement>(null);
    const pending = useRef(false);
    const generation = useRef(0);
    const aiHistory = useRef<{ role: "assistant" | "user"; text: string }[]>(
        [],
    );
    const serviceCache = useRef(new Map<string, Service>());
    const projectCache = useRef(new Map<string, Project[]>());
    const resumeStep = useRef<string>("PROJECT_TYPE");
    const sourcePage = useRef(pathname);
    const utm = useRef<Record<string, string>>({});
    const introStarted = useRef(false);
    function update(next: FlowState) {
        stateRef.current = next;
        setState(next);
        if (
            next.enquiry &&
            (stepById[next.step] ||
                next.step === "REVIEW_ENQUIRY" ||
                (next.selectingService &&
                    ["SERVICE_CATEGORY", "SERVICE_LIST"].includes(next.step)))
        )
            resumeStep.current = next.step;
    }
    function append(text: string, extra: Partial<Message> = {}) {
        setMessages((prev) => [
            ...prev.slice(-99),
            msg("assistant", text, extra),
        ]);
    }
    useEffect(() => {
        if (chatEnquirySubmitted === seenWebsiteSubmission.current) return;
        seenWebsiteSubmission.current = chatEnquirySubmitted;
        update({ ...initialState(), step: "ENQUIRY_SUCCESS" });
        append(
            "Your enquiry has been submitted successfully through our website form. Our team will review your requirements and contact you as soon as possible.",
        );
        setChoices([
            { label: "View Our Portfolio", action: "PORTFOLIO" },
            { label: "Start New Conversation", action: "RESTART" },
        ]);
        setError("");
        setQuestionMode(false);
        // The shared form emits this event only after its API confirms success.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatEnquirySubmitted]);
    useEffect(() => {
        const p = new URLSearchParams(window.location.search);
        for (const k of [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_term",
            "utm_content",
        ]) {
            const v = p.get(k);
            if (v) utm.current[k] = v.slice(0, 200);
        }
    }, []);
    useEffect(() => {
        if (open && !responding && !restartCheck) field.current?.focus();
    }, [open, responding, restartCheck]);
    useEffect(() => {
        if (!restartCheck) return;
        restartPopup.current
            ?.querySelector<HTMLButtonElement>("[data-keep-conversation]")
            ?.focus();
        return () => {
            restartTrigger.current?.focus();
        };
    }, [restartCheck]);
    useEffect(() => {
        if (!open) return;
        const viewport = window.visualViewport;
        const resize = () =>
            setViewport({
                height: viewport?.height || window.innerHeight,
                top: viewport?.offsetTop || 0,
            });
        resize();
        viewport?.addEventListener("resize", resize);
        viewport?.addEventListener("scroll", resize);
        const background = Array.from(
            document.querySelectorAll<HTMLElement>(
                "body > header, main.mainContainer, body > footer",
            ),
        );
        const original = background.map((el) => el.inert);
        background.forEach((el) => {
            el.inert = true;
        });
        return () => {
            viewport?.removeEventListener("resize", resize);
            viewport?.removeEventListener("scroll", resize);
            background.forEach((el, i) => {
                el.inert = original[i];
            });
        };
    }, [open]);
    useEffect(() => {
        log.current?.scrollTo({
            top: log.current.scrollHeight,
            behavior: "instant",
        });
    }, [messages, choices, busy, error, open, activeReplyId]);
    useEffect(() => {
        let alive = true;
        getData<Catalogue>()
            .then(async (data) => {
                if (!alive) return;
                setCatalogue(data);
                if (introStarted.current) return;
                introStarted.current = true;
                for (const text of [
                    "Hi there! \u{1F44B} Welcome to Eclick Softwares!",
                    "I'm your AI assistant. How can I help you today?",
                ]) {
                    await new Promise((r) =>
                        setTimeout(
                            r,
                            window.matchMedia(
                                "(prefers-reduced-motion: reduce)",
                            ).matches
                                ? 0
                                : 550,
                        ),
                    );
                    if (!alive) return;
                    append(text);
                }
                if (pathname.startsWith("/solutions/"))
                    append(
                        "Interested in this service? I can help you understand how it works.",
                    );
                else if (
                    pathname.startsWith("/portfolio/") ||
                    pathname.startsWith("/casestudies/")
                )
                    append(
                        "Would you like us to develop something similar for your business?",
                    );
                else if (pathname === "/contact-us")
                    append("Need help connecting with our team?");
                setChoices(mainMenu);
                setBusy(false);
            })
            .catch((e) => {
                if (alive) {
                    setError(e.message);
                    setBusy(false);
                }
            });
        return () => {
            alive = false;
        };
        // Root layout preserves this instance and draft across client navigation.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function show(next: FlowState) {
        update(next);
        setQuestionMode(false);
        setInput("");
        setError("");
        if (stepById[next.step] || next.step === "REVIEW_ENQUIRY")
            resumeStep.current = next.step;
        if (stepById[next.step]) {
            append(
                prompt(next),
                next.step === "PRIVACY_CONSENT" && catalogue?.privacyUrl
                    ? {
                          links: [
                              {
                                  title: "Privacy Policy",
                                  url: catalogue.privacyUrl,
                              },
                          ],
                      }
                    : {},
            );
            setChoices(catalogue ? options(next, catalogue) : []);
        } else if (next.step === "REVIEW_ENQUIRY") {
            append(
                "Please review your enquiry. Nothing has been submitted yet.",
            );
            setChoices([
                { label: "Confirm & Submit", action: "SUBMIT" },
                { label: "Edit Details", action: "EDIT" },
                { label: "Use Website Form", action: "WEBSITE_FORM" },
                { label: "Cancel", action: "CANCEL" },
            ]);
        } else if (next.step === "MAIN_MENU") {
            append("How can we assist you today?");
            setChoices(mainMenu);
        } else if (next.step === "SERVICE_CATEGORY") {
            append(
                next.selectingService
                    ? "What type of service are you looking for?"
                    : "Absolutely! Please select the service you are interested in.",
            );
            setChoices(
                (catalogue?.categories || []).map((c) => ({
                    label: c.title,
                    action: "CATEGORY",
                    value: c.id,
                })),
            );
        } else if (next.step === "SERVICE_LIST") {
            const c = catalogue?.categories.find(
                (c) => c.id === next.context.category,
            );
            append(`Which ${c?.title || ""} service interests you?`);
            setChoices(
                c?.services.map((s) => ({
                    label: s.title,
                    action: "SERVICE",
                    value: s.id,
                })) || [],
            );
        } else if (next.step === "SERVICE_DETAIL") {
            const s = serviceCache.current.get(next.draft.service || "");
            if (s) {
                setCurrentService(s);
                append(s.description?.slice(0, 1800) || s.title, {
                    links: [{ title: "Read service details", url: s.url }],
                });
                setChoices(serviceActions);
            } else show({ ...next, step: "SERVICE_CATEGORY" });
        } else if (next.step === "PORTFOLIO_CATEGORY") {
            append("Please choose a portfolio category.");
            setChoices(
                catalogue?.portfolio.map((p) => ({
                    label: p.title,
                    action: "PROJECT_GROUP",
                    value: p.id,
                })) || [],
            );
        } else if (next.step === "PORTFOLIO_DETAIL")
            portfolioPage(
                projectCache.current.get(next.context.group || "") || [],
                0,
            );
        else {
            append("How can we help you next?");
            setChoices(mainMenu);
        }
    }
    async function ask(text: string) {
        const snapshot = stateRef.current;
        const active = snapshot.enquiry && snapshot.step !== "ENQUIRY_SUCCESS";
        update({ ...snapshot, suspended: active });
        setQuestionMode(false);
        setChoices([]);
        setLastQuestion(text);
        try {
            const r = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    requestId: crypto.randomUUID(),
                    currentPage: pathname,
                    history: aiHistory.current.slice(-6),
                    guidedStepActive: active,
                }),
                signal: AbortSignal.timeout(60000),
            });
            const data = await r.json();
            if (!r.ok)
                throw new Error(
                    data.error || "AI replies are temporarily unavailable.",
                );
            if (typeof data.answer !== "string")
                throw new Error("AI replies are temporarily unavailable.");
            append(data.answer, {
                links: Array.isArray(data.sources)
                    ? data.sources.filter(
                          (s: { url?: unknown }) =>
                              typeof s.url === "string" &&
                              /^\/(?!\/)[a-zA-Z0-9/_%-]+$/.test(s.url),
                      )
                    : [],
            });
            // Only dedicated question turns enter AI history; collected fields never do.
            aiHistory.current = [
                ...aiHistory.current,
                { role: "user", text },
                { role: "assistant", text: data.answer },
            ].slice(-6) as typeof aiHistory.current;
            setChoices([
                ...(active
                    ? [{ label: "Continue My Enquiry", action: "RESUME" }]
                    : []),
                ...(Array.isArray(data.suggested_actions)
                    ? data.suggested_actions
                          .filter(
                              (a: { action: string }) =>
                                  actionLabels[a.action] &&
                                  a.action !== "RESUME",
                          )
                          .slice(0, 3)
                          .map((a: { action: string }) => ({
                              label: actionLabels[a.action],
                              action: a.action,
                          }))
                    : []),
                { label: "Back to Main Menu", action: "MAIN_MENU" },
            ]);
            setLastQuestion("");
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Unable to answer right now.",
            );
            setChoices([
                ...(active
                    ? [{ label: "Continue My Enquiry", action: "RESUME" }]
                    : []),
                { label: "Retry Question", action: "RETRY_AI" },
                ...mainMenu.slice(0, 3),
            ]);
        }
    }
    function portfolioPage(projects: Project[], offset: number) {
        const caseStudies = projects.some((p) => p.kind === "case-study");
        setProjectList(projects);
        setProjectOffset(offset);
        append(
            projects.length
                ? "Would you like us to build something similar for your business?"
                : "No projects are currently published in this category.",
            { projects: projects.slice(offset, offset + 3) },
        );
        setChoices([
            ...(offset + 3 < projects.length
                ? [
                      {
                          label: caseStudies
                              ? "Show More Case Studies"
                              : "Show More Projects",
                          action: "MORE_PROJECTS",
                      },
                  ]
                : []),
            { label: "Yes, Discuss My Project", action: "START_ENQUIRY" },
            {
                label: caseStudies
                    ? "All Case Studies"
                    : "Portfolio Categories",
                action: caseStudies ? "CASE_STUDIES" : "PORTFOLIO",
            },
        ]);
    }
    function requestContact(option: Option) {
        setInput("");
        setMessages((previous) => [
            ...previous.slice(-98),
            msg("user", option.label),
            msg("assistant", "Please share your contact details to continue."),
        ]);
        setContactIntent(option);
        setChoices([]);
    }
    function continueAfterContact(contact: ContactDetails) {
        contactSaved.current = true;
        const intent = contactIntent;
        setContactIntent(null);
        update({
            ...stateRef.current,
            draft: {
                ...stateRef.current.draft,
                name: contact.name,
                phone: contact.phone,
                email: contact.email,
            },
        });
        if (intent) void act(intent, true);
    }
    async function act(option: Option, alreadyShown = false) {
        if (
            pending.current ||
            activeReplyId ||
            !catalogue ||
            (contactIntent && !alreadyShown)
        )
            return;
        if (!contactSaved.current && option.action !== "RESTART") {
            requestContact(option);
            return;
        }
        pending.current = true;
        setBusy(true);
        setError("");
        setInput("");
        const { action, value, label } = option;
        const snapshot = stateRef.current;
        if (!alreadyShown && !["BACK", "RESUME"].includes(action))
            setMessages((prev) => [...prev.slice(-99), msg("user", label)]);
        try {
            if (!["RESTART", "SCHEDULE"].includes(action)) {
                await new Promise((resolve) =>
                    setTimeout(
                        resolve,
                        window.matchMedia("(prefers-reduced-motion: reduce)")
                            .matches
                            ? 0
                            : 550,
                    ),
                );
            }
            switch (action) {
                case "ASK_AFTER_CONTACT":
                    await ask(value || label);
                    break;
                case "MAIN_MENU":
                    show(go(snapshot, "MAIN_MENU"));
                    break;
                case "BACK":
                    show(back(snapshot));
                    break;
                case "RESUME":
                    show({
                        ...snapshot,
                        step: resumeStep.current,
                        suspended: false,
                    });
                    break;
                case "SERVICES":
                    show({
                        ...go(snapshot, "SERVICE_CATEGORY"),
                        selectingService: false,
                    });
                    break;
                case "CATEGORY": {
                    const category = catalogue.categories.find(
                        (c) => c.id === value,
                    );
                    if (!category)
                        throw new Error("Please choose an available category.");
                    update({
                        ...go(snapshot, "SERVICE_LIST"),
                        context: { ...snapshot.context, category: category.id },
                    });
                    append(
                        `Which ${category.title.toLowerCase()} service interests you?`,
                    );
                    setChoices(
                        category.services.map((s) => ({
                            label: s.title,
                            action: "SERVICE",
                            value: s.id,
                        })),
                    );
                    break;
                }
                case "SERVICE": {
                    const service = catalogue.categories
                        .flatMap((c) => c.services)
                        .find((s) => s.id === value);
                    if (!service)
                        throw new Error("Please choose an available service.");
                    const next = go(snapshot, "SERVICE_DETAIL", {
                        ...snapshot.draft,
                        service: service.id,
                    });
                    if (snapshot.selectingService) {
                        show({
                            ...go(
                                next,
                                snapshot.editing
                                    ? "REVIEW_ENQUIRY"
                                    : "PROJECT_TYPE",
                            ),
                            editing: false,
                            selectingService: false,
                        });
                        break;
                    }
                    const details = await getData<Service>(
                        `?service=${encodeURIComponent(service.id)}`,
                    );
                    serviceCache.current.set(service.id, details);
                    setCurrentService(details);
                    update(next);
                    append(
                        `${details.title}\n\n${details.description?.slice(0, 1200) || "Explore this service on our website."}${details.features?.length ? "\n\nWhat we offer\n" + details.features.slice(0, 4).join("\n") : ""}${details.benefits?.length ? "\n\nBenefits\n" + details.benefits.slice(0, 3).join("\n") : ""}${details.technologies?.length ? "\n\nTechnologies: " + details.technologies.join(", ") : ""}`,
                        {
                            links: [
                                {
                                    title: "Read service details",
                                    url: details.url,
                                },
                            ],
                        },
                    );
                    setChoices(serviceActions);
                    break;
                }
                case "START_ENQUIRY": {
                    const next = {
                        ...snapshot,
                        enquiry: true,
                        editing: false,
                        suspended: false,
                        selectingService: !snapshot.draft.service,
                    };
                    sourcePage.current = pathname;
                    if (!catalogue.enquiryEnabled)
                        append(
                            "You can prepare your project brief here. To send an enquiry to our team, please use our contact page.",
                            {
                                links: [
                                    {
                                        title: "Contact Our Team",
                                        url: "/contact-us",
                                    },
                                ],
                            },
                        );
                    show(
                        go(
                            next,
                            snapshot.draft.service
                                ? "PROJECT_TYPE"
                                : "SERVICE_CATEGORY",
                        ),
                    );
                    break;
                }
                case "WEBSITE_FORM": {
                    const service = catalogue.categories
                        .flatMap((c) => c.services)
                        .find((s) => s.id === snapshot.draft.service);
                    const prefill = websiteEnquiryPrefill(
                        snapshot.draft,
                        service?.title,
                        sourcePage.current,
                        utm.current,
                    );
                    onClose();
                    openLetsConnectModal(
                        "Chatbot enquiry",
                        snapshot.draft.service,
                        prefill,
                    );
                    break;
                }
                case "ANSWER":
                case "SKIP": {
                    const result = answer(
                        snapshot,
                        value || label,
                        action === "SKIP",
                    );
                    if (result.error) throw new Error(result.error);
                    show(result.state);
                    break;
                }
                case "ASK":
                    setQuestionMode(true);
                    append(
                        snapshot.enquiry
                            ? "Ask your question. Your enquiry will stay here, ready to continue."
                            : "What would you like to know?",
                    );
                    setChoices(
                        snapshot.enquiry
                            ? [
                                  {
                                      label: "Continue My Enquiry",
                                      action: "RESUME",
                                  },
                              ]
                            : [],
                    );
                    break;
                case "RETRY_AI":
                    if (lastQuestion) await ask(lastQuestion);
                    break;
                case "REFINE_REQUIREMENTS": {
                    const service = catalogue.categories
                        .flatMap((c) => c.services)
                        .find((s) => s.id === snapshot.draft.service);
                    const r = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            message:
                                `Selected service: ${service?.title || "Not selected"}. Project requirements: ${snapshot.draft.requirements || ""}`.slice(
                                    0,
                                    2000,
                                ),
                            purpose: "requirements",
                            requestId: crypto.randomUUID(),
                            currentPage: service?.url || pathname,
                            guidedStepActive: true,
                        }),
                        signal: AbortSignal.timeout(60000),
                    });
                    const data = await r.json();
                    if (!r.ok || typeof data.answer !== "string")
                        throw new Error(
                            data.error ||
                                "AI refinement is unavailable. You can continue by choosing your budget.",
                        );
                    show({
                        ...go(snapshot, "PROJECT_FOLLOWUP"),
                        context: {
                            ...snapshot.context,
                            followup: data.answer.slice(0, 1000),
                        },
                    });
                    break;
                }
                case "PORTFOLIO":
                    update(go(snapshot, "PORTFOLIO_CATEGORY"));
                    append("Please choose a portfolio category.");
                    setChoices(
                        catalogue.portfolio.map((p) => ({
                            label: p.title,
                            action: "PROJECT_GROUP",
                            value: p.id,
                        })),
                    );
                    break;
                case "CASE_STUDIES": {
                    const projects = await getData<Project[]>("?caseStudies=1");
                    projectCache.current.set("case-studies", projects);
                    update({
                        ...go(snapshot, "PORTFOLIO_DETAIL"),
                        context: { ...snapshot.context, group: "case-studies" },
                    });
                    append(
                        "Explore our published case studies. Open a card to see the project details, challenges, approach and results where available.",
                    );
                    portfolioPage(projects, 0);
                    break;
                }
                case "CASE_STUDY_DETAIL": {
                    const detail = await getData<Project>(
                        `?caseStudy=${encodeURIComponent(value || "")}`,
                    );
                    const key = `case-study:${detail.id}`;
                    projectCache.current.set(key, [detail]);
                    update({
                        ...go(snapshot, "PORTFOLIO_DETAIL", {
                            ...snapshot.draft,
                            project: detail.title,
                        }),
                        context: { ...snapshot.context, group: key },
                    });
                    append(
                        `Here's the published case study for ${detail.title}. Expand the sections below to explore its details.`,
                        { projects: [detail] },
                    );
                    setChoices([
                        {
                            label: "Discuss a Similar Project",
                            action: "START_ENQUIRY",
                        },
                        {
                            label: "View More Case Studies",
                            action: "CASE_STUDIES",
                        },
                    ]);
                    break;
                }
                case "PROJECT_GROUP": {
                    const projects = await getData<Project[]>(
                        `?group=${encodeURIComponent(value || "")}`,
                    );
                    projectCache.current.set(value || "", projects);
                    update({
                        ...go(snapshot, "PORTFOLIO_DETAIL"),
                        context: { ...snapshot.context, group: value },
                    });
                    portfolioPage(projects, 0);
                    break;
                }
                case "MORE_PROJECTS":
                    portfolioPage(projectList, projectOffset + 3);
                    break;
                case "RELATED_PROJECTS": {
                    const key = `service:${currentService?.id}`;
                    projectCache.current.set(
                        key,
                        currentService?.projects || [],
                    );
                    update({
                        ...go(snapshot, "PORTFOLIO_DETAIL"),
                        context: { ...snapshot.context, group: key },
                    });
                    portfolioPage(currentService?.projects || [], 0);
                    break;
                }
                case "SELECT_PROJECT": {
                    const p = [...projectCache.current.values()]
                        .flat()
                        .find((p) => p.id === value);
                    if (!p) break;
                    update({
                        ...snapshot,
                        draft: { ...snapshot.draft, project: p.title },
                    });
                    append(
                        `I've noted ${p.title} as inspiration for your enquiry.`,
                        { links: [{ title: "View Project", url: p.url }] },
                    );
                    setChoices([
                        {
                            label: "Discuss My Project",
                            action: "START_ENQUIRY",
                        },
                        { label: "View More Portfolio", action: "PORTFOLIO" },
                    ]);
                    break;
                }
                case "ABOUT":
                    update(go(snapshot, "ABOUT"));
                    append(
                        catalogue.about?.slice(0, 1800) ||
                            "Please visit our About Us page for the latest company information.",
                        { links: [{ title: "Read More", url: "/about-us" }] },
                    );
                    setChoices([
                        ...(catalogue.mission
                            ? [
                                  {
                                      label: "Our Mission & Vision",
                                      action: "MISSION",
                                  },
                              ]
                            : []),
                        { label: "Our Experience", action: "JOURNEY" },
                        { label: "Our Technologies", action: "TECHNOLOGIES" },
                        { label: "Contact Our Team", action: "CONTACT" },
                    ]);
                    break;
                case "MISSION":
                    append(catalogue.mission, {
                        links: [{ title: "Read More", url: "/about-us" }],
                    });
                    break;
                case "JOURNEY":
                    append(
                        catalogue.journey?.slice(0, 2200) ||
                            "Explore the published story of Eclick Softwares.",
                        {
                            links: [
                                { title: "Our Journey", url: "/our-journey" },
                            ],
                        },
                    );
                    break;
                case "TECHNOLOGIES":
                    update(go(snapshot, "TECHNOLOGIES"));
                    append(
                        "Choose a service to see the technologies published on its page.",
                    );
                    setChoices(
                        catalogue.categories.map((c) => ({
                            label: c.title,
                            action: "TECH_CATEGORY",
                            value: c.id,
                        })),
                    );
                    break;
                case "TECH_CATEGORY": {
                    const c = catalogue.categories.find((c) => c.id === value);
                    if (!c) break;
                    append(
                        "Select a service for its verified technology stack.",
                    );
                    setChoices(
                        c.services.map((s) => ({
                            label: s.title,
                            action: "TECH_SERVICE",
                            value: s.id,
                        })),
                    );
                    break;
                }
                case "TECH_SERVICE": {
                    const service = await getData<Service>(
                        `?service=${encodeURIComponent(value || "")}`,
                    );
                    setCurrentService(service);
                    append(
                        service.technologies?.length
                            ? `${service.title} uses these published technologies: ${service.technologies.join(", ")}.`
                            : "No technology stack is currently published for this service.",
                        { links: [{ title: service.title, url: service.url }] },
                    );
                    setChoices([
                        ...(service.technologies || []).map((t) => ({
                            label: t,
                            action: "TECH_DETAIL",
                            value: t,
                        })),
                        {
                            label: "Discuss My Project",
                            action: "START_ENQUIRY",
                        },
                    ]);
                    break;
                }
                case "TECH_DETAIL":
                    await ask(
                        `Explain the business benefits of ${value} in relation to ${currentService?.title}. Only claim Eclick capabilities supported by the sources.`,
                    );
                    break;
                case "CONTACT":
                    update(go(snapshot, "CONTACT"));
                    append(
                        "You can reach our team through the following published channels.",
                        {
                            links: [
                                ...(catalogue.email
                                    ? [
                                          {
                                              title: `Email: ${catalogue.email}`,
                                              url: `mailto:${catalogue.email}`,
                                          },
                                      ]
                                    : []),
                                ...(catalogue.phone
                                    ? [
                                          {
                                              title: `Call: ${catalogue.phone}`,
                                              url: `tel:${catalogue.phone.replace(/[^+0-9]/g, "")}`,
                                          },
                                      ]
                                    : []),
                                ...(catalogue.offices || [])
                                    .filter(
                                        (office) =>
                                            office.phone &&
                                            office.phone !== catalogue.phone,
                                    )
                                    .map((office) => ({
                                        title: `Call ${office.title}: ${office.phone}`,
                                        url: `tel:${office.phone.replace(/[^+0-9]/g, "")}`,
                                    })),
                                {
                                    title: "Visit Contact Page",
                                    url: "/contact-us",
                                },
                            ],
                        },
                    );
                    setChoices([
                        { label: "View Office Locations", action: "LOCATIONS" },
                        {
                            label: "Schedule a Consultation",
                            action: "SCHEDULE",
                        },
                        {
                            label: "Discuss My Project",
                            action: "START_ENQUIRY",
                        },
                    ]);
                    break;
                case "SCHEDULE":
                    onClose();
                    openScheduleModal("Chatbot consultation");
                    break;
                case "LOCATIONS":
                    append(
                        (catalogue.offices?.length
                            ? catalogue.offices
                                  .map((office) =>
                                      [
                                          office.title,
                                          office.address,
                                          office.phone,
                                          office.email,
                                      ]
                                          .filter(Boolean)
                                          .join("\n"),
                                  )
                                  .join("\n\n")
                            : catalogue.locations.join("\n\n")) ||
                            "Please contact our team for office information.",
                        {
                            links: [
                                {
                                    title: "Contact Our Team",
                                    url: "/contact-us",
                                },
                            ],
                        },
                    );
                    break;
                case "EDIT":
                    update({ ...snapshot, step: "EDIT_DETAILS" });
                    append("Which detail would you like to edit?");
                    setChoices([
                        { label: "Service", action: "EDIT_SERVICE" },
                        ...steps
                            .filter(
                                (s) =>
                                    s.field !== "consent" &&
                                    s.id !== "PROJECT_FOLLOWUP" &&
                                    (s.field !== "website" ||
                                        snapshot.draft.existingWebsite ===
                                            "Yes"),
                            )
                            .map((s) => ({
                                label: labels[s.field],
                                action: "EDIT_FIELD",
                                value: s.id,
                            })),
                        { label: "Return to Summary", action: "REVIEW" },
                    ]);
                    break;
                case "EDIT_SERVICE":
                    show({
                        ...go(snapshot, "SERVICE_CATEGORY"),
                        editing: true,
                        enquiry: true,
                        selectingService: true,
                    });
                    break;
                case "EDIT_FIELD":
                    if (value && stepById[value])
                        show({ ...go(snapshot, value), editing: true });
                    break;
                case "REVIEW":
                    show({ ...go(snapshot, "REVIEW_ENQUIRY"), editing: false });
                    break;
                case "CANCEL":
                    update({
                        ...go(snapshot, "MAIN_MENU", {}),
                        enquiry: false,
                        editing: false,
                    });
                    append(
                        "Your enquiry draft has been cancelled. How else can we help?",
                    );
                    setChoices(mainMenu);
                    break;
                case "SUBMIT": {
                    if (snapshot.step !== "REVIEW_ENQUIRY") break;
                    if (!catalogue.enquiryEnabled)
                        throw new Error(
                            "Online enquiry submission is not connected yet. Please use our contact page. Your draft is still available here.",
                        );
                    const r = await fetch("/api/chatbot/enquiry", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Idempotency-Key": snapshot.requestId,
                        },
                        body: JSON.stringify({
                            draft: snapshot.draft,
                            confirmed: true,
                            sourcePage: sourcePage.current,
                            utm: utm.current,
                        }),
                        signal: AbortSignal.timeout(20000),
                    });
                    const data = await r.json();
                    if (
                        !r.ok ||
                        (data.accepted !== true &&
                            typeof data.reference !== "string")
                    )
                        throw new Error(
                            data.error ||
                                "We could not confirm receipt. Please retry.",
                        );
                    append(
                        `Thank you, ${snapshot.draft.name}! 🎉\nYour project enquiry has been submitted successfully. Our team will review your requirements and contact you as soon as possible.${typeof data.reference === "string" ? `\n\nEnquiry reference: ${data.reference}` : ""}${data.notificationStatus === "failed" ? "\nYour enquiry is saved; the email notification could not be delivered." : ""}`,
                        {
                            links: [
                                {
                                    title: "Visit Contact Page",
                                    url: "/contact-us",
                                },
                            ],
                        },
                    );
                    update({ ...initialState(), step: "ENQUIRY_SUCCESS" });
                    setChoices([
                        { label: "View Our Portfolio", action: "PORTFOLIO" },
                        { label: "Explore More Services", action: "SERVICES" },
                        { label: "Start New Conversation", action: "RESTART" },
                    ]);
                    break;
                }
                case "RESTART":
                    setRestartCheck(true);
                    break;
            }
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            pending.current = false;
            setBusy(false);
        }
    }
    async function send(e: FormEvent) {
        e.preventDefault();
        const text = input.trim();
        if (!text || pending.current || activeReplyId || contactIntent) return;
        if (!contactSaved.current) {
            requestContact({
                label: text,
                action: "ASK_AFTER_CONTACT",
                value: text,
            });
            return;
        }
        if (!questionMode && !state.suspended && stepById[state.step]) {
            await act({ label: text, action: "ANSWER", value: text });
            return;
        }
        pending.current = true;
        setBusy(true);
        setError("");
        setInput("");
        setMessages((prev) => [...prev.slice(-99), msg("user", text)]);
        const version = generation.current;
        try {
            await ask(text);
        } finally {
            if (version === generation.current) {
                pending.current = false;
                setBusy(false);
            }
        }
    }
    function restart() {
        contactSaved.current = false;
        setContactIntent(null);
        generation.current++;
        setCompletedReplies(new Set());
        update(initialState());
        setMessages([
            msg("assistant", "Welcome back! How can we assist you today?"),
        ]);
        setChoices(mainMenu);
        setInput("");
        setError("");
        setQuestionMode(false);
        setCurrentService(null);
        setProjectList([]);
        aiHistory.current = [];
        setLastQuestion("");
        setRestartCheck(false);
    }
    function keys(e: KeyboardEvent<HTMLElement>) {
        if (e.key === "Escape") {
            e.preventDefault();
            if (restartCheck) setRestartCheck(false);
            else onClose();
        }
        if (e.key === "Tab") {
            const focusable = Array.from(
                (restartCheck
                    ? restartPopup.current
                    : panel.current
                )?.querySelectorAll<HTMLElement>(
                    "button:not(:disabled),a[href],textarea:not(:disabled),input:not(:disabled),summary",
                ) || [],
            ).filter((el) => el.offsetParent !== null);
            const first = focusable[0],
                last = focusable.at(-1);
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        }
    }
    useEffect(() => {
        if (!open || !catalogueReady) return;
        let alive = true;
        let refreshing = false;
        async function refreshCatalogue() {
            if (refreshing || document.visibilityState === "hidden") return;
            refreshing = true;
            try {
                const fresh = await getData<Catalogue>();
                if (!alive) return;
                setCatalogue(fresh);
                setChoices((previous) =>
                    previous.flatMap((option) => {
                        const entry = ["CATEGORY", "TECH_CATEGORY"].includes(
                            option.action,
                        )
                            ? fresh.categories.find(
                                  (category) => category.id === option.value,
                              )
                            : [
                                    "SERVICE",
                                    "TECH_SERVICE",
                                    "SELECT_SERVICE",
                                ].includes(option.action)
                              ? fresh.categories
                                    .flatMap((category) => category.services)
                                    .find(
                                        (service) =>
                                            service.id === option.value,
                                    )
                              : option.action === "PROJECT_GROUP"
                                ? fresh.portfolio.find(
                                      (group) => group.id === option.value,
                                  )
                                : undefined;
                        const dynamicOption = [
                            "CATEGORY",
                            "TECH_CATEGORY",
                            "SERVICE",
                            "TECH_SERVICE",
                            "SELECT_SERVICE",
                            "PROJECT_GROUP",
                        ].includes(option.action);
                        return entry
                            ? [{ ...option, label: entry.title }]
                            : dynamicOption
                              ? []
                              : [option];
                    }),
                );
                for (const [id, detail] of serviceCache.current) {
                    const latest = fresh.categories
                        .flatMap((category) => category.services)
                        .find((service) => service.id === id);
                    if (latest)
                        serviceCache.current.set(id, {
                            ...detail,
                            title: latest.title,
                        });
                    else serviceCache.current.delete(id);
                }
            } catch {
                // Keep the current conversation usable if a background refresh fails.
            } finally {
                refreshing = false;
            }
        }
        void refreshCatalogue();
        const timer = window.setInterval(() => void refreshCatalogue(), 15000);
        const refresh = () => void refreshCatalogue();
        window.addEventListener("focus", refresh);
        document.addEventListener("visibilitychange", refresh);
        return () => {
            alive = false;
            window.clearInterval(timer);
            window.removeEventListener("focus", refresh);
            document.removeEventListener("visibilitychange", refresh);
        };
    }, [open, catalogueReady]);
    const collecting = Boolean(stepById[state.step]);
    return (
        <section
            ref={panel}
            id="eclick-chat"
            className={styles.panel}
            style={
                viewport
                    ? ({
                          "--chat-viewport-height": `${viewport.height}px`,
                          "--chat-viewport-top": `${viewport.top}px`,
                      } as CSSProperties)
                    : undefined
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="eclick-chat-title"
            onKeyDown={keys}
        >
            <header className={styles.header}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className={styles.avatar}
                    src="/assets/images/ai-assistant.svg"
                    alt=""
                    width="48"
                    height="48"
                />
                <div className={styles.heading}>
                    <h2 id="eclick-chat-title">Eclick AI Assistant</h2>
                    <p>
                        <span aria-hidden="true" />
                        AI-powered guidance
                    </p>
                </div>
                <button
                    type="button"
                    ref={restartTrigger}
                    onClick={() => setRestartCheck(true)}
                    disabled={responding || savingContact}
                    aria-label="Restart conversation"
                    title="Restart"
                >
                    ↻
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Minimise conversation"
                    title="Minimise"
                >
                    −
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close conversation"
                    title="Close"
                >
                    ×
                </button>
            </header>
            <div className={styles.intro}>YOUR NEXT DIGITAL CHAPTER</div>
            <div
                className={styles.messages}
                ref={log}
                role="log"
                aria-live="polite"
                aria-label="Conversation"
            >
                {visibleMessages.map((m) => (
                    <div
                        key={m.id}
                        className={
                            m.role === "user" ? styles.user : styles.assistant
                        }
                    >
                        <span className={styles.author}>
                            {m.role === "user" ? "You" : "Eclick AI"}
                        </span>
                        {m.role === "assistant" ? (
                            <AnimatedReply
                                text={m.text}
                                onComplete={() =>
                                    setCompletedReplies((previous) => {
                                        const retained = new Set(
                                            [...previous].filter((id) =>
                                                messages.some(
                                                    (message) =>
                                                        message.id === id,
                                                ),
                                            ),
                                        );
                                        retained.add(m.id);
                                        return retained;
                                    })
                                }
                                onProgress={() => {
                                    const area = log.current;
                                    if (
                                        area &&
                                        area.scrollHeight -
                                            area.clientHeight -
                                            area.scrollTop <
                                            90
                                    )
                                        area.scrollTop = area.scrollHeight;
                                }}
                            />
                        ) : (
                            <p>{m.text}</p>
                        )}
                        {m.links?.length && completedReplies.has(m.id) ? (
                            <div className={styles.links}>
                                {m.links.map((l) =>
                                    l.url.startsWith("/") ? (
                                        <Link key={l.url} href={l.url}>
                                            {l.title}
                                        </Link>
                                    ) : (
                                        <a key={l.url} href={l.url}>
                                            {l.title}
                                        </a>
                                    ),
                                )}
                            </div>
                        ) : null}
                        {completedReplies.has(m.id) && m.projects?.length ? (
                            <ProjectCarousel
                                projects={m.projects}
                                disabled={responding}
                                onAction={(option) => void act(option)}
                            />
                        ) : null}
                        <time dateTime={new Date(m.time).toISOString()}>
                            {new Date(m.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </time>
                    </div>
                ))}
                {contactIntent && !responding && (
                    <ContactGate
                        interest={contactIntent.label}
                        onSaved={continueAfterContact}
                        onBusy={setSavingContact}
                    />
                )}
                {state.step === "REVIEW_ENQUIRY" && !responding && (
                    <div className={styles.review}>
                        <h3>Your project enquiry</h3>
                        <dl>
                            {Object.entries(state.draft)
                                .filter(([, v]) => Boolean(v))
                                .map(([key, value]) => (
                                    <div key={key}>
                                        <dt>{labels[key] || key}</dt>
                                        <dd>
                                            {key === "service"
                                                ? catalogue?.categories
                                                      .flatMap(
                                                          (c) => c.services,
                                                      )
                                                      .find(
                                                          (s) => s.id === value,
                                                      )?.title
                                                : value}
                                        </dd>
                                    </div>
                                ))}
                        </dl>
                    </div>
                )}
                {busy && !activeReplyId && (
                    <div
                        className={styles.typingRow}
                        role="status"
                        aria-label="Assistant is typing"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/assets/images/ai-assistant.svg"
                            alt=""
                            width="28"
                            height="28"
                        />
                        <span className={styles.typing} aria-hidden="true">
                            <i />
                            <i />
                            <i />
                        </span>
                    </div>
                )}
                {error && (
                    <div className={styles.error} role="alert">
                        <p>{error}</p>
                        <Link href="/contact-us">Visit Contact Page</Link>
                        {!catalogue && (
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                            >
                                Reload
                            </button>
                        )}
                    </div>
                )}
                {!responding && !restartCheck && !contactIntent && (
                    <div className={styles.choices}>
                        {choices.map((o, i) => (
                            <button
                                type="button"
                                key={`${o.action}-${o.value}-${i}`}
                                onClick={() => void act(o)}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {(state.history.length > 0 ||
                state.enquiry ||
                state.step !== "MAIN_MENU") && (
                <nav
                    className={styles.nav}
                    aria-label="Conversation navigation"
                >
                    <button
                        type="button"
                        disabled={responding || !state.history.length}
                        onClick={() =>
                            void act({ label: "Back", action: "BACK" })
                        }
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        disabled={responding}
                        aria-label="Main Menu"
                        onClick={() =>
                            void act({
                                label: "Main Menu",
                                action: "MAIN_MENU",
                            })
                        }
                    >
                        Menu
                    </button>
                    {state.enquiry && (
                        <button
                            type="button"
                            disabled={responding}
                            aria-label="Continue Enquiry"
                            onClick={() =>
                                show({
                                    ...state,
                                    step: resumeStep.current,
                                    suspended: false,
                                })
                            }
                        >
                            Resume
                        </button>
                    )}
                    {collecting && (
                        <button
                            type="button"
                            disabled={responding}
                            aria-label="Ask a Question"
                            onClick={() =>
                                void act({
                                    label: "Ask a Question",
                                    action: "ASK",
                                })
                            }
                        >
                            Ask AI
                        </button>
                    )}
                </nav>
            )}
            <form
                className={styles.form}
                onSubmit={send}
                hidden={Boolean(contactIntent)}
            >
                <label className={styles.srOnly} htmlFor="eclick-message">
                    {questionMode
                        ? "Your question"
                        : collecting
                          ? "Your answer"
                          : "Your message"}
                </label>
                <textarea
                    ref={field}
                    id="eclick-message"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={
                        responding || !catalogue || Boolean(contactIntent)
                    }
                    maxLength={collecting && !questionMode ? 4000 : 2000}
                    placeholder={
                        questionMode
                            ? "Ask your question…"
                            : collecting
                              ? "Type your answer…"
                              : "Type a message…"
                    }
                    onKeyDown={(e) => {
                        if (
                            e.key === "Enter" &&
                            !e.shiftKey &&
                            !e.nativeEvent.isComposing
                        ) {
                            e.preventDefault();
                            void send(e);
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={
                        responding ||
                        !input.trim() ||
                        !catalogue ||
                        Boolean(contactIntent)
                    }
                    aria-label="Send message"
                >
                    Send
                </button>
            </form>
            <div className={styles.footerMeta}>
                <p className={styles.note}>
                    Powered by Eclick Softwares · Eclick AI
                </p>
                <details className={styles.privacy}>
                    <summary>Privacy</summary>
                    <p>
                        {questionMode || !collecting
                            ? "Questions use AI. Please avoid sharing personal details."
                            : "Your draft stays in this conversation until you submit."}
                    </p>
                </details>
            </div>
            {restartCheck && (
                <div className={styles.restartOverlay}>
                    <div
                        ref={restartPopup}
                        className={styles.restartPopup}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="restart-title"
                        aria-describedby="restart-description"
                    >
                        <h3 id="restart-title">Start a new conversation?</h3>
                        <p id="restart-description">
                            This clears your current draft and messages.
                        </p>
                        <div className={styles.choices}>
                            <button
                                type="button"
                                data-keep-conversation
                                onClick={() => setRestartCheck(false)}
                            >
                                Keep Conversation
                            </button>
                            <button
                                type="button"
                                className={styles.restartConfirm}
                                onClick={restart}
                            >
                                Start New Conversation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
