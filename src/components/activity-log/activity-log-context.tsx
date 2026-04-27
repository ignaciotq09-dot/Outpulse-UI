"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { setActivityLogger } from "@/lib/api-client";
import type { ActivityLogEntry } from "@/lib/types";

const MAX_ENTRIES = 200;

interface ActivityLogContextValue {
  entries: ActivityLogEntry[];
  addLog: (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => void;
  clearLogs: () => void;
}

const ActivityLogContext = createContext<ActivityLogContextValue | null>(null);

let idCounter = 0;

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);

  const addLog = useCallback(
    (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => {
      const newEntry: ActivityLogEntry = {
        ...entry,
        id: `log_${++idCounter}`,
        timestamp: new Date(),
      };
      setEntries((prev) => {
        const next = [...prev, newEntry];
        return next.length > MAX_ENTRIES ? next.slice(-MAX_ENTRIES) : next;
      });
    },
    []
  );

  const clearLogs = useCallback(() => setEntries([]), []);

  // Wire up the module-level logger
  useEffect(() => {
    setActivityLogger(addLog);
    return () => setActivityLogger(() => {});
  }, [addLog]);

  return (
    <ActivityLogContext.Provider value={{ entries, addLog, clearLogs }}>
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const ctx = useContext(ActivityLogContext);
  if (!ctx) throw new Error("useActivityLog must be used within ActivityLogProvider");
  return ctx;
}
