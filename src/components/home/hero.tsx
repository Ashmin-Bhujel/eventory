import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="container mx-auto">
      <div className="mx-auto flex flex-col items-center justify-center gap-4 px-4 py-72 md:max-w-4xl">
        <div className="flex flex-col text-center">
          <h1 className="font-heading scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance md:text-6xl">
            Create, Manage & Connect.{" "}
            <span className="font-light text-amber-500 italic">Your Events, Your Way!</span>
          </h1>

          <p className="text-muted-foreground md:text-xl">
            Plan, promote, and manage your events with ease.
          </p>
        </div>

        <div>
          <Button variant={"outline"} size={"lg"} asChild>
            <Link to="/events/create">Create Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
