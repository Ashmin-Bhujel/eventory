import type { EventFormInput } from "../validation/event";

import { createEventFn, deleteEventFn, updateEventFn } from "#/server/functions/event";
import { mutationOptions } from "@tanstack/react-query";

export const createEventMutationOptions = mutationOptions({
  mutationKey: ["create", "event"],
  mutationFn: (data: EventFormInput) => createEventFn({ data }),
});

export const updateEventMutationOptions = (id: string) =>
  mutationOptions({
    mutationKey: ["update", "event", id],
    mutationFn: (formData: EventFormInput) => updateEventFn({ data: { eventId: id, formData } }),
  });

export const deleteEventMutationOptions = (id: string) =>
  mutationOptions({
    mutationKey: ["delete", "event", id],
    mutationFn: () => deleteEventFn({ data: { id } }),
  });
