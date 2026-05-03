import type { CreateEventInput } from "../validation/event";

import { createEventFn } from "#/server/functions/event";
import { mutationOptions } from "@tanstack/react-query";

export const createEventMutationOptions = mutationOptions({
  mutationKey: ["create", "event"],
  mutationFn: (data: CreateEventInput) => createEventFn({ data }),
});
