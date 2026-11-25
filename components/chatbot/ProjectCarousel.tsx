"use client";
import { useRef, useState, useEffect, useId } from "react";
import Link from "next/link";
import type { Project, Option } from "@/utils/chatbot/types";
import styles from "./Chatbot.module.css";
export default function ProjectCarousel({
    projects,
    disabled,
    onAction,
}: {
    projects: Project[];
    disabled: boolean;
    onAction: (option: Option) => void;
}) {
    const track = useRef<HTMLDivElement>(null);
    const id = useId();
    const [index, setIndex] = useState(0);
    const multiple = projects.length > 1;
    useEffect(() => {
        const node = track.current;
        if (!node) return;
        const update = () => {
            const cards = Array.from(node.children).filter(
                (child) => child.tagName === "ARTICLE",
            ) as HTMLElement[];
            const nearest = cards.reduce(
                (best, card, i) =>
                    Math.abs(card.offsetLeft - node.scrollLeft) <
                    Math.abs(cards[best].offsetLeft - node.scrollLeft)
                        ? i
                        : best,
                0,
            );
            setIndex(nearest);
        };
        node.addEventListener("scroll", update, { passive: true });
        const observer = new ResizeObserver(update);
        observer.observe(node);
        update();
        return () => {
            node.removeEventListener("scroll", update);
            observer.disconnect();
        };
    }, [projects]);
    function move(next: number) {
        const node = track.current;
        const card = node?.children[next] as HTMLElement | undefined;
        if (!node || !card) return;
        node.scrollTo({
            left: card.offsetLeft,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
        });
    }
    return (
        <section
            className={styles.carousel}
            aria-label="Project gallery"
            aria-roledescription={multiple ? "carousel" : undefined}
        >
            <div
                ref={track}
                id={id}
                className={
                    multiple ? styles.carouselTrack : styles.singleProject
                }
            >
                {projects.map((p) => (
                    <article key={p.id} className={styles.project}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {p.image && (
                            <img
                                src={p.image}
                                alt=""
                                loading="lazy"
                                width="280"
                                height="150"
                            />
                        )}
                        <strong>{p.title}</strong>
                        <small>{p.category}</small>
                        <p>{p.description}</p>
                        {p.technologies.length > 0 && (
                            <small>{p.technologies.join(", ")}</small>
                        )}
                        {p.kind === "case-study" && !p.sections && (
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() =>
                                    onAction({
                                        label: `Details: ${p.title}`,
                                        action: "CASE_STUDY_DETAIL",
                                        value: p.id,
                                    })
                                }
                            >
                                View Case Study Details
                            </button>
                        )}
                        {p.sections?.map((section, index) => (
                            <details
                                key={`${section.title}-${index}`}
                                className={styles.caseDetails}
                            >
                                <summary>{section.title}</summary>
                                <p>{section.content}</p>
                            </details>
                        ))}
                        <Link href={p.url}>
                            {p.kind === "case-study"
                                ? "Read Full Case Study"
                                : "View Project"}
                        </Link>
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                                onAction({
                                    label: `Select ${p.title} as inspiration`,
                                    action: "SELECT_PROJECT",
                                    value: p.id,
                                })
                            }
                        >
                            Use as Inspiration
                        </button>
                    </article>
                ))}
            </div>
            {multiple && (
                <div className={styles.carouselControls}>
                    <button
                        type="button"
                        aria-label="Previous project"
                        aria-controls={id}
                        disabled={index === 0}
                        onClick={() => move(index - 1)}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path d="m14 6-6 6 6 6" />
                        </svg>
                    </button>
                    <span aria-live="polite" aria-atomic="true">
                        {index + 1} / {projects.length}
                    </span>
                    <button
                        type="button"
                        aria-label="Next project"
                        aria-controls={id}
                        disabled={index === projects.length - 1}
                        onClick={() => move(index + 1)}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path d="m10 6 6 6-6 6" />
                        </svg>
                    </button>
                </div>
            )}
        </section>
    );
}
