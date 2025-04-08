"use client";
import TaskForm from "@/components/TaskForm";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewMonthAgenda,
  createViewMonthGrid,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function CalendarApp({ setCalendarOpen, calendarOpen }: any) {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const calendar = useNextCalendarApp({
    views: [createViewMonthGrid(), createViewMonthAgenda()],
    events: [],
    plugins: [
      eventsService,
      createEventModalPlugin(),
      createDragAndDropPlugin(),
    ],
    callbacks: {
      onRender: () => {
        console.log("Calendar rendered");
      },
      onClickDate: (clickedDate: string) => {
        console.log("Clicked date:", clickedDate);
        setDate(clickedDate);
        setCalendarOpen(true);
      },
    },
  });

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/tasks");
      const data = await response.json();
      eventsService.set(data);
      console.log("Events loaded:", data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [eventsService, refreshTrigger]); // Add refreshTrigger to dependencies

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />

      {calendarOpen && date && (
        <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle className="text-center mb-4">
                Create Task
              </DialogTitle>
            </DialogHeader>
            <TaskForm
              date={date}
              setCalendarOpen={setCalendarOpen}
              onEventCreated={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default CalendarApp;
