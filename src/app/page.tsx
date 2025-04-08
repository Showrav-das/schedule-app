"use client";
import CalendarApp from "@/components/Calendar";
import React from "react";

export default function Page() {
  const [calendarOpen, setCalendarOpen] = React.useState<boolean>(false);

  return (
    <div className="max-w-5xl mx-auto my-12 font-[family-name:var(--font-geist-sans)]">
      <h1 className="font-bold text-2xl mb-4 text-center">
        Calender Application
      </h1>

      <CalendarApp
        setCalendarOpen={setCalendarOpen}
        calendarOpen={calendarOpen}
      />
    </div>
  );
}
