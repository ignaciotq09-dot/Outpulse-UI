import { get } from "@/lib/api-client";
import type { RunRead } from "@/lib/types";

export function getRuns(
  params?: { customer_id?: string; limit?: number; offset?: number },
  signal?: AbortSignal
) {
  const q = new URLSearchParams();
  if (params?.customer_id) q.set("customer_id", params.customer_id);
  if (params?.limit != null) q.set("limit", String(params.limit));
  if (params?.offset != null) q.set("offset", String(params.offset));
  const qs = q.toString();
  return get<RunRead[]>(`/api/runs${qs ? `?${qs}` : ""}`, signal);
}

export function getRun(runId: string, signal?: AbortSignal) {
  return get<RunRead>(`/api/runs/${runId}`, signal);
}
