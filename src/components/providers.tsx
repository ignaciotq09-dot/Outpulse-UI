"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ActivityLogProvider } from "@/components/activity-log/activity-log-context";
import { ActivePipelineProvider } from "@/components/pipeline/active-pipeline-context";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ActivityLogProvider>
        <ActivePipelineProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className:
                "!bg-card !text-card-foreground !border-white/[0.08] !ring-1 !ring-white/[0.08]",
            }}
          />
        </ActivePipelineProvider>
      </ActivityLogProvider>
    </QueryClientProvider>
  );
}
