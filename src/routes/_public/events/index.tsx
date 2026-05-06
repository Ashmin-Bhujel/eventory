import ErrorComponent from "#/components/shared/error-component";
import EventsCollection from "#/components/shared/events-collection";
import PendingComponent from "#/components/shared/pending-component";
import { getEventsQueryOptions } from "#/lib/query/event.query";
import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/events/")({
  component: RouteComponent,
  pendingComponent: () => <PendingComponent resourceName="events" />,
  errorComponent: () => (
    <ErrorComponent resourceName="events" fallbackRouteName="home" fallbackUrl="/" />
  ),
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
