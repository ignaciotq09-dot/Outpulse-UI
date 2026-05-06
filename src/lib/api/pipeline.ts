import { get, post } from "@/lib/api-client";
import type {
  PipelineAcceptedResponse,
  PipelineJobStatusResponse,
} from "@/lib/types";

export interface StartPipelineRunOptions {
  candidateCount?: number;
  fieldCount?: number;
  signal?: AbortSignal;
}

export function startPipelineRun(
  url: string,
  options: StartPipelineRunOptions = {},
) {
  const { candidateCount, fieldCount, signal } = options;
  const body: Record<string, unknown> = { url };
  if (candidateCount !== undefined) body.candidate_count = candidateCount;
  if (fieldCount !== undefined) body.field_count = fieldCount;

  return post<PipelineAcceptedResponse>("/api/pipeline/run", body, {
    signal,
    timeout: 30_000,
  });
}

export function getPipelineStatus(jobId: string, signal?: AbortSignal) {
  return get<PipelineJobStatusResponse>(
    `/api/pipeline/status/${jobId}`,
    signal,
  );
}
