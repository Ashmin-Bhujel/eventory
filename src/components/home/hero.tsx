import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="container mx-auto">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 px-4 py-72">
        <div className="flex flex-col text-center">
          <h1 className="font-heading scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance">
            Create, Manage & Connect.{" "}
            <span className="font-light text-amber-500 italic">Your Events, Your Way!</span>
          </h1>

          <p className="text-muted-foreground text-xl">
            Plan, promote, and manage your events with ease.
          </p>
        </div>

        <div>
          <Button variant={"outline"} size={"lg"} asChild>
            <Link to="/">Create Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
