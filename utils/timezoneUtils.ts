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