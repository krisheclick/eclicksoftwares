"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { useSearchParams } from "next/navigation";
import "react-day-picker/dist/style.css";
import styles from "./CalendlyLikePicker.module.css";

const slots = [
  "2:30pm","3:00pm","3:30pm","4:00pm",
  "4:30pm","5:00pm","5:30pm","6:00pm","6:30pm"
];

export default function CalendlyLikePicker() {
  const searchParams = useSearchParams();

  const monthParam = searchParams.get("month"); // 2026-01
  const dateParam = searchParams.get("date");   // 20

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [displayMonth, setDisplayMonth] = useState<Date | undefined>();
  const [time, setTime] = useState<string | null>(null);

  // 👉 Handle URL params like Calendly
  useEffect(() => {
    if (monthParam) {
      const parsedMonth = parseISO(`${monthParam}-01`);
      setDisplayMonth(parsedMonth);

      if (dateParam) {
        const parsedDate = parseISO(
          `${monthParam}-${dateParam.padStart(2, "0")}`
        );
        setSelectedDate(parsedDate);
      }
    }
  }, [monthParam, dateParam]);

  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.left}>
        <h2>Select a Date & Time</h2>

        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setTime(null);
          }}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          fromDate={new Date()}
          showOutsideDays
          className={styles.calendar}
        />

        <div className={styles.timezone}>
          🌍 India, Sri Lanka Time ({format(new Date(), "p")})
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <h3>
          {selectedDate
            ? format(selectedDate, "EEEE, MMMM d")
            : "Select a date"}
        </h3>

        <div className={styles.slotList}>
          {slots.map((slot) => (
            <button
              key={slot}
              className={`${styles.slot} ${
                time === slot ? styles.active : ""
              }`}
              onClick={() => setTime(slot)}
              disabled={!selectedDate}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
