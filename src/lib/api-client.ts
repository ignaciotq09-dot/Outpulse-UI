import type { ActivityLogEntry, ActivityLogType } from "@/lib/types";

// ── Module-level log setter ──

type AddLogFn = (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => void;

let _addLog: AddLogFn | null = null;

export function setActivityLogger(fn: AddLogFn) {
  _addLog = fn;
}

function log(
  type: ActivityLogType,
  message: string,
  detail?: string,
  status?: number,
  duration?: number
) {
  _addLog?.({ type, message, detail, status, duration });
}

// ── ApiError ──

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

// ── Fetch helpers ──

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  options?: { signal?: AbortSignal; timeout?: number }
): Promise<T> {
  const start = performance.now();
  const shortUrl = url.replace(/^\/api/, "");

  log("api", `${method} ${shortUrl}`, "Sending request...");

  try {
    const controller = new AbortController();
    const timeoutMs = options?.timeout ?? 30_000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: options?.signal ?? controller.signal,
    });

    clearTimeout(timer);
    const duration = Math.round(performance.now() - start);

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const errBody = await res.json();
        const raw = errBody.detail ?? errBody.message ?? detail;
        // FastAPI sometimes returns structured detail objects (e.g. quality gate
        // rejections return { message, reason }). Unwrap to a readable string.
        if (typeof raw === "string") {
          detail = raw;
        } else if (raw && typeof raw === "object") {
          detail = raw.message ?? raw.detail ?? raw.reason ?? JSON.stringify(raw);
        }
      } catch {
        // ignore parse errors
      }
      log("error", `${method} ${shortUrl} failed`, detail, res.status, duration);
      throw new ApiError(res.status, detail);
    }

    const data = (await res.json()) as T;
    log("api", `${method} ${shortUrl}`, `Completed`, res.status, duration);
    return data;
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    if (err instanceof ApiError) throw err;
    const msg = err instanceof Error ? err.message : "Unknown error";
    log("error", `${method} ${shortUrl} failed`, msg, 0, duration);
    throw err;
  }
}

export function get<T>(url: string, signal?: AbortSignal): Promise<T> {
  return request<T>("GET", url, undefined, { signal });
}

export function post<T>(
  url: string,
  body: unknown,
  options?: { signal?: AbortSignal; timeout?: number }
): Promise<T> {
  return request<T>("POST", url, body, options);
}
