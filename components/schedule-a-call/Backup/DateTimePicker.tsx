"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./DateTimePicker.module.css";

const timeSlots = [
  "2:30pm", "3:00pm", "3:30pm", "4:00pm",
  "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm"
];

export default function DateTimePicker() {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className={styles.wrapper}>
      {/* LEFT – CALENDAR */}
      <div className={styles.calendar}>
        <h3>Select a Date & Time</h3>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          fromDate={new Date()}
          showOutsideDays
        />
      </div>

      {/* RIGHT – TIME SLOTS */}
      <div className={styles.slots}>
        <h4>
          {date
            ? date.toDateString()
            : "Select a date"}
        </h4>

        {timeSlots.map((slot) => (
          <button
            key={slot}
            className={`${styles.slot} ${time === slot ? styles.active : ""}`}
            onClick={() => setTime(slot)}
            disabled={!date}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}
