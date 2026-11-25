"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Chatbot.module.css";

export default function AnimatedReply({
    text,
    onProgress,
    onComplete,
}: {
    text: string;
    onProgress: () => void;
    onComplete: () => void;
}) {
    const [visible, setVisible] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [overflowing, setOverflowing] = useState(false);
    const preview = useRef<HTMLSpanElement>(null);
    const progress = useRef(onProgress);
    const complete = useRef(onComplete);
    const characters = Array.from(text);
    useEffect(() => {
        const node = preview.current;
        if (!node || expanded) return;
        const measure = () =>
            setOverflowing(node.scrollHeight > node.clientHeight + 1);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        return () => observer.disconnect();
    }, [visible, expanded]);

    useEffect(() => {
        progress.current = onProgress;
        complete.current = onComplete;
    }, [onProgress, onComplete]);
    useEffect(() => {
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const length = Array.from(text).length;
        let timer: ReturnType<typeof setInterval> | undefined;
        let completionFrame = 0;
        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            clearInterval(timer);
            setVisible(length);
            completionFrame = requestAnimationFrame(() => {
                progress.current();
                complete.current();
            });
        };
        if (motion.matches || length === 0) {
            finish();
            return () => cancelAnimationFrame(completionFrame);
        }
        setVisible(0);
        let count = 0;
        // Keep longer service answers readable without making visitors wait too long.
        const stride = Math.max(1, Math.ceil(length / 110));
        timer = setInterval(() => {
            count = Math.min(length, count + stride);
            setVisible(count);
            requestAnimationFrame(() => progress.current());
            if (count === length) finish();
        }, 18);
        const onMotionChange = () => {
            if (motion.matches) finish();
        };
        motion.addEventListener("change", onMotionChange);
        return () => {
            clearInterval(timer);
            cancelAnimationFrame(completionFrame);
            motion.removeEventListener("change", onMotionChange);
        };
    }, [text]);

    return (
        <>
            <p
                className={styles.replyText}
                aria-busy={visible < characters.length}
            >
                <span className={styles.srOnly}>{text}</span>
                <span
                    ref={preview}
                    className={expanded ? undefined : styles.replyPreview}
                    aria-hidden="true"
                >
                    {characters.slice(0, visible).join("")}
                    {visible < characters.length && (
                        <span className={styles.typeCursor} />
                    )}
                </span>
            </p>
            {visible >= characters.length && (overflowing || expanded) && (
                <button
                    type="button"
                    className={styles.readMore}
                    aria-expanded={expanded}
                    onClick={() => {
                        setExpanded((value) => !value);
                        requestAnimationFrame(() => progress.current());
                    }}
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </>
    );
}
