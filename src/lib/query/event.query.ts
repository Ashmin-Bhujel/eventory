import { getEventByIdFn, getEventsFn } from "#/server/functions/event.function";
import { queryOptions } from "@tanstack/react-query";

export const getEventByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["get", "event", id],
    queryFn: () => getEventByIdFn({ data: { id } }),
    staleTime: 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });

export const getEventsQueryOptions = queryOptions({
  queryKey: ["get", "events"],
  queryFn: getEventsFn,
  staleTime: 60 * 1000,
  retry: 1,
  retryDelay: 1000,
});
