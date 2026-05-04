import { getEventByIdFn, getEventsFn } from "#/server/functions/event";
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
