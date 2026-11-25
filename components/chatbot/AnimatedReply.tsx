"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Chatbot.module.css";

export default function AnimatedReply({
    text,
    onProgress,
}: {
    text: string;
    onProgress: () => void;
}) {
    const [visible, setVisible] = useState(0);
    const progress = useRef(onProgress);
    const characters = Array.from(text);

    useEffect(() => {
        progress.current = onProgress;
    }, [onProgress]);
    useEffect(() => {
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const length = Array.from(text).length;
        let timer: ReturnType<typeof setInterval> | undefined;
        const finish = () => {
            clearInterval(timer);
            setVisible(length);
            requestAnimationFrame(() => progress.current());
        };
        if (motion.matches) {
            finish();
            return;
        }
        setVisible(0);
        let count = 0;
        // Keep longer service answers readable without making visitors wait too long.
        const stride = Math.max(1, Math.ceil(length / 110));
        timer = setInterval(() => {
            count = Math.min(length, count + stride);
            setVisible(count);
            requestAnimationFrame(() => progress.current());
            if (count === length) clearInterval(timer);
        }, 18);
        const onMotionChange = () => {
            if (motion.matches) finish();
        };
        motion.addEventListener("change", onMotionChange);
        return () => {
            clearInterval(timer);
            motion.removeEventListener("change", onMotionChange);
        };
    }, [text]);

    return (
        <p className={styles.replyText}>
            <span className={styles.srOnly}>{text}</span>
            <span aria-hidden="true">
                {characters.slice(0, visible).join("")}
                {visible < characters.length && (
                    <span className={styles.typeCursor} />
                )}
            </span>
        </p>
    );
}
