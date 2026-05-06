import ErrorComponent from "#/components/shared/error-component";
import EventsCollection from "#/components/shared/events-collection";
import OrdersTable from "#/components/shared/orders-table";
import PendingComponent from "#/components/shared/pending-component";
import { getEventsByUserClerkIdQueryOptions } from "#/lib/query/event.query";
import { getUserOrdersQueryOptions } from "#/lib/query/order.query";
import { getUserByClerkIdQueryOptions } from "#/lib/query/user.query";
import { Image } from "@imagekit/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
  pendingComponent: () => <PendingComponent resourceName="user info" />,
  errorComponent: () => (
    <ErrorComponent resourceName="user info" fallbackRouteName="home" fallbackUrl="/" />
  ),
  loader: async ({ context }) => {
    const { userId } = context;

    if (!userId) {
      throw new Error("User ID is required to load profile data.");
    }

    const user = await context.queryClient.fetchQuery({
      ...getUserByClerkIdQueryOptions(userId),
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const orders = await context.queryClient.fetchQuery({
      ...getUserOrdersQueryOptions(user._id.toString()),
    });

    const events = await context.queryClient.fetchQuery({
      ...getEventsByUserClerkIdQueryOptions(userId),
    });

    return { user, orders, events };
  },
});

function RouteComponent() {
  const { user, orders, events } = Route.useLoaderData();

  return (
    <section className="container mx-auto">
      <div className="px-4 py-6">
        <h1 className="font-heading mb-2 scroll-m-20 text-4xl font-extrabold tracking-tight text-balance lg:text-center">
          My Profile
        </h1>

        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-heading scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
              General Information
            </h2>

            <div className="flex flex-col gap-4">
              {user.avatarUrl && (
                <div className="aspect-square w-32 overflow-hidden rounded-2xl">
                  <Image
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="size-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-muted-foreground text-sm">{user.username}</p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="font-heading scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
              My Orders
            </h2>

            {orders.length === 0 ? (
              <p className="text-muted-foreground">You have not made any orders yet.</p>
            ) : (
              <div className="pt-6">
                <OrdersTable orders={orders} />
              </div>
            )}
          </div>

          <div>
            <h2 className="font-heading scroll-m-20 pb-6 text-3xl font-semibold tracking-tight">
              My Created Events
            </h2>

            <EventsCollection events={events} />
          </div>
        </div>
      </div>
    </section>
  );
}
