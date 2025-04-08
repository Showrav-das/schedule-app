import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
}

export const jsonServerApi = createApi({
  tagTypes: ["Tasks"],
  reducerPath: "jsonServerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/" }),
  endpoints: (builder) => ({
    tasks: builder.query<Task, void>({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),

    addTask: builder.mutation({
      query: (tasks) => ({
        url: "/tasks",
        method: "POST",
        body: tasks,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: (updatedTask) => ({
        url: `/task/${updatedTask.id}`,
        method: "PUT",
        body: updatedTask,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (tasks) => ({
        url: `/tasks/${tasks.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = jsonServerApi;
