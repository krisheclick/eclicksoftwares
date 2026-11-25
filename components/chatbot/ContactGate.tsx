"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./Chatbot.module.css";

export type ContactDetails = { name: string; phone: string; email: string };
export default function ContactGate({
    interest,
    onSaved,
    onBusy,
}: {
    interest: string;
    onSaved: (contact: ContactDetails) => void;
    onBusy: (busy: boolean) => void;
}) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const submitting = useRef(false);
    const firstField = useRef<HTMLInputElement>(null);
    useEffect(() => {
        firstField.current?.focus();
    }, []);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submitting.current) return;
        const form = new FormData(event.currentTarget);
        const contact = {
            name: String(form.get("name") || "").trim(),
            phone: String(form.get("phone") || "").trim(),
            email: String(form.get("email") || "").trim(),
        };
        submitting.current = true;
        setBusy(true);
        onBusy(true);
        setError("");
        try {
            const response = await fetch("/api/chatbot/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...contact,
                    consent: form.get("consent") === "on",
                    interest,
                }),
                signal: AbortSignal.timeout(25000),
            });
            const result = await response.json();
            if (!response.ok || result.accepted !== true)
                throw new Error(result.error || "Please try again.");
            onSaved(contact);
        } catch (failure) {
            setError(
                failure instanceof Error
                    ? failure.message
                    : "Please try again.",
            );
        } finally {
            submitting.current = false;
            setBusy(false);
            onBusy(false);
        }
    }
    return (
        <form
            className={styles.contactGate}
            onSubmit={submit}
            aria-label="Your contact details"
        >
            <fieldset disabled={busy}>
                <legend className={styles.srOnly}>Your contact details</legend>
                <label htmlFor="chat-contact-name">Your Name</label>
                <input
                    ref={firstField}
                    id="chat-contact-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                    minLength={2}
                    maxLength={100}
                />
                <label htmlFor="chat-contact-phone">Mobile Number</label>
                <input
                    id="chat-contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Mobile number"
                    required
                    minLength={7}
                    maxLength={25}
                />
                <label htmlFor="chat-contact-email">Email Id</label>
                <input
                    id="chat-contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email address"
                    required
                    maxLength={254}
                />
                <label className={styles.contactConsent}>
                    <input type="checkbox" name="consent" required />
                    <span>
                        I agree to the{" "}
                        <Link
                            href="/privacy-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Privacy Policy
                        </Link>{" "}
                        and being contacted.
                    </span>
                </label>
                {error && (
                    <p role="alert" className={styles.contactError}>
                        {error}
                    </p>
                )}
                <button type="submit">{busy ? "Saving…" : "Submit"}</button>
            </fieldset>
        </form>
    );
}
