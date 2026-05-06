"use client";

import { useActivePipeline } from "@/components/pipeline/active-pipeline-context";
import type { PipelineRunResult, PipelineStep } from "@/lib/types";

export interface UsePipelineReturn {
  steps: PipelineStep[];
  result: PipelineRunResult | null;
  error: string | null;
  isRunning: boolean;
  elapsed: number;
  start: (url: string, candidateCount?: number, fieldCount?: number) => void;
  reset: () => void;
}

/**
 * Thin wrapper that delegates to the global ActivePipelineContext so the
 * pipeline state survives navigation between pages and only one run can
 * be in flight at a time.
 */
export function usePipeline(): UsePipelineReturn {
  const ctx = useActivePipeline();
  return {
    steps: ctx.steps,
    result: ctx.result,
    error: ctx.error,
    isRunning: ctx.isRunning,
    elapsed: ctx.elapsed,
    start: ctx.startRun,
    reset: ctx.reset,
  };
}
