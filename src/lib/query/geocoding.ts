import { getCoordinatesFn } from "#/server/functions/geocoding";
import { queryOptions } from "@tanstack/react-query";

export const getCoordinatesQueryOptions = (location: string) =>
  queryOptions({
    queryKey: ["get", "coordinates", location],
    queryFn: () => getCoordinatesFn({ data: { location } }),
    staleTime: 10 * 60_000,
    retry: 1,
    retryDelay: 1_000,
  });
