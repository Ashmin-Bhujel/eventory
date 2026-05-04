import { Button } from "#/components/ui/button";
import { getEventsQueryOptions } from "#/lib/query/event";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/events/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const events = await context.queryClient.fetchQuery(getEventsQueryOptions);

    return { events };
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
      <div className="px-4 py-6">
        <div className="flex flex-col gap-6">
          {events.map((event) => (
            <Button key={event._id} variant={"outline"} size={"lg"} asChild>
              <Link to="/events/$id" params={{ id: event._id }}>
                {event.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
