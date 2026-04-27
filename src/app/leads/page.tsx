import { Suspense } from "react";
import { LeadsContent } from "./leads-content";
import { Skeleton } from "@/components/ui/skeleton";

function LeadsFallback() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<LeadsFallback />}>
      <LeadsContent />
    </Suspense>
  );
}
