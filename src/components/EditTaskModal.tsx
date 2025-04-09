"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { set } from "date-fns";

interface EditTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: any; // Replace 'any' with your event type if available
}

export function EditTaskModal({
  isOpen,
  onOpenChange,
  selectedEvent,
}: EditTaskModalProps) {
  const [updateTask] = useUpdateTaskMutation();
  const form = useForm({
    defaultValues: {
      title: selectedEvent.title,
      description: selectedEvent.description,
      start: selectedEvent.date,
      end: selectedEvent.date,
    },
  });
  console.log(selectedEvent, "selectedEvent");
  async function onSubmit(tasks: {}) {
    const allTasks = {
      ...tasks,
      id: selectedEvent.id,
      start: selectedEvent.start,
      end: selectedEvent.end,
    };
    await updateTask(allTasks).unwrap();
    onOpenChange(false);
    console.log("tasks", tasks);

    // form.reset();
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Edit Task</DialogTitle>
        </DialogHeader>
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
                    <Input
                      placeholder="shadcn"
                      {...field}
                      disabled
                      value={selectedEvent.start}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="cursor-pointer" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
