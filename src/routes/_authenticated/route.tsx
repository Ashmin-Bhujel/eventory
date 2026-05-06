import Header from "#/components/shared/header";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    const { isAuthenticated } = context;

    if (!isAuthenticated) {
      throw redirect({ to: "/login/$", search: { redirect: location.href } });
    }
  },
});

function RouteComponent() {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
}
