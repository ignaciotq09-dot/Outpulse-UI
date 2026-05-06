import { post } from "@/lib/api-client";
import type { IngestResponse } from "@/lib/types";

export function ingestUrl(url: string, signal?: AbortSignal) {
  return post<IngestResponse>("/api/ingest", { url }, { signal, timeout: 60_000 });
}
