"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeadDetail } from "@/lib/api/leads";

export function useLeadDetail(
  icpId: string | null,
  leadId: string | null
) {
  return useQuery({
    queryKey: ["lead-detail", icpId, leadId],
    queryFn: ({ signal }) => getLeadDetail(icpId!, leadId!, signal),
    enabled: !!icpId && !!leadId,
  });
}
