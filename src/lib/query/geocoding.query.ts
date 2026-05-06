import { getCoordinatesFn } from "#/server/functions/geocoding.function";
import { queryOptions } from "@tanstack/react-query";

export const getCoordinatesQueryOptions = (location: string) =>
  queryOptions({
    queryKey: ["get", "coordinates", location],
    queryFn: async () => (await getCoordinatesFn({ data: { location } })) || null,
    staleTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
