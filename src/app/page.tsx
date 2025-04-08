"use client";
import TaskForm from "@/components/TaskForm";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useTasksQuery } from "./services/jsonServiceApi";
import CalendarApp from "@/components/Calendar";

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = React.useState<boolean>(false);
  const { data, error, isLoading } = useTasksQuery();

  const handleClick = (e: any) => {
    setCalendarOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto my-12 font-[family-name:var(--font-geist-sans)]">
      <h1 className="font-bold text-2xl mb-4 text-center">
        Calender Application
      </h1>
      {/* {data?.map((item:any)=><p key={item.id}>{item.title}</p>)} */}
      {/* <Calendar
        mode="single"
        selected={date}
        numberOfMonths={2}
        onSelect={setDate}
        onDayClick={handleClick}
      /> */}

      {/* {calendarOpen && (
        <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle className="text-center mb-4">
                Create Task
              </DialogTitle>
            </DialogHeader>
            <TaskForm date={date} setCalendarOpen={setCalendarOpen} />
          </DialogContent>
        </Dialog>
      )} */}

      <CalendarApp
        date={date}
        setCalendarOpen={setCalendarOpen}
        calendarOpen={calendarOpen}
      />
    </div>
  );
}
