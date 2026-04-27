"use client";

import Link from "next/link";
import { Rocket, Users, History, Activity, BarChart3 } from "lucide-react";
import { useRuns } from "@/hooks/use-runs";
import { RunsTable } from "@/components/runs/runs-table";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardContent() {
  const { data: runs, isLoading } = useRuns({ limit: 5 });

  const completedRuns = runs?.filter((r) => r.status === "completed") ?? [];
  const totalLeads = completedRuns.reduce(
    (sum, r) => sum + (r.returned_count ?? 0),
    0,
  );
  const totalAnalyzed = completedRuns.reduce(
    (sum, r) => sum + (r.analyzed_count ?? 0),
    0,
  );

  return (
    <div className="relative mx-auto max-w-5xl space-y-8">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 overflow-hidden">
        <div className="absolute -left-20 -top-20 size-80 rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_280)]/10 to-transparent blur-3xl" />
        <div className="absolute -right-20 top-10 size-72 rounded-full bg-gradient-to-bl from-[oklch(0.65_0.22_250)]/10 to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="gradient-text text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your lead discovery activity
          </p>
        </div>
        <Link href="/onboarding">
          <Button className="gap-2 bg-gradient-to-r from-[oklch(0.55_0.25_280)] to-[oklch(0.65_0.22_250)] text-white hover:opacity-90 hover:shadow-lg hover:shadow-[oklch(0.65_0.22_265)]/20 transition-all">
            <Rocket className="size-4" />
            New Pipeline
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="animate-fade-in-up">
          <StatCard
            label="Total Runs"
            value={runs?.length ?? 0}
            icon={Activity}
            accent="primary"
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
          <StatCard
            label="Completed"
            value={completedRuns.length}
            icon={History}
            accent="emerald"
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <StatCard
            label="Leads Found"
            value={totalLeads}
            icon={Users}
            accent="blue"
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <StatCard
            label="Analyzed"
            value={totalAnalyzed}
            icon={BarChart3}
            accent="amber"
          />
        </div>
      </div>

      {/* Recent Runs */}
      <div
        className="space-y-3 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Runs</h2>
          <Link href="/runs">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              View all
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <RunsTable runs={runs ?? []} />
        )}
      </div>
    </div>
  );
}
