"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { runPipeline } from "@/lib/api/pipeline";
import type {
  PipelineResponse,
  PipelineStep,
  PipelineStepStatus,
} from "@/lib/types";
import { PIPELINE_STEPS } from "@/lib/constants";

const SESSION_KEY = "outpulse:active-pipeline";

interface ActiveRunMeta {
  url: string;
  candidateCount?: number;
  startedAt: number; // epoch ms
}

interface ActivePipelineContextValue {
  steps: PipelineStep[];
  result: PipelineResponse | null;
  error: string | null;
  isRunning: boolean;
  elapsed: number; // seconds
  activeRun: ActiveRunMeta | null;
  startRun: (url: string, candidateCount?: number) => boolean;
  reset: () => void;
}

const ActivePipelineContext =
  createContext<ActivePipelineContextValue | null>(null);

function makeSteps(activeIndex: number, error: boolean): PipelineStep[] {
  return PIPELINE_STEPS.map((s, i) => {
    let status: PipelineStepStatus = "pending";
    if (error && i === activeIndex) status = "error";
    else if (i < activeIndex) status = "completed";
    else if (i === activeIndex) status = "active";
    return { ...s, status };
  });
}

export function ActivePipelineProvider({ children }: { children: ReactNode }) {
  const [stepIndex, setStepIndex] = useState(-1);
  const [result, setResult] = useState<PipelineResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeRun, setActiveRun] = useState<ActiveRunMeta | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // On mount, recover any "running" marker from sessionStorage. We can't
  // recover the in-flight fetch, but we can show the user that a run was
  // started and surface a soft notice telling them to check /runs.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const meta = JSON.parse(raw) as ActiveRunMeta;
      // Only resurrect if it was started in the last 5 minutes (otherwise
      // the request has long since either succeeded or died).
      const ageSec = (Date.now() - meta.startedAt) / 1000;
      if (ageSec > 300) {
        sessionStorage.removeItem(SESSION_KEY);
        return;
      }
      setActiveRun(meta);
      setIsRunning(true);
      setStepIndex(Math.min(Math.floor(ageSec / 15), PIPELINE_STEPS.length - 1));
      setElapsed(ageSec);

      timerRef.current = setInterval(() => {
        const e = (Date.now() - meta.startedAt) / 1000;
        setElapsed(e);
        if (e > 300) {
          // Give up after 5 minutes
          clearInterval(timerRef.current!);
          timerRef.current = undefined;
          sessionStorage.removeItem(SESSION_KEY);
          setIsRunning(false);
          setActiveRun(null);
          setError(
            "Pipeline took too long to respond. Check the Runs page for status.",
          );
        }
      }, 1000);
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (timerRef.current) clearInterval(timerRef.current);
      stepTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
  };

  const startRun = useCallback(
    (url: string, candidateCount?: number): boolean => {
      // Lock — don't start a new run if one is in flight.
      if (isRunning) return false;

      const meta: ActiveRunMeta = {
        url,
        candidateCount,
        startedAt: Date.now(),
      };

      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(meta));
      } catch {
        // sessionStorage may be unavailable (private mode, etc) — non-fatal.
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setActiveRun(meta);
      setResult(null);
      setError(null);
      setIsRunning(true);
      setStepIndex(0);
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((Date.now() - meta.startedAt) / 1000);
      }, 100);

      stepTimersRef.current = [];
      for (let i = 1; i < PIPELINE_STEPS.length; i++) {
        stepTimersRef.current.push(
          setTimeout(() => {
            if (!controller.signal.aborted) {
              setStepIndex(i);
            }
          }, i * 15_000),
        );
      }

      runPipeline(url, { candidateCount, signal: controller.signal })
        .then((data) => {
          clearTimers();
          sessionStorage.removeItem(SESSION_KEY);
          setStepIndex(PIPELINE_STEPS.length);
          setResult(data);
          setIsRunning(false);
          setElapsed((Date.now() - meta.startedAt) / 1000);
          const leadCount = data.ranked_leads?.length ?? 0;
          toast.success(
            `Pipeline complete — ${leadCount} ${
              leadCount === 1 ? "lead" : "leads"
            } found`,
            { duration: 5000 },
          );
        })
        .catch((err: unknown) => {
          clearTimers();
          sessionStorage.removeItem(SESSION_KEY);
          if (controller.signal.aborted) return;
          const msg = err instanceof Error ? err.message : "Pipeline failed";
          setError(msg);
          setIsRunning(false);
          setElapsed((Date.now() - meta.startedAt) / 1000);
          toast.error(`Pipeline failed: ${msg}`, { duration: 7000 });
        });

      return true;
    },
    [isRunning],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    clearTimers();
    sessionStorage.removeItem(SESSION_KEY);
    setStepIndex(-1);
    setResult(null);
    setError(null);
    setIsRunning(false);
    setElapsed(0);
    setActiveRun(null);
  }, []);

  const hasError = error !== null;
  const steps =
    stepIndex < 0 ? makeSteps(-1, false) : makeSteps(stepIndex, hasError);

  return (
    <ActivePipelineContext.Provider
      value={{
        steps,
        result,
        error,
        isRunning,
        elapsed,
        activeRun,
        startRun,
        reset,
      }}
    >
      {children}
    </ActivePipelineContext.Provider>
  );
}

export function useActivePipeline(): ActivePipelineContextValue {
  const ctx = useContext(ActivePipelineContext);
  if (!ctx)
    throw new Error(
      "useActivePipeline must be used within ActivePipelineProvider",
    );
  return ctx;
}
