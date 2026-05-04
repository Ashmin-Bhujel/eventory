import { getEventByIdFn, getEventsFn } from "#/server/functions/event";
import { queryOptions } from "@tanstack/react-query";

export const getEventByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["get", "event", id],
    queryFn: () => getEventByIdFn({ data: { id } }),
    staleTime: 60_000,
    retry: 1,
    retryDelay: 1_000,
  });

export const getEventsQueryOptions = queryOptions({
  queryKey: ["get", "events"],
  queryFn: getEventsFn,
  staleTime: 60_000,
  retry: 1,
  retryDelay: 1_000,
});
