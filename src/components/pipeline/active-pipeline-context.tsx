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
import { getPipelineStatus, startPipelineRun } from "@/lib/api/pipeline";
import type {
  PipelineJobStatusResponse,
  PipelineRunResult,
  PipelineStep,
  PipelineStepStatus,
} from "@/lib/types";
import { PIPELINE_STEPS } from "@/lib/constants";

const SESSION_KEY = "outpulse:active-pipeline";
const POLL_INTERVAL_MS = 2_500;
const MAX_RUN_MS = 70 * 60 * 1000;
const POLL_FAIL_LIMIT = 3;

interface ActiveRunMeta {
  url: string;
  candidateCount?: number;
  fieldCount?: number;
  startedAt: number;
  jobId?: string;
}

interface ActivePipelineContextValue {
  steps: PipelineStep[];
  result: PipelineRunResult | null;
  error: string | null;
  isRunning: boolean;
  elapsed: number;
  activeRun: ActiveRunMeta | null;
  startRun: (url: string, candidateCount?: number, fieldCount?: number) => boolean;
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

function persistMeta(meta: ActiveRunMeta) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(meta));
  } catch {
    // sessionStorage unavailable (private mode) — non-fatal
  }
}

function clearMeta() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

function abortableSleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const t = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

async function pollUntilTerminal(
  jobId: string,
  startedAt: number,
  signal: AbortSignal,
  onStatus: (s: PipelineJobStatusResponse) => void,
): Promise<PipelineJobStatusResponse> {
  let consecutiveFailures = 0;
  while (!signal.aborted) {
    if (Date.now() - startedAt > MAX_RUN_MS) {
      throw new Error(
        "Pipeline polling exceeded the 70 minute client ceiling.",
      );
    }
    let status: PipelineJobStatusResponse;
    try {
      status = await getPipelineStatus(jobId, signal);
      consecutiveFailures = 0;
    } catch (err) {
      if (signal.aborted) throw err;
      consecutiveFailures++;
      if (consecutiveFailures >= POLL_FAIL_LIMIT) throw err;
      await abortableSleep(POLL_INTERVAL_MS, signal);
      continue;
    }
    onStatus(status);
    if (status.status === "completed" || status.status === "failed") {
      return status;
    }
    await abortableSleep(POLL_INTERVAL_MS, signal);
  }
  throw new DOMException("Aborted", "AbortError");
}

