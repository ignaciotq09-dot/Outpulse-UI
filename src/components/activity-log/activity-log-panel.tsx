"use client";

import { useRef, useEffect } from "react";
import {
  Activity,
  Zap,
  AlertCircle,
  Info,
  Trash2,
} from "lucide-react";
import { useActivityLog } from "./activity-log-context";
import { Button } from "@/components/ui/button";
import type { ActivityLogType } from "@/lib/types";

const TYPE_STYLES: Record<ActivityLogType, { icon: typeof Activity; color: string }> = {
  api: { icon: Zap, color: "text-blue-400" },
  pipeline: { icon: Activity, color: "text-purple-400" },
  error: { icon: AlertCircle, color: "text-red-400" },
  info: { icon: Info, color: "text-gray-400" },
};

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour12: false });
}

export function ActivityLogPanel({ open }: { open: boolean }) {
  const { entries, clearLogs } = useActivityLog();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries.length, open]);

  if (!open) return null;

  return (
    <aside className="flex h-full w-80 flex-col border-l border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">Activity Log</h3>
        <Button variant="ghost" size="icon-xs" onClick={clearLogs}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {entries.length === 0 && (
          <p className="px-2 py-8 text-center text-xs text-muted-foreground">
            No activity yet
          </p>
        )}
        {entries.map((entry) => {
          const cfg = TYPE_STYLES[entry.type];
          const Icon = cfg.icon;
          return (
            <div
              key={entry.id}
              className="flex items-start gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-white/[0.03]"
            >
              <Icon className={`mt-0.5 size-3.5 shrink-0 ${cfg.color}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground tabular-nums">
                    {formatTime(entry.timestamp)}
                  </span>
                  {entry.status != null && entry.status > 0 && (
                    <span className="text-muted-foreground">
                      {entry.status}
                    </span>
                  )}
                  {entry.duration != null && (
                    <span className="text-muted-foreground">
                      {entry.duration}ms
                    </span>
                  )}
                </div>
                <p className="text-foreground">{entry.message}</p>
                {entry.detail && (
                  <p className="text-muted-foreground truncate">{entry.detail}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </aside>
  );
}
