import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

type ErrorComponentProps = {
  resourceName: string;
  fallbackRouteName?: string;
  fallbackUrl?: string;
};

export default function ErrorComponent({
  resourceName,
  fallbackRouteName,
  fallbackUrl,
}: ErrorComponentProps) {
  return (
    <section className="container mx-auto">
      <div className="px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="font-heading text-2xl font-semibold">Unable to load {resourceName}</h1>
          <p className="text-muted-foreground text-sm">
            {fallbackRouteName
              ? `Please try again or go back to ${fallbackRouteName}.`
              : "Please try again."}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => window.location.reload()}>Retry</Button>
            {fallbackUrl && (
              <Button variant="outline" asChild>
                <Link to={fallbackUrl}>Back to {fallbackRouteName}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
