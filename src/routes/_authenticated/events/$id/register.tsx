import type { InitiatePaymentData } from "#/lib/validation/payment";

import { Button } from "#/components/ui/button";
import { Spinner } from "#/components/ui/spinner";
import { initiatePaymentMutationOptions } from "#/lib/mutations/payment";
import { getEventByIdQueryOptions } from "#/lib/query/event";
import { useUser } from "@clerk/tanstack-react-start";
import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/events/$id/register")({
  component: RouteComponent,
  pendingComponent: EventLoading,
  errorComponent: EventError,
  loader: async ({ params, context }) => {
    try {
      const { id } = params;

      const event = await context.queryClient.fetchQuery({ ...getEventByIdQueryOptions(id) });

      return { event };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching event", error.message);
      } else {
        console.error("Unknown error fetching event");
      }

      throw new Error("Failed to fetch event");
    }
  },
});

function EventLoading() {
  return (
    <section className="container mx-auto">
      <div className="px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <Spinner />
          <p className="text-muted-foreground text-sm">Loading event...</p>
        </div>
      </div>
    </section>
  );
}

function EventError() {
  return (
    <section className="container mx-auto">
      <div className="px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="font-heading text-2xl font-semibold">Unable to load event</h1>
          <p className="text-muted-foreground text-sm">
            Please try again or go back to the events list.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => window.location.reload()}>Retry</Button>
            <Button variant="outline" asChild>
              <Link to="/events">Back to events</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RouteComponent() {
  const { event } = Route.useLoaderData();

  const { user: buyer } = useUser();

  const { mutate, isPending } = useMutation(initiatePaymentMutationOptions);

  if (!buyer) {
    return (
      <section className="container mx-auto">
        <div className="px-4 py-6">
          <h1 className="font-heading scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            You must be logged in to register for this event
          </h1>
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="container mx-auto">
        <div className="px-4 py-6">
          <h1 className="font-heading scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            No event found
          </h1>
        </div>
      </section>
    );
  }

  const { userId } = buyer.publicMetadata;

  const initiatePaymentData: InitiatePaymentData = {
    amount: event.price,
    purchase_order_name: `Registration for ${event.title}`,
    event: event._id,
    buyer: userId as string,
    customer_info: {
      email: buyer.emailAddresses[0].emailAddress,
      name: `${buyer.firstName} ${buyer.lastName}`,
      phone: buyer.phoneNumbers[0]?.phoneNumber || "",
    },
    product_details: [
      {
        identity: event._id,
        name: event.title,
        quantity: 1,
        total_price: event.price,
        unit_price: event.price,
      },
    ],
    merchant_username: `${event.organizer.firstName} ${event.organizer.lastName}`,
    merchant_extra: "Thank you for buying tickets",
  };

  return (
    <section className="container mx-auto">
      <div className="px-4 py-6">
        <h1 className="font-heading scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Register for {event.title}
        </h1>

        <div className="flex items-center justify-center pt-6">
          <Button size={"lg"} onClick={() => mutate(initiatePaymentData)} disabled={isPending}>
            {isPending ? <Spinner /> : "Register"}
          </Button>
        </div>
      </div>
    </section>
  );
}
