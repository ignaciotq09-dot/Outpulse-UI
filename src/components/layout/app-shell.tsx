"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PanelRightOpen, PanelRightClose, Loader2 } from "lucide-react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { ActivityLogPanel } from "@/components/activity-log/activity-log-panel";
import { Button } from "@/components/ui/button";
import { useActivePipeline } from "@/components/pipeline/active-pipeline-context";
import { formatElapsed } from "@/lib/format";

function PipelineRunningPill() {
  const { isRunning, elapsed, activeRun } = useActivePipeline();
  const router = useRouter();
  const pathname = usePathname();

  if (!isRunning) return null;
  const onOnboarding = pathname === "/onboarding";

  return (
    <button
      type="button"
      onClick={() => !onOnboarding && router.push("/onboarding")}
      disabled={onOnboarding}
      className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.55_0.25_280)]/15 to-[oklch(0.65_0.22_250)]/15 px-3 py-1.5 ring-1 ring-[oklch(0.65_0.22_265)]/30 text-xs font-medium text-foreground transition-all hover:ring-[oklch(0.65_0.22_265)]/50 disabled:cursor-default"
      title={activeRun?.url}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.65_0.22_265)] opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-[oklch(0.65_0.22_265)]" />
      </span>
      <Loader2 className="size-3 animate-spin text-[oklch(0.7_0.2_265)]" />
      <span>Pipeline running</span>
      <span className="tabular-nums text-muted-foreground">
        {formatElapsed(Math.round(elapsed))}
      </span>
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [logOpen, setLogOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileNav />
        {/* Top bar */}
        <div className="hidden md:flex h-12 items-center justify-end gap-2 border-b border-white/[0.06] px-4">
          <PipelineRunningPill />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setLogOpen((o) => !o)}
            className="text-muted-foreground"
          >
            {logOpen ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelRightOpen className="size-4" />
            )}
          </Button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          <ActivityLogPanel open={logOpen} />
        </div>
      </div>
    </div>
  );
}