export function ActivePipelineProvider({ children }: { children: ReactNode }) {
  const [stepIndex, setStepIndex] = useState(-1);
  const [result, setResult] = useState<PipelineRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeRun, setActiveRun] = useState<ActiveRunMeta | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = undefined;
    }
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];
  }, []);

  const scheduleFauxStepProgression = useCallback(
    (controller: AbortController) => {
      // Backend's pipeline status only reports {pending,running,completed,failed}
      // — no per-stage substatus. To give the user feedback during the 60–180s
      // run, advance the step indicator on a fixed 15s cadence. Real terminal
      // state (completed/failed) overrides this when polling resolves.
      stepTimersRef.current = [];
      for (let i = 1; i < PIPELINE_STEPS.length; i++) {
        stepTimersRef.current.push(
          setTimeout(() => {
            if (!controller.signal.aborted) setStepIndex(i);
          }, i * 15_000),
        );
      }
    },
    [],
  );

  const runJob = useCallback(
    async (meta: ActiveRunMeta, controller: AbortController) => {
      try {
        let jobId = meta.jobId;
        if (!jobId) {
          const accepted = await startPipelineRun(meta.url, {
            candidateCount: meta.candidateCount,
            fieldCount: meta.fieldCount,
            signal: controller.signal,
          });
          jobId = accepted.job_id;
          const updated: ActiveRunMeta = { ...meta, jobId };
          persistMeta(updated);
          setActiveRun(updated);
        }

        const terminal = await pollUntilTerminal(
          jobId,
          meta.startedAt,
          controller.signal,
          () => {
            // Hook for future per-status UX (e.g. distinguish pending vs running)
          },
        );

        if (controller.signal.aborted) return;
        clearTimers();
        clearMeta();
        setElapsed((Date.now() - meta.startedAt) / 1000);

        if (terminal.status === "failed") {
          setStepIndex((idx) => Math.max(idx, 0));
          const msg =
            terminal.error_message ?? "Pipeline failed without an error message.";
          setError(msg);
          setIsRunning(false);
          setActiveRun(null);
          toast.error(`Pipeline failed: ${msg}`, { duration: 7000 });
          return;
        }

        // status === "completed"
        if (
          !terminal.icp_blueprint_id ||
          !terminal.run_id ||
          !terminal.customer_id
        ) {
          const msg =
            "Pipeline completed but the backend did not return an ICP id.";
          setError(msg);
          setIsRunning(false);
          setActiveRun(null);
          toast.error(msg, { duration: 7000 });
          return;
        }

        setStepIndex(PIPELINE_STEPS.length);
        setResult({
          job_id: terminal.job_id,
          run_id: terminal.run_id,
          customer_id: terminal.customer_id,
          icp_blueprint_id: terminal.icp_blueprint_id,
        });
        setIsRunning(false);
        setActiveRun(null);
        toast.success("Pipeline complete — taking you to leads", {
          duration: 4000,
        });
      } catch (err) {
        clearTimers();
        clearMeta();
        if (controller.signal.aborted) return;
        const msg = err instanceof Error ? err.message : "Pipeline failed";
        setError(msg);
        setIsRunning(false);
        setActiveRun(null);
        setElapsed((Date.now() - meta.startedAt) / 1000);
        toast.error(`Pipeline failed: ${msg}`, { duration: 7000 });
      }
    },
    [clearTimers],
  );

  // On mount, recover any in-flight job from sessionStorage and resume polling.
  // Unlike the old sync flow we CAN truly resume — the job lives server-side
  // and we only need its job_id to keep polling.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(SESSION_KEY);
    } catch {
      return;
    }
    if (!raw) return;

    let meta: ActiveRunMeta;
    try {
      meta = JSON.parse(raw) as ActiveRunMeta;
    } catch {
      clearMeta();
      return;
    }

    if (!meta.jobId) {
      // Started but never got a job_id back — can't resume.
      clearMeta();
      return;
    }

    const ageMs = Date.now() - meta.startedAt;
    if (ageMs > MAX_RUN_MS) {
      clearMeta();
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setActiveRun(meta);
    setIsRunning(true);
    setError(null);
    setResult(null);
    setStepIndex(
      Math.min(Math.floor(ageMs / 15_000), PIPELINE_STEPS.length - 1),
    );
    setElapsed(ageMs / 1000);

    elapsedTimerRef.current = setInterval(() => {
      setElapsed((Date.now() - meta.startedAt) / 1000);
    }, 250);

    scheduleFauxStepProgression(controller);
    void runJob(meta, controller);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      clearTimers();
    };
  }, [clearTimers]);

  const startRun = useCallback(
    (url: string, candidateCount?: number, fieldCount?: number): boolean => {
      if (isRunning) return false;

      const meta: ActiveRunMeta = {
        url,
        candidateCount,
        fieldCount,
        startedAt: Date.now(),
      };
      persistMeta(meta);

      const controller = new AbortController();
      abortRef.current = controller;

      setActiveRun(meta);
      setResult(null);
      setError(null);
      setIsRunning(true);
      setStepIndex(0);
      setElapsed(0);

      elapsedTimerRef.current = setInterval(() => {
        setElapsed((Date.now() - meta.startedAt) / 1000);
      }, 250);

      scheduleFauxStepProgression(controller);
      void runJob(meta, controller);

      return true;
    },
    [isRunning, runJob, scheduleFauxStepProgression],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    clearTimers();
    clearMeta();
    setStepIndex(-1);
    setResult(null);
    setError(null);
    setIsRunning(false);
    setElapsed(0);
    setActiveRun(null);
  }, [clearTimers]);

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
