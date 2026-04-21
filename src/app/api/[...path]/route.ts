// Server-side proxy to the Outpulse backend.
// Injects the X-API-Key header (never exposed to the browser),
// allowlists known endpoints, and sanitizes upstream errors.

const DEFAULT_BACKEND = "https://outpulse-production.up.railway.app";
const BACKEND_URL = process.env.OUTPULSE_BACKEND_URL || DEFAULT_BACKEND;

// Vercel Pro/Enterprise allows up to 300s; on Hobby this is capped at 60s.
// The /pipeline endpoint can take 60-180s — Hobby plans will time out.
export const maxDuration = 300;

// Allowlist: only these top-level path segments are allowed through the proxy.
// Anything else returns 404 to prevent probing internal/admin endpoints.
const ALLOWED_PREFIXES = new Set([
  "pipeline",
  "leads",
  "runs",
  "icp",
  "health",
]);

function isAllowed(path: string[]): boolean {
  if (path.length === 0) return false;
  return ALLOWED_PREFIXES.has(path[0]);
}

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ detail: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildHeaders(): { headers: HeadersInit } | { error: Response } {
  const apiKey = process.env.OUTPULSE_API_KEY;
  if (!apiKey) {
    // S2: never silently proceed without the key.
    return {
      error: jsonError(
        500,
        "Server misconfiguration: OUTPULSE_API_KEY is not set.",
      ),
    };
  }
  return {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
  };
}

// S3: only forward `detail` / `message` from upstream errors. Strip everything
// else so backend stack traces, internal IPs, etc. never reach the browser.
async function sanitizedErrorResponse(res: Response): Promise<Response> {
  let detail: unknown = "Upstream request failed.";
  try {
    const body = await res.json();
    if (body && typeof body === "object") {
      detail = body.detail ?? body.message ?? detail;
    }
  } catch {
    // Non-JSON body — discard it; do not forward raw text.
  }
  return new Response(JSON.stringify({ detail }), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

async function forward(
  method: "GET" | "POST",
  request: Request,
  path: string[],
): Promise<Response> {
  if (!isAllowed(path)) {
    return jsonError(404, "Not found.");
  }

  const headerResult = buildHeaders();
  if ("error" in headerResult) return headerResult.error;

  const url = new URL(request.url);
  const target = `${BACKEND_URL}/${path.join("/")}${
    method === "GET" ? url.search : ""
  }`;

  const init: RequestInit = {
    method,
    headers: headerResult.headers,
  };
  if (method === "POST") {
    init.body = await request.text();
  }

  const res = await fetch(target, init);

  if (!res.ok) {
    return sanitizedErrorResponse(res);
  }

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forward("GET", request, path);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forward("POST", request, path);
}
