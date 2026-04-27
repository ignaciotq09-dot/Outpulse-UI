#!/usr/bin/env bash
# scripts/smoke-test.sh — Live smoke tests for the /api/[...path] proxy.
#
# Verifies the security hardening from PR review:
#   S1  path allowlist rejects unknown routes
#   S2  missing OUTPULSE_API_KEY returns 500
#   S3  upstream errors are sanitized to {detail}
#
# Usage:
#   scripts/smoke-test.sh                          # tests against http://localhost:3000
#   scripts/smoke-test.sh https://outpulse-ui.vercel.app
#
# Requires: curl, jq (brew install jq) — falls back to grep if jq is missing.
#
# The S2 test only runs against localhost because it has to restart the
# dev server without the env var. Skip it on remote targets.

set -u

BASE_URL="${1:-http://localhost:3000}"
PASS=0
FAIL=0

# ──────────────────────────────────────────────────────────────────────────
# helpers

c_red()   { printf "\033[31m%s\033[0m" "$1"; }
c_green() { printf "\033[32m%s\033[0m" "$1"; }
c_dim()   { printf "\033[2m%s\033[0m" "$1"; }

assert_status() {
  local name="$1"; local expected="$2"; local got="$3"; local body="${4:-}"
  if [ "$got" = "$expected" ]; then
    echo "  $(c_green "✓") $name (HTTP $got)"
    PASS=$((PASS+1))
  else
    echo "  $(c_red "✗") $name — expected $expected, got $got"
    [ -n "$body" ] && echo "    body: $(c_dim "$body")"
    FAIL=$((FAIL+1))
  fi
}

assert_body_contains() {
  local name="$1"; local needle="$2"; local body="$3"
  if echo "$body" | grep -q "$needle"; then
    echo "  $(c_green "✓") $name"
    PASS=$((PASS+1))
  else
    echo "  $(c_red "✗") $name — expected body to contain: $needle"
    echo "    got: $(c_dim "$body")"
    FAIL=$((FAIL+1))
  fi
}

# Fixed body sink so subshells (status=$(http_get ...)) don't lose the path.
TMPBODY="$(mktemp -t outpulse-smoke.XXXXXX)"
trap 'rm -f "$TMPBODY"' EXIT

# Returns the HTTP status code; writes the response body to $TMPBODY.
http_get() {
  local url="$1"
  curl -s -o "$TMPBODY" -w "%{http_code}" "$url"
}

http_post_json() {
  local url="$1"; local body="$2"; local timeout="${3:-30}"
  curl -s -o "$TMPBODY" -w "%{http_code}" \
    -X POST "$url" \
    -H "Content-Type: application/json" \
    -d "$body" \
    --max-time "$timeout"
}

echo ""
echo "Outpulse UI smoke test"
echo "Target: $BASE_URL"
echo ""

# ──────────────────────────────────────────────────────────────────────────
# S1 — Path allowlist

echo "S1 — Path allowlist"

status=$(http_get "$BASE_URL/api/admin")
assert_status "GET /api/admin returns 404" "404" "$status" "$(cat "$TMPBODY")"
assert_body_contains "  body matches {detail:'Not found.'}" '"detail":"Not found."' "$(cat "$TMPBODY")"

status=$(http_get "$BASE_URL/api/secret")
assert_status "GET /api/secret returns 404" "404" "$status"

status=$(http_get "$BASE_URL/api/admin/users")
assert_status "GET /api/admin/users (path traversal) returns 404" "404" "$status"

status=$(http_get "$BASE_URL/api/health")
assert_status "GET /api/health (allowlisted) returns 200" "200" "$status"

status=$(http_get "$BASE_URL/api/runs?limit=1")
assert_status "GET /api/runs (allowlisted) returns 200" "200" "$status"

# ──────────────────────────────────────────────────────────────────────────
# S3 — Sanitized upstream errors

echo ""
echo "S3 — Upstream errors are sanitized"

status=$(http_post_json "$BASE_URL/api/pipeline" '{"url":"https://gmail.com"}' 30)
assert_status "POST /api/pipeline (B2C URL) returns 422" "422" "$status"
body=$(cat "$TMPBODY")
assert_body_contains "  response has {detail}" '"detail"' "$body"
# Sanitized response should NOT contain Python tracebacks, IPs, internal hints
if echo "$body" | grep -qE 'Traceback|/Users/|/app/|File ".*"'; then
  echo "  $(c_red "✗") response leaks internals (stack trace / paths)"
  FAIL=$((FAIL+1))
else
  echo "  $(c_green "✓") response does not leak internals"
  PASS=$((PASS+1))
fi

# ──────────────────────────────────────────────────────────────────────────
# S2 — Missing API key returns 500 (localhost only)

if [ "$BASE_URL" = "http://localhost:3000" ] && [ -f .env.local ]; then
  echo ""
  echo "S2 — Missing API key returns 500 (restarts dev server)"
  echo "  $(c_dim "stopping dev server...")"
  pkill -f "next dev" >/dev/null 2>&1 || true
  sleep 2
  mv .env.local .env.local.smoke.bak
  echo "  $(c_dim "starting dev server WITHOUT OUTPULSE_API_KEY...")"
  nohup env -u OUTPULSE_API_KEY npm run dev >/tmp/smoke-no-key.log 2>&1 &
  DEV_PID=$!
  sleep 6

  status=$(http_get "$BASE_URL/api/health")
  assert_status "GET /api/health returns 500" "500" "$status"
  assert_body_contains "  body says 'Server misconfiguration'" "Server misconfiguration" "$(cat "$TMPBODY")"

  echo "  $(c_dim "restoring .env.local + restarting dev server...")"
  pkill -f "next dev" >/dev/null 2>&1 || true
  sleep 2
  mv .env.local.smoke.bak .env.local
  nohup npm run dev >/tmp/smoke-restored.log 2>&1 &
  sleep 5
else
  echo ""
  echo "S2 — Skipped (only runs against localhost with .env.local)"
fi

# ──────────────────────────────────────────────────────────────────────────
# Summary

echo ""
echo "──────────────────────────────────────────────"
if [ "$FAIL" -eq 0 ]; then
  echo "$(c_green "PASS") $PASS checks ✓"
  exit 0
else
  echo "$(c_red "FAIL") $FAIL of $((PASS+FAIL)) checks failed"
  exit 1
fi
