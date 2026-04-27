import { get } from "@/lib/api-client";
import type { IngestResponse } from "@/lib/types";

export function getICP(id: string, signal?: AbortSignal) {
  return get<IngestResponse>(`/api/icp/${id}`, signal);
}
