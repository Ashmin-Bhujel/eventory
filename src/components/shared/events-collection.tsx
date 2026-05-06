import type { EventResponse } from "#/lib/zod/event.schema";

import { Skeleton } from "#/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image } from "@imagekit/react";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Button } from "../ui/button";

export default function EventsCollection({ events }: { events: EventResponse[] }) {
  return (
    <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map((event) => (
        <Card key={event._id.toString()} className="relative mx-auto w-full max-w-sm pt-0">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              className="aspect-video w-full object-cover"
            />
          ) : (
            <Skeleton className="aspect-video w-full rounded-none" />
          )}

          <CardHeader className="lg:min-h-18 xl:min-h-auto">
            <CardTitle>{event.title}</CardTitle>

            <CardAction>
              <Badge variant="secondary">{event.category.name}</Badge>
            </CardAction>

            <CardDescription>{event.location}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex min-h-24 flex-col gap-2">
              <div className="space-x-2">
                <Badge className="bg-green-300 text-green-800 dark:bg-green-800 dark:text-green-300">
                  {event.isFree ? "FREE" : `Nrs. ${event.price}`}
                </Badge>

                <Badge variant="outline" className="mb-2">
                  {format(new Date(event.startDate), "PPP")}
                </Badge>
              </div>
              {event.description.length > 100
                ? `${event.description.slice(0, 100)}...`
                : event.description}
            </div>
          </CardContent>

          <CardFooter>
            <Link to="/events/$id" params={{ id: event._id.toString() }} className="w-full">
              <Button className="w-full" asChild>
                <span>View Event</span>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
