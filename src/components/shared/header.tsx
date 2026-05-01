import { Show, UserButton } from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

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

          <nav className="flex items-center gap-2">
            <Link to="/">
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} asChild>
                  <span>Home</span>
                </Button>
              )}
            </Link>

            {/* TODO: Implement Events link, dummy for now */}
            <Link to="/">
              {() => (
                <Button variant={"ghost"} asChild>
                  <span>Events</span>
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

          <div className="flex items-center gap-4">
            <Show when={"signed-in"}>
              <UserButton showName />
            </Show>

            <Show when={"signed-out"}>
              <Link to="/login/$">
                {({ isActive }) => (
                  <Button variant={isActive ? "secondary" : "outline"} asChild>
                    <span>Login</span>
                  </Button>
                )}
              </Link>
            </Show>

            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
