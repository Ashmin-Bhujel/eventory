import type {
  DeleteEventInput,
  Event,
  EventFormInput,
  EventResponse,
  GetEventsByIdInput,
  UpdateEventInput,
} from "#/lib/zod/event.schema";

import {
  deleteEventSchema,
  eventFormSchema,
  getEventsByIdSchema,
  updateEventSchema,
} from "#/lib/zod/event.schema";
import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import {
  createEventService,
  deleteEventService,
  getEventByIdService,
  getEventsService,
  updateEventService,
} from "../services/event.service";

export const createEventFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: EventFormInput) => eventFormSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        console.error("Unauthorized");

        return null;
      }

      const createdEvent = await createEventService(data);

      return JSON.parse(JSON.stringify(createdEvent)) as Event;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to create event: ${error.message}`);
      } else {
        console.error("An unknown error occurred while creating the event");
      }

      return null;
    }
  });

export const getEventByIdFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: GetEventsByIdInput) => getEventsByIdSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const event = await getEventByIdService(data.id);

      if (!event) {
        console.error(`Event with ID ${data.id} not found`);

        return null;
      }

      return JSON.parse(JSON.stringify(event)) as EventResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching event with ID ${data.id}: ${error.message}`);
      } else {
        console.error(`Unknown error fetching event with ID ${data.id}`);
      }

      return null;
    }
  });

export const getEventsFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const events = await getEventsService();

    return JSON.parse(JSON.stringify(events)) as EventResponse[];
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching events: ${error.message}`);
    } else {
      console.error("Unknown error fetching events");
    }

    return [];
  }
});

export const updateEventFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: UpdateEventInput) => updateEventSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        console.error("Unauthorized");

        return null;
      }

      const updatedEvent = await updateEventService(data.eventId, data.formData);

      if (!updatedEvent) {
        console.error("Event not found or not authorized");

        return null;
      }

      return JSON.parse(JSON.stringify(updatedEvent)) as Event;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to update event: ${error.message}`);
      } else {
        console.error("An unknown error occurred while updating the event");
      }

      return null;
    }
  });

export const deleteEventFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: DeleteEventInput) => deleteEventSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        console.error("Unauthorized");

        return null;
      }

      const deletedEvent = await deleteEventService(data.id, userId);

      if (!deletedEvent) {
        console.error("Event not found or not authorized");

        return null;
      }

      return JSON.parse(JSON.stringify(deletedEvent)) as Event;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to delete event: ${error.message}`);
      } else {
        console.error("An unknown error occurred while deleting the event");
      }

      return null;
    }
  });
