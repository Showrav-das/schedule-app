"use client";
import TaskForm from "@/components/TaskForm";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewMonthAgenda,
  createViewMonthGrid,
} from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteTaskMutation,
  useTasksQuery,
} from "@/app/services/jsonServiceApi";
import { HoverCard, HoverCardContent } from "./ui/hover-card";
import { EditTaskModal } from "./EditTaskModal";
import { CreateTaskForm } from "./CreateTaskForm";
import { Button } from "./ui/button";

interface CalendarEventExternal {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
}

function CalendarApp({ setCalendarOpen, calendarOpen }: any) {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const [date, setDate] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [deleteTask] = useDeleteTaskMutation();
  const { data: tasks, isLoading, refetch } = useTasksQuery();

  const calendar = useNextCalendarApp({
    views: [createViewMonthGrid(), createViewMonthAgenda()],
    events: [],
    plugins: [
      eventsService,
      // createEventModalPlugin(),
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
      onEventClick: async (event) => {
        setSelectedEvent(event);
        // setEventModalOpen(true);
        setModal(true);
      },
    },
  });

  useEffect(() => {
    if (Array.isArray(tasks)) {
      // Ensure tasks is an array
      const calendarEvents: CalendarEventExternal[] = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        start: task.start,
        end: task.end,
      }));

      eventsService.set(calendarEvents);
    }

    // fetchEvents();
  }, [tasks, eventsService, refreshTrigger]);

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  // handle delete function
  const handleDelete = async (id: string) => {
    setModal(false);
    if (id) {
      try {
        const confirmDelete = window.confirm(`Are you want to delete task?`);
        if (confirmDelete) {
          await deleteTask({ id }).unwrap();
          eventsService.remove(selectedEvent.id);
          setRefreshTrigger((prev) => prev + 1);
          setEventModalOpen(false);
        }
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />

      {/* Create task modal */}
      {calendarOpen && date && (
        <CreateTaskForm
          date={date}
          isOpen={calendarOpen}
          selectedEvent={selectedEvent}
          onOpenChange={setCalendarOpen}
          setCalendarOpen={setCalendarOpen}
          onEventCreated={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}
      {/* edit and delete modal */}
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Title:
              <span className="font-normal ml-2">{selectedEvent?.title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center mt-4 gap-4">
            <Button
              onClick={() => {
                setEventModalOpen(true);
                setModal(false);
              }}
              className="px-4 py-2  cursor-pointer text-white rounded"
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(selectedEvent.id)}
              className="px-4 py-2 bg-red-500 hover:bg-red-500 text-white cursor-pointer rounded"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {selectedEvent && (
        <EditTaskModal
          isOpen={eventModalOpen}
          onOpenChange={setEventModalOpen}
          selectedEvent={selectedEvent}
        />
      )}
    </div>
  );
}

export default CalendarApp;
