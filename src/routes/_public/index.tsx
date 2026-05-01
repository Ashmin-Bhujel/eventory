import Hero from "#/components/home/hero.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <Hero />
    </main>
  );
}
