"use client";

import { Check, Loader2, Circle, AlertCircle, Users, ListChecks } from "lucide-react";
import type { PipelineStep } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatElapsed } from "@/lib/format";
import { PIPELINE_TIPS } from "@/lib/constants";

const STATUS_ICON = {
  pending: Circle,
  active: Loader2,
  completed: Check,
  error: AlertCircle,
};

export interface PipelineProgressMeta {
  candidateCount?: number;
  fieldCount?: number;
}

export function PipelineProgress({
  steps,
  elapsed,
  tip,
  meta,
}: {
  steps: PipelineStep[];
  elapsed: number;
  tip?: string;
  meta?: PipelineProgressMeta;
}) {
  const tipText = tip ?? PIPELINE_TIPS[Math.floor(elapsed / 30) % PIPELINE_TIPS.length];

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 text-center space-y-2">
        <p className="text-sm text-muted-foreground tabular-nums">
          Elapsed: {formatElapsed(elapsed)}
        </p>
        {meta && (meta.candidateCount !== undefined || meta.fieldCount !== undefined) && (
          <div className="inline-flex items-center gap-3 rounded-full bg-white/[0.04] px-3 py-1 ring-1 ring-white/[0.08]">
            {meta.candidateCount !== undefined && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                <Users className="size-3.5" />
                {meta.candidateCount} {meta.candidateCount === 1 ? "candidate" : "candidates"}
              </span>
            )}
            {meta.candidateCount !== undefined && meta.fieldCount !== undefined && (
              <span className="text-xs text-muted-foreground/40">·</span>
            )}
            {meta.fieldCount !== undefined && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                <ListChecks className="size-3.5" />
                {meta.fieldCount} {meta.fieldCount === 1 ? "field" : "fields"}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-0">
        {steps.map((step, i) => {
          const Icon = STATUS_ICON[step.status];
          const isLast = i === steps.length - 1;

          return (
            <div key={step.id} className="flex gap-4">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full ring-1",
                    step.status === "completed" &&
                      "bg-emerald-400/15 text-emerald-400 ring-emerald-400/30",
                    step.status === "active" &&
                      "bg-gradient-to-br from-[oklch(0.55_0.25_280)]/20 to-[oklch(0.65_0.22_250)]/20 text-[oklch(0.65_0.22_250)] ring-[oklch(0.65_0.22_250)]/30",
                    step.status === "error" &&
                      "bg-red-400/15 text-red-400 ring-red-400/30",
                    step.status === "pending" &&
                      "bg-white/[0.04] text-muted-foreground ring-white/[0.08]"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      step.status === "active" && "animate-spin"
                    )}
                  />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-px flex-1 min-h-8",
                      step.status === "completed"
                        ? "bg-emerald-400/30"
                        : "bg-white/[0.08]"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-6">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.status === "active"
                      ? "text-foreground"
                      : step.status === "completed"
                      ? "text-emerald-400"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip */}
      <div className="mt-4 rounded-lg bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06]">
        <p className="text-xs text-muted-foreground">{tipText}</p>
      </div>
    </div>
  );
}
