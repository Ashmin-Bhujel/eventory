import EventForm from "#/components/events/event-form";
import ErrorComponent from "#/components/shared/error-component";
import PendingComponent from "#/components/shared/pending-component";
import { getEventByIdQueryOptions } from "#/lib/query/event.query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/events/$id/update")({
  component: RouteComponent,
  pendingComponent: () => <PendingComponent resourceName="event" />,
  errorComponent: () => (
    <ErrorComponent resourceName="event" fallbackRouteName="events" fallbackUrl="/events" />
  ),
  loader: async ({ params, context }) => {
    try {
      const { id } = params;

      const event = await context.queryClient.fetchQuery({ ...getEventByIdQueryOptions(id) });

      return { event };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching event:", error.message);
      } else {
        console.error("Unknown error fetching event");
      }

      throw new Error("Failed to fetch event");
    }
  },
});

function RouteComponent() {
  const { event } = Route.useLoaderData();
  const { userId } = Route.useRouteContext();

  if (!event) {
    return (
      <section className="container mx-auto">
        <div className="px-4 py-6">
          <h1 className="font-heading scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Event not found
          </h1>
        </div>
      </section>
    );
  }

  if (event.organizer.clerkId !== userId) {
    return (
      <section className="container mx-auto">
        <div className="px-4 py-6">
          <h1 className="font-heading scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            You are not the organizer of this event
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto">
      <div className="px-4 py-6">
        <h1 className="font-heading scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Update Event
        </h1>

        <div>
          <EventForm clerkUserId={userId} type="update" eventData={event} />
        </div>
      </div>
    </section>
  );
}
