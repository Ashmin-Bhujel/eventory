import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const loginSearchParamsSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth/signup/$")({
  component: RouteComponent,
  validateSearch: (search) => loginSearchParamsSchema.parse(search),
});

function RouteComponent() {
  const { redirect } = Route.useSearch();

  return (
    <section>
      <SignUp
        fallbackRedirectUrl={redirect ?? "/"}
        signInUrl="/login"
        signInFallbackRedirectUrl={redirect ?? "/"}
      />
    </section>
  );
}
