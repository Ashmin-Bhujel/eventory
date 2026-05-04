import Footer from "#/components/shared/footer";
import Header from "#/components/shared/header.tsx";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
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
