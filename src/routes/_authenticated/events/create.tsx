import EventForm from "#/components/events/event-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/events/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useRouteContext();

  return (
    <section className="container mx-auto">
      <div className="px-4 py-6">
        <h1 className="font-heading scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Create Event
        </h1>

        <div>
          <EventForm clerkUserId={userId} type="create" />
        </div>
      </div>
    </section>
  );
}
