import { Spinner } from "../ui/spinner";

type PendingComponentProps = {
  resourceName: string;
};

export default function PendingComponent({ resourceName }: PendingComponentProps) {
  return (
    <section className="container mx-auto">
      <div className="px-4 py-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <Spinner />
          <p className="text-muted-foreground text-sm">Loading {resourceName}...</p>
        </div>
      </div>
    </section>
  );
}
