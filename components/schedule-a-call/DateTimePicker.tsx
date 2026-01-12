"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import "react-day-picker/dist/style.css";
import styles from "./DateTimePicker.module.css";
import { useScheduleCallContext } from "@/context/SchuduleACallContext";
import TimezoneDropdown from "./TimezoneDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight} from "@fortawesome/free-solid-svg-icons";

const detectedTZ =
    Intl.DateTimeFormat().resolvedOptions().timeZone;


function generateTimeSlots(
    startHour = 9,
    endHour = 18,
    interval = 30
): string[] {
    const slots: string[] = [];

    const start = startHour * 60;
    const end = endHour * 60;

    for (let mins = start; mins <= end; mins += interval) {
        const hours24 = Math.floor(mins / 60);
        const minutes = mins % 60;

        const period = hours24 >= 12 ? "pm" : "am";
        const hours12 = hours24 % 12 || 12;

        slots.push(
            `${hours12}:${minutes.toString().padStart(2, "0")}${period}`
        );
    }

    return slots;
}
/**
 * Mock availability (replace with API)
 */
const availability = generateTimeSlots();

export default function DateTimePicker() {
    console.log("Render timezone", detectedTZ);
    const router = useRouter();
    const searchParams = useSearchParams();

    const monthParam = searchParams.get("month");
    const dateParam = searchParams.get("date");

    const [month, setMonth] = useState<Date | null>(null);
    const [slots, setSlots] = useState<string[]>([]);
    const {
        visibleTimeField,
        setVisibleTimeField,
        fromLoading,
        setFromLoading,
        step,
        setStep,        
        selectedDate,
        setSelectedDate,
        selectedSlot,
        setSelectedSlot,
        timezone, 
        setTimezone
    } = useScheduleCallContext();


    

    /* Handle URL params like Calendly */
    useEffect(() => {
        if (monthParam) {
            const m = parseISO(`${monthParam}-01`);
            setMonth(m);

            if (dateParam) {
                const d = parseISO(`${monthParam}-${dateParam.padStart(2, "0")}`);
                setVisibleTimeField(true);
                setSelectedDate(d);
                loadSlots(d);
            }
        }
    }, [monthParam, dateParam]);

    const loadSlots = (date: Date) => {
        const key = format(date, "yyyy-MM-dd");
        setSlots(availability);
        setSelectedSlot(null);
    };

    const onDateSelect = (date?: Date) => {
        if (!date) return;

        setSelectedDate(date);
        setVisibleTimeField(true);
        loadSlots(date);

        // router.replace(
        //     `?month=${format(date, "yyyy-MM")}&date=${format(date, "dd")}`
        // );
    };

    const today = startOfDay(new Date());

    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday = 0, Saturday = 6
    };

    const disabledDays = (date: Date) => {
        // const key = format(date, "yyyy-MM-dd");
        // return (
        //     isBefore(date, startOfDay(new Date())) ||
        //     !availability[key]
        // );
        return isBefore(date, today) || isWeekend(date);
    };

    return (
        <>
            <label className="form-label text-bold">Select a Date & Time</label>
            <div className={`${visibleTimeField ? `${styles.container}` : ""}`}>
                <div>
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        fromDate={new Date()}
                        onSelect={onDateSelect}
                        captionLayout="label"
                        navLayout="around"
                        onMonthChange={setMonth}
                        disabled={disabledDays}
                        showOutsideDays
                        className={`${styles.calendar}`}
                    />


                    <div className={styles.timezone}>
                        <TimezoneDropdown
                            value={timezone}
                            onChange={setTimezone}
                        />
                    </div>
                </div>

                {/* RIGHT */}
                <div className={`${!visibleTimeField ? 'd-none' : ""}`}>
                    <label className="form-label text-bold mb-2">
                        {selectedDate
                            ? format(selectedDate, "EEEE, MMMM d")
                            : "Select a date"}
                    </label>

                    {generateTimeSlots().length === 0 && selectedDate && (
                        <p className={styles.noSlots}>No times available</p>
                    )}

                    <div className={`${styles.slotList}`}>
                        {generateTimeSlots().map((slot) =>
                            selectedSlot === slot ? (
                                <div key={slot} className="d-flex gap-2">
                                    <button
                                        className={`${styles.slot} ${styles.active} w-50`}
                                    >
                                        {slot}
                                    </button>
                                    <button className={`eclick-btn-connect ${styles.bannerBtn ?? ''}`} onClick={() => setStep(step + 1)}>
                                        <span className={styles.phoneIcon}>
                                            <FontAwesomeIcon icon={faArrowRight }/>
                                        </span>
                                        <em>Next</em>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    key={slot}
                                    className={styles.slot}
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    {slot}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
