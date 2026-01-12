/**
 * Returns offset like: +5:30 GMT
 * Calculated relative to UTC (Calendly-style)
 */
export function getGMTOffset(timeZone: string) {
    const now = new Date();

    const utcDate = new Date(
        now.toLocaleString("en-US", { timeZone: "UTC" })
    );

    const tzDate = new Date(
        now.toLocaleString("en-US", { timeZone })
    );

    const diffMinutes =
        (tzDate.getTime() - utcDate.getTime()) / 60000;

    const sign = diffMinutes >= 0 ? "+" : "-";
    const abs = Math.abs(diffMinutes);
    const hours = Math.floor(abs / 60)
        .toString()
        .padStart(2, "0");
    const minutes = (abs % 60).toString().padStart(2, "0");

    return `UTC ${sign}${hours}:${minutes}`;
}

export function getCurrentTime(
    timeZone: string,
    baseDate: Date = new Date()
) {
    return new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(baseDate);
}

export function formatTimezoneLabel(timeZone: string) {
    return `${timeZone} (${getGMTOffset(timeZone)})`;
}

export function formatDate(date: Date | string) {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
}

export function formatTime24(time: string) {
    const match = time.match(/(\d+):(\d+)(am|pm)/i);
    if (!match) return "";

    const [, h, m, period] = match;

    let hours = parseInt(h, 10);
    const minutes = m;

    if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (period.toLowerCase() === "am" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
}