import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/events/$id/update")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/events/$event-id/update"!</div>;
}
