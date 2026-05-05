import EventsCollection from "#/components/shared/events-collection";
import { Spinner } from "#/components/ui/spinner";
import { getEventsQueryOptions } from "#/lib/query/event";
import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/events/")({
  component: RouteComponent,
  pendingComponent: EventsLoading,
  errorComponent: EventsError,
  loader: async ({ context }) => {
    try {
      const events = await context.queryClient.fetchQuery(getEventsQueryOptions);

      return { events };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching events:", error.message);
      } else {
        console.error("Unknown error fetching events");
      }

      throw new Error("Failed to fetch events");
    }
  },
});

function EventsLoading() {
  return (
    <section className="container mx-auto">
      <div className="px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <Spinner />
          <p className="text-muted-foreground text-sm">Loading events...</p>
        </div>
      </div>
    </section>
  );
}

function EventsError() {
  return (
    <section className="container mx-auto">
      <div className="px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="font-heading text-2xl font-semibold">Unable to load events</h1>
          <p className="text-muted-foreground text-sm">
            Please check your connection and try again.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    </section>
  );
}

function RouteComponent() {
  const { events } = Route.useLoaderData();

  if (events.length === 0) {
    return (
      <section className="container mx-auto">
        <div className="px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-heading scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
              No events found.
            </h1>

            <div>
              <Button variant={"outline"} size={"lg"} asChild>
                <Link to="/events/create">Create Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto">
      <div className="px-4 py-6 pb-20">
        <h1 className="font-heading scroll-m-20 pb-10 text-center text-4xl font-extrabold tracking-tight text-balance">
          Events
        </h1>

        <EventsCollection events={events} />
      </div>
    </section>
  );
}
