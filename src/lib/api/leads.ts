import { get } from "@/lib/api-client";
import type { LeadListResponse, LeadDetailRead } from "@/lib/types";

export function getLeads(
  icpId: string,
  params?: { limit?: number; offset?: number },
  signal?: AbortSignal
) {
  const q = new URLSearchParams();
  if (params?.limit != null) q.set("limit", String(params.limit));
  if (params?.offset != null) q.set("offset", String(params.offset));
  const qs = q.toString();
  return get<LeadListResponse>(
    `/api/leads/${icpId}${qs ? `?${qs}` : ""}`,
    signal
  );
}

export function getLeadDetail(
  icpId: string,
  leadId: string,
  signal?: AbortSignal
) {
  return get<LeadDetailRead>(`/api/leads/${icpId}/${leadId}`, signal);
}
