const BACKEND_URL = "https://outpulse-production.up.railway.app";

export const maxDuration = 300; // 5 minutes max for pipeline

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const apiKey = process.env.OUTPULSE_API_KEY;
  if (apiKey) headers["X-API-Key"] = apiKey;
  return headers;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const url = new URL(request.url);
  const target = `${BACKEND_URL}/${path.join("/")}${url.search}`;

  const res = await fetch(target, { headers: buildHeaders() });

  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const body = await request.text();
  const target = `${BACKEND_URL}/${path.join("/")}`;

  const res = await fetch(target, {
    method: "POST",
    headers: buildHeaders(),
    body,
  });

  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
  });
}
