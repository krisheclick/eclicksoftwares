"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import styles from "./CalendlyLikePicker.module.css";

const slots = [
  "2:30pm","3:00pm","3:30pm","4:00pm",
  "4:30pm","5:00pm","5:30pm","6:00pm","6:30pm"
];

export default function CalendlyLikePicker() {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.left}>
        <h2>Select a Date & Time</h2>

        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          fromDate={new Date()}
          showOutsideDays
          className={styles.calendar}
        />

        <div className={styles.timezone}>
          🌍 India, Sri Lanka Time (
          {format(new Date(), "p")})
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <h3>
          {date
            ? format(date, "EEEE, MMMM d")
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
              disabled={!date}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
