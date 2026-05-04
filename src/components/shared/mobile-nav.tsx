import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Eventory</SheetTitle>

          <nav className="mt-6 flex flex-col gap-4">
            <Link to="/">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={"lg"}
                  asChild
                >
                  <SheetClose>Home</SheetClose>
                </Button>
              )}
            </Link>

            <Link to="/events">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={"lg"}
                  asChild
                >
                  <SheetClose>Events</SheetClose>
                </Button>
              )}
            </Link>

            <Link to="/events/create">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={"lg"}
                  asChild
                >
                  <SheetClose>Create Events</SheetClose>
                </Button>
              )}
            </Link>

            <Link to="/profile">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  size={"lg"}
                  asChild
                >
                  <SheetClose>My Profile</SheetClose>
                </Button>
              )}
            </Link>
          </nav>
        </SheetHeader>

        <SheetDescription className="sr-only">Mobile Navigation Menu</SheetDescription>

        <SheetFooter className="flex items-center">
          <div className="self-end">
            <ModeToggle />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
