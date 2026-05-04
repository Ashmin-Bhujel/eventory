import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-dvh items-center justify-center px-4 py-6">
      <div className="flex size-full flex-col items-center justify-center gap-4 text-center">
        <div className="mx-auto max-w-2xl overflow-hidden">
          <img src="/images/not-found.png" alt="Not Found" />
        </div>

        <div>
          <h1 className="font-heading scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Oops! Page Not Found
          </h1>

          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div>
          <Link to="/">
            <Button variant={"outline"} size={"lg"}>
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
