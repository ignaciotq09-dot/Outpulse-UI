"use client";

import { useQuery } from "@tanstack/react-query";
import { getRuns } from "@/lib/api/runs";

export function useRuns(params?: {
  customer_id?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["runs", params?.customer_id, params?.limit, params?.offset],
    queryFn: ({ signal }) => getRuns(params, signal),
  });
}
