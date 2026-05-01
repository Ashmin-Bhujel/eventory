import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context;

    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <Outlet />
    </main>
  );
}
