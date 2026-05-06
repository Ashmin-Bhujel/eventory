import Header from "#/components/shared/header";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
}
