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

interface taskProps {
  date: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setCalendarOpen: (calendarOpen: boolean) => void;
  onEventCreated: () => void;
  onEventUpdate?: (updatedTask: any) => void;
  selectedEvent?: any;
}

export function CreateTaskForm({
  date,
  setCalendarOpen,
  isOpen,
  onOpenChange,
  onEventCreated,
  onEventUpdate,
  selectedEvent,
}: taskProps) {
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      start: date,
      end: date,
    },
  });

  async function onSubmit(tasks: any) {
    // If we're creating a new event, add it
    await addTask(tasks);
    onEventCreated(); // Trigger the callback to re-fetch or refresh events

    setCalendarOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Create Task</DialogTitle>
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
                      value={date}
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
