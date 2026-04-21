"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { formatDateTime, formatElapsed } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RunRead } from "@/lib/types";

const STATUS_STYLES: Record<
  string,
  { label: string; className: string; pulsing?: boolean }
> = {
  pending: {
    label: "Pending",
    className: "bg-white/[0.06] text-muted-foreground border-white/[0.1]",
  },
  discovering: {
    label: "Discovering",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    pulsing: true,
  },
  discovery_completed: {
    label: "Discovered",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  scoring: {
    label: "Scoring",
    className:
      "bg-[oklch(0.65_0.22_265)]/15 text-[oklch(0.7_0.2_265)] border-[oklch(0.65_0.22_265)]/30",
    pulsing: true,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

function getDurationSec(run: RunRead): number | null {
  if (!run.completed_at) return null;
  try {
    const start = new Date(run.created_at).getTime();
    const end = new Date(run.completed_at).getTime();
    return Math.max(0, (end - start) / 1000);
  } catch {
    return null;
  }
}

export function RunsTable({ runs }: { runs: RunRead[] }) {
  const router = useRouter();

  return (
    <div className="ring-1 ring-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06] hover:bg-transparent">
            <TableHead>Run ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Leads Found</TableHead>
            <TableHead className="hidden md:table-cell">Analyzed</TableHead>
            <TableHead className="hidden lg:table-cell">Duration</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                No runs yet. Start a pipeline to see results here.
              </TableCell>
            </TableRow>
          )}
          {runs.map((run, i) => {
            const st = STATUS_STYLES[run.status] ?? STATUS_STYLES.pending;
            const isCompleted = run.status === "completed";
            const duration = getDurationSec(run);

            return (
              <TableRow
                key={run.id}
                onClick={
                  isCompleted
                    ? () =>
                        router.push(
                          `/leads?icp_id=${run.icp_blueprint_id}`,
                        )
                    : undefined
                }
                className={cn(
                  "group border-white/[0.04] transition-colors animate-fade-in-up",
                  isCompleted
                    ? "cursor-pointer hover:bg-white/[0.04]"
                    : "cursor-not-allowed opacity-70",
                )}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <TableCell>
                  <span className="font-mono text-xs text-foreground">
                    {run.id.slice(0, 8)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border",
                      st.className,
                    )}
                  >
                    {st.pulsing && (
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
                      </span>
                    )}
                    {st.label}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell tabular-nums text-muted-foreground">
                  {run.returned_count ?? "-"}
                </TableCell>
                <TableCell className="hidden md:table-cell tabular-nums text-muted-foreground">
                  {run.analyzed_count ?? "-"}
                </TableCell>
                <TableCell className="hidden lg:table-cell tabular-nums text-xs text-muted-foreground">
                  {duration !== null ? formatElapsed(duration) : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {formatDateTime(run.created_at)}
                </TableCell>
                <TableCell className="w-8">
                  {isCompleted && (
                    <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
