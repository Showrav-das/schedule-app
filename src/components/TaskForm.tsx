"use client";
import {
  useAddTaskMutation,
  useUpdateTaskMutation,
} from "@/app/services/jsonServiceApi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

interface taskProps {
  date: string;
  setCalendarOpen: (calendarOpen: boolean) => void;
  onEventCreated: () => void;
  onEventUpdate?: (updatedTask: any) => void;
  selectedEvent?: any;
}

export default function TaskForm({
  date,
  setCalendarOpen,
  onEventCreated,
  onEventUpdate,
  selectedEvent,
}: taskProps) {
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const form = useForm({
    defaultValues: {
      title: selectedEvent?.title || "",
      description: selectedEvent?.description || "",
      start: date,
      end: date,
    },
  });

  async function onSubmit(tasks: any) {
    if (selectedEvent) {
      // If we're editing an event, update the event
      await updateTask({
        ...tasks,
        id: selectedEvent.id, // Include the event ID to update the correct event
      });
      console.log("tasj", tasks);
      // Notify that the event has been updated
      if (onEventUpdate) {
        onEventUpdate({
          ...selectedEvent,
          ...tasks, // Update with form data
        });
      }
    } else {
      // If we're creating a new event, add it
      await addTask(tasks);
      onEventCreated(); // Trigger the callback to re-fetch or refresh events
    }

    setCalendarOpen(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="type a title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="type description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} disabled value={date} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="cursor-pointer" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
