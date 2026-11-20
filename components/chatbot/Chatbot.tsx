"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLetsConnect, useScheduleCall } from "@/utils/useLetsConnect";
import styles from "./Chatbot.module.css";
import { chatbotServices } from "@/data/chatbotServices";

type Message = { role: "assistant" | "user"; text: string };
const welcome: Message = { role: "assistant", text: "Hi! Welcome to Eclick. Looking to build a website, grow your business, or explore AI automation? Let’s find the right solution for you." };

export default function Chatbot() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([welcome]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const launcher = useRef<HTMLButtonElement>(null);
    const field = useRef<HTMLInputElement>(null);
    const log = useRef<HTMLDivElement>(null);
    const solutions = useRef<HTMLDetailsElement>(null);
    const pending = useRef(false);
    const controller = useRef<AbortController | null>(null);
    const { openLetsConnectModal } = useLetsConnect();
    const { openScheduleModal } = useScheduleCall();

    useEffect(() => () => controller.current?.abort(), []);
    useEffect(() => { if (open) field.current?.focus(); }, [open]);
    useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, error, open]);

    function close() { setOpen(false); launcher.current?.focus(); }
    async function send(event: FormEvent) {
        event.preventDefault();
        const text = input.trim();
        if (!text || pending.current) return;
        pending.current = true;
        if (solutions.current) solutions.current.open = false;
        setInput(""); setError(""); setBusy(true);
        setMessages(previous => [...previous, { role: "user", text }]);
        controller.current = new AbortController();
        try {
            const response = await fetch("/api/chat", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, currentPage: pathname, history: messages.slice(1).slice(-8).map(message => ({ role: message.role, text: message.text.slice(0, 2000) })) }), signal: controller.current.signal,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Unable to send. Please try again.");
            if (typeof data.answer !== "string") throw new Error("Unable to send. Please try again.");
            setMessages(previous => [...previous, { role: "assistant", text: data.answer }]);
        } catch (failure) {
            if (!controller.current?.signal.aborted) {
                setError(failure instanceof Error ? failure.message : "Unable to send. Please try again.");
                setInput(text);
            }
        } finally { pending.current = false; setBusy(false); }
    }

    return <div className={styles.widget}>
        {open && <section id="eclick-chat" className={styles.panel} aria-label="Eclick assistant" onKeyDown={event => { if (event.key === "Escape") close(); }}>
            <header className={styles.header}>
                <span className={styles.avatar} aria-hidden="true"><Image src="/assets/images/ai-assistant.svg" alt="" width={64} height={64} /></span>
                <div><h2>Eclick Assistant</h2><p>Let’s bring your ideas to life</p></div>
                <button type="button" className={styles.iconButton} onClick={close} aria-label="Close chat">×</button>
            </header>
            <div className={styles.intro}>YOUR NEXT BIG IDEA STARTS HERE</div>
            <details ref={solutions} className={styles.solutions}>
                <summary>Explore our solutions</summary>
                <nav className={styles.shortcuts} aria-label="Solution links">
                    {chatbotServices.map(service => <Link key={service.href} href={service.href} onClick={close}>{service.label}</Link>)}
                </nav>
            </details>
            <div ref={log} className={styles.messages} role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">
                {messages.map((message, index) => <div key={index} className={message.role === "user" ? styles.user : styles.assistant}>
                    <span className={styles.author}>{message.role === "user" ? "You" : "Eclick Assistant"}</span>
                    <p>{message.text}</p>
                </div>)}
                {busy && <p className={styles.status} role="status">Thinking…</p>}
                {error && <p className={styles.error} role="alert">{error}</p>}
            </div>
            <div className={styles.actions}>
                <button type="button" onClick={() => { close(); openLetsConnectModal("Chatbot enquiry"); }}>Get a quote</button>
                <button type="button" onClick={() => { close(); openScheduleModal("Chatbot consultation"); }}>Book a call</button>
            </div>
            <form onSubmit={send} className={styles.form}>
                <label htmlFor="eclick-chat-message" className={styles.srOnly}>Your message</label>
                <input ref={field} id="eclick-chat-message" value={input} onChange={event => setInput(event.target.value)} placeholder="Tell us what you have in mind…" maxLength={2000} autoComplete="off" disabled={busy} />
                <button type="submit" disabled={!input.trim() || busy} aria-label="Send message">Send</button>
            </form>
            <p className={styles.note}>AI can make mistakes. Confirm details with our team.</p>
        </section>}
        <button ref={launcher} type="button" className={styles.launcher} aria-label={open ? "Close chat" : "Chat with Eclick AI Assistant"} aria-expanded={open} aria-controls="eclick-chat" onClick={() => setOpen(previous => !previous)}>
            {!open && <span className={styles.greeting}>👋 How may I help you?</span>}
            <Image src="/assets/images/ai-assistant.svg" alt="" width={104} height={104} priority />
            {open && <span className={styles.closeBadge} aria-hidden="true">×</span>}
        </button>
    </div>;
}
