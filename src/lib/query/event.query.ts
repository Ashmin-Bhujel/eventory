import {
  getEventByIdFn,
  getEventsByCategoryFn,
  getEventsByUserClerkIdFn,
  getEventsFn,
} from "#/server/functions/event.function";
import { queryOptions } from "@tanstack/react-query";

export const getEventByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["get", "event", id],
    queryFn: () => getEventByIdFn({ data: { id } }),
  });

export const getEventsQueryOptions = queryOptions({
  queryKey: ["get", "events"],
  queryFn: getEventsFn,
});

export const getEventsByUserClerkIdQueryOptions = (clerkId: string) =>
  queryOptions({
    queryKey: ["get", "events", "user", clerkId],
    queryFn: () => getEventsByUserClerkIdFn({ data: { clerkId } }),
  });

export const getEventsByCategoryQueryOptions = (category: string) =>
  queryOptions({
    queryKey: ["get", "events", "category", category],
    queryFn: () => getEventsByCategoryFn({ data: { category } }),
  });
