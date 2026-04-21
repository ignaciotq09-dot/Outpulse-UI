import { Suspense } from "react";
import { RunsContent } from "./runs-content";
import { Skeleton } from "@/components/ui/skeleton";

function RunsFallback() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

export default function RunsPage() {
  return (
    <Suspense fallback={<RunsFallback />}>
      <RunsContent />
    </Suspense>
  );
}
