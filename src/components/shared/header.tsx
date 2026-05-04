import { Show, UserButton } from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import MobileNav from "./mobile-nav";

export default function Header() {
  return (
    <header>
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-6">
          <Link to="/">
            <span className="font-heading scroll-m-20 text-2xl font-semibold tracking-tight">
              Eventory
            </span>
          </Link>

          <nav className="hidden items-center gap-4 md:flex">
            <Link to="/">
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} asChild>
                  <span>Home</span>
                </Button>
              )}
            </Link>

            <Link to="/events">
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} asChild>
                  <span>Events</span>
                </Button>
              )}
            </Link>

            <Link to="/events/create">
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} asChild>
                  <span>Create Events</span>
                </Button>
              )}
            </Link>

            <Link to="/profile">
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} asChild>
                  <span>My Profile</span>
                </Button>
              )}
            </Link>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Show when={"signed-in"}>
              <UserButton fallback={<Skeleton className="size-7" />} />
            </Show>

            <Show when={"signed-out"}>
              <Link to="/login/$">
                <Button variant={"outline"} asChild>
                  <span>Login</span>
                </Button>
              </Link>
            </Show>

            <ModeToggle />
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <Show when={"signed-in"}>
              <UserButton fallback={<Skeleton className="size-7" />} />
            </Show>

            <Show when={"signed-out"}>
              <Link to="/login/$">
                <Button variant={"outline"} asChild>
                  <span>Login</span>
                </Button>
              </Link>
            </Show>

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
