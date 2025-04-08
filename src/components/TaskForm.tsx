"use client";
import { useAddTaskMutation } from "@/app/services/jsonServiceApi";
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
import { boolean } from "zod";

interface taskProps {
  date: string;
  setCalendarOpen: (calendarOpen: boolean) => void;
  onEventCreated: () => void;
}

export default function TaskForm({
  date,
  setCalendarOpen,
  onEventCreated,
}: taskProps) {
  const [addTask] = useAddTaskMutation();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      start: date,
      end: date,
    },
  });

  async function onSubmit(tasks: {}) {
    await addTask(tasks);
    // Do something with the form tasks.
    // ✅ This will be type-safe and validated.
    console.log("tasks", tasks);
    setCalendarOpen(false);
    onEventCreated();

    //    const res= fetch('http://localhost:8000/tasks', {
    //         method: 'POST',
    //         body: JSON.stringify(tasks),
    //         headers: {
    //             'Content-Type': 'application/json',
    //          }
    //     })
    //     console.log(res,"res")

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
