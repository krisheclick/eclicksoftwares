"use client";

import { useEffect, useRef, useState } from "react";
import {
    formatTimezoneLabel,
    getGMTOffset,
    getCurrentTime
} from "@/utils/timezoneUtils";
import styles from "./TimezoneDropdown.module.css";

interface Props {
    value: string;
    onChange: (tz: string) => void;
}

export default function TimezoneDropdown({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [zones, setZones] = useState<string[]>([]);
    const [now, setNow] = useState(new Date());
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sync = () => setNow(new Date());

        sync();

        const delay =
            (60 - new Date().getSeconds()) * 1000 -
            new Date().getMilliseconds();

        const timeout = setTimeout(() => {
            sync();
            const interval = setInterval(sync, 60000);
            return () => clearInterval(interval);
        }, delay);

        const handleClickOutside = (event: MouseEvent) => {
        if (
            wrapperRef.current &&
            !wrapperRef.current.contains(event.target as Node)
            ) {
            setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        setZones(Intl.supportedValuesOf("timeZone"));
    }, []);

    const filtered = zones.filter((z) =>
        z.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <button
                className={styles.trigger}
                type="button"
                onClick={() => setOpen(!open)}
            >🌍 {formatTimezoneLabel(value)} <strong>{getCurrentTime(value, now)}</strong>
            </button>

            {open && (
                <div className={styles.dropdown}>
                    <input
                        className={styles.search}
                        placeholder="Search time zone"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className={styles.list}>
                        {filtered.map((zone) => (
                            <div
                                key={zone}
                                className={`${styles.item} ${zone === value ? styles.active : ""
                                    }`}
                                onClick={() => {
                                    onChange(zone);
                                    setOpen(false);
                                }}
                            >
                                {formatTimezoneLabel(zone)}
                                <strong>{getCurrentTime(zone, now)}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
