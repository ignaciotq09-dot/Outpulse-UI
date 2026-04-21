import { post } from "@/lib/api-client";
import type { PipelineResponse } from "@/lib/types";

export interface RunPipelineOptions {
  candidateCount?: number;
  fieldCount?: number;
  signal?: AbortSignal;
}

export function runPipeline(url: string, options: RunPipelineOptions = {}) {
  const { candidateCount, fieldCount, signal } = options;
  const body: Record<string, unknown> = { url };
  if (candidateCount !== undefined) body.candidate_count = candidateCount;
  if (fieldCount !== undefined) body.field_count = fieldCount;

  return post<PipelineResponse>("/api/pipeline", body, {
    signal,
    timeout: 200_000,
  });
}
