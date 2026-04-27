import { get } from "@/lib/api-client";
import type { HealthResponse } from "@/lib/types";

export function getHealth(signal?: AbortSignal) {
  return get<HealthResponse>("/api/health", signal);
}
