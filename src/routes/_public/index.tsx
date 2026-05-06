import Hero from "#/components/home/hero";
import ErrorComponent from "#/components/shared/error-component";
import EventsCollection from "#/components/shared/events-collection";
import PendingComponent from "#/components/shared/pending-component";
import { Button } from "#/components/ui/button";
import { getEventsQueryOptions } from "#/lib/query/event.query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: RouteComponent,
  pendingComponent: () => <PendingComponent resourceName="events" />,
  errorComponent: () => <ErrorComponent resourceName="events" />,
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

function RouteComponent() {
  const { events } = Route.useLoaderData();

  if (events.length === 0) {
    return (
      <section className="container mx-auto">
        <div className="px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <h2 className="font-heading scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
              No events found.
            </h2>

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
    <main>
      <Hero />

      <section className="container mx-auto">
        <div className="px-4 py-6 pb-20">
          <h2 className="font-heading scroll-m-20 pb-10 text-center text-4xl font-extrabold tracking-tight text-balance">
            Recent Events
          </h2>

          <EventsCollection events={events} />
        </div>
      </section>
    </main>
  );
}
