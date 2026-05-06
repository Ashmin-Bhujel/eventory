import ErrorComponent from "#/components/shared/error-component";
import EventsCollection from "#/components/shared/events-collection";
import LocationMap from "#/components/shared/location-map";
import PendingComponent from "#/components/shared/pending-component";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Spinner } from "#/components/ui/spinner";
import { deleteEventMutationOptions } from "#/lib/mutations/event.mutation";
import { getEventByIdQueryOptions, getEventsByCategoryQueryOptions } from "#/lib/query/event.query";
import { getCoordinatesQueryOptions } from "#/lib/query/geocoding.query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Image } from "@imagekit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, LinkIcon, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/events/$id")({
  component: RouteComponent,
  pendingComponent: () => <PendingComponent resourceName="event" />,
  errorComponent: () => (
    <ErrorComponent resourceName="event" fallbackRouteName="events" fallbackUrl="/events" />
  ),
  ssr: "data-only",
  loader: async ({ params, context }) => {
    try {
      const { id } = params;

      const event = await context.queryClient.fetchQuery({ ...getEventByIdQueryOptions(id) });

      if (!event) {
        throw new Error("Event not found");
      }

      const relatedEvents = await context.queryClient.fetchQuery({
        ...getEventsByCategoryQueryOptions(event.category.name),
      });

      const coordinates = await context.queryClient.fetchQuery({
        ...getCoordinatesQueryOptions(event.location),
      });

      return { event, coordinates, relatedEvents };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching event or coordinates:", error.message);
      } else {
        console.error("Unknown error fetching event or coordinates");
      }

      throw new Error("Failed to fetch event or coordinates");
    }
  },
});

function RouteComponent() {
  const { event, coordinates, relatedEvents } = Route.useLoaderData();
  const { isAuthenticated, userId } = Route.useRouteContext();

  const relatedEventsExceptCurrent = relatedEvents.filter((e) => e._id !== event._id);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    ...deleteEventMutationOptions(event._id.toString()),
    onSuccess: () => {
      toast.success("Event deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["get", "events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get", "event", event._id.toString()],
      });

      navigate({ to: "/events" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <section className="container mx-auto">
      <div className="px-4 py-6">
        <div className="flex flex-col gap-6">
          {event.imageUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-2xl *:[img]:h-full *:[img]:w-full *:[img]:object-cover">
              <Image src={event.imageUrl} alt={event.title} />
            </div>
          )}

          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="font-heading scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                {event.title}
              </h1>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Badge
                    variant={"secondary"}
                    className="bg-green-300 text-green-800 dark:bg-green-800 dark:text-green-300"
                  >
                    {event.isFree ? "FREE" : `Nrs. ${event.price}`}
                  </Badge>

                  <Badge variant={"secondary"}>{event.category.name}</Badge>
                </div>

                <p>
                  by{" "}
                  <span className="text-muted-foreground">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Link to="/events/$id/register" params={{ id: event._id.toString() }}>
                  <Button className="w-full">
                    {event.isFree ? "Register for free" : "Buy ticket"}
                  </Button>
                </Link>

                {isAuthenticated && userId === event.organizer.clerkId && (
                  <Link to="/events/$id/update" params={{ id: event._id.toString() }}>
                    <Button variant={"secondary"} className="w-full" asChild>
                      <span>Edit Event Details</span>
                    </Button>
                  </Link>
                )}

                {isAuthenticated && userId === event.organizer.clerkId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Event</Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="sm:max-w-sm">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the event.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant={"destructive"}
                          onClick={() => mutate()}
                          disabled={isPending}
                        >
                          {isPending ? <Spinner /> : "Continue"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar />

                {event.startDate === event.endDate ? (
                  <p>{format(event.startDate, "PPP")}</p>
                ) : (
                  <p>
                    {format(event.startDate, "PPP")} - {format(event.endDate, "PPP")}
                  </p>
                )}
              </div>

              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <MapPin />

                <p>{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-heading scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
                  Description
                </h2>

                <p className="text-muted-foreground">{event.description}</p>
              </div>

              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2"
                >
                  <LinkIcon />
                  <span className="underline-offset-4 group-hover:underline">{event.url}</span>
                </a>
              )}
            </div>

            {coordinates && (
              <div className="flex flex-col gap-4">
                <h3 className="font-heading scroll-m-20 text-2xl font-semibold tracking-tight">
                  Location
                </h3>

                <LocationMap
                  coordinates={coordinates}
                  eventTitle={event.title}
                  eventLocation={event.location}
                />
              </div>
            )}

            <div className="flex flex-col gap-6">
              <h3 className="font-heading scroll-m-20 text-2xl font-semibold tracking-tight">
                Related Events
              </h3>

              {relatedEventsExceptCurrent.length > 0 ? (
                <EventsCollection events={relatedEventsExceptCurrent} />
              ) : (
                <p className="text-muted-foreground mb-20">No related events found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
