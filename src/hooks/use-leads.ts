"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeads } from "@/lib/api/leads";

export function useLeads(
  icpId: string | null,
  params?: { limit?: number; offset?: number }
) {
  return useQuery({
    queryKey: ["leads", icpId, params?.limit, params?.offset],
    queryFn: ({ signal }) => getLeads(icpId!, params, signal),
    enabled: !!icpId,
  });
}
