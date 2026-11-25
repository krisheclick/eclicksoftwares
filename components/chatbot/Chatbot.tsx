"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "./Chatbot.module.css";
const ChatPanel = dynamic(() => import("./ChatPanel"), {
    ssr: false,
    loading: () => (
        <div className={styles.loading} role="status">
            Opening Eclick AI Assistant…
        </div>
    ),
});
export default function Chatbot({ delay = 5000 }: { delay?: number }) {
    const [open, setOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [bubble, setBubble] = useState(false);
    const launcher = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                if (sessionStorage.getItem("eclick-assistance-dismissed"))
                    return;
            } catch {}
            setBubble(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);
    function dismiss() {
        setBubble(false);
        try {
            sessionStorage.setItem("eclick-assistance-dismissed", "1");
        } catch {}
    }
    function close() {
        setOpen(false);
        launcher.current?.focus();
    }
    return (
        <div className={styles.widget}>
            {loaded && (
                <div hidden={!open}>
                    <ChatPanel open={open} onClose={close} />
                </div>
            )}
            {!open && bubble && (
                <div className={styles.greeting}>
                    <button
                        type="button"
                        onClick={() => {
                            dismiss();
                            setLoaded(true);
                            setOpen(true);
                        }}
                    >
                        Would You Like Some Assistance?
                    </button>
                    <button
                        type="button"
                        onClick={dismiss}
                        aria-label="Dismiss assistance message"
                    >
                        ×
                    </button>
                </div>
            )}
            <button
                ref={launcher}
                type="button"
                className={styles.launcher}
                aria-label={
                    open
                        ? "Minimise Eclick AI Assistant"
                        : "Open Eclick AI Assistant"
                }
                aria-expanded={open}
                aria-controls={loaded ? "eclick-chat" : undefined}
                onClick={() => {
                    dismiss();
                    setLoaded(true);
                    setOpen(!open);
                }}
            >
                <Image
                    src="/assets/images/ai-assistant.svg"
                    alt=""
                    width={76}
                    height={76}
                />
                <span className={styles.availability} aria-hidden="true" />
            </button>
        </div>
    );
}
