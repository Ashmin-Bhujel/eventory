import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <header>
        <div className="container mx-auto px-4 py-6">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Eventory
          </h1>
        </div>
      </header>
    </main>
  );
}
