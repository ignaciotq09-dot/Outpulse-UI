"use client";

import { useRuns } from "@/hooks/use-runs";
import { RunsTable } from "@/components/runs/runs-table";
import { Skeleton } from "@/components/ui/skeleton";

export function RunsContent() {
  const { data: runs, isLoading, error } = useRuns();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="gradient-text text-2xl font-bold tracking-tight">
          Pipeline Runs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          History of all pipeline executions
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-400/10 px-6 py-4 ring-1 ring-red-400/20">
          <p className="text-sm text-red-400">
            {error instanceof Error ? error.message : "Failed to load runs"}
          </p>
        </div>
      ) : (
        <div className="animate-fade-in-up">
          <RunsTable runs={runs ?? []} />
        </div>
      )}
    </div>
  );
}
