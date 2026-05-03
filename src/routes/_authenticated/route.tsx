import Footer from "#/components/shared/footer";
import Header from "#/components/shared/header.tsx";
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
      <Footer />
    </main>
  );
}
