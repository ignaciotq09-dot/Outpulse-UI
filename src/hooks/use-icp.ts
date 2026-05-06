"use client";

import { useQuery } from "@tanstack/react-query";
import { getICP } from "@/lib/api/icp";

export function useICP(icpId: string | null | undefined) {
  return useQuery({
    queryKey: ["icp", icpId],
    queryFn: ({ signal }) => getICP(icpId!, signal),
    enabled: !!icpId,
    staleTime: 60_000,
  });
}
