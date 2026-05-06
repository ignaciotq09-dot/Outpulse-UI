"use client";

import { useState } from "react";
import { Globe, ArrowRight, Loader2, Users, Lock, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

const MIN_LEADS = 1;
const MAX_LEADS = 100;
const DEFAULT_LEADS = 50;
const MIN_FIELDS = 0;
const MAX_FIELDS = 10;
const DEFAULT_FIELDS = 5;

// MIRROR: app/services/websets.py DEFAULT_ENRICHMENTS — keep order in sync.
// Backend slices this list positionally by `field_count`, so depth=N enables fields 1..N.
const ENRICHMENT_FIELD_ORDER: string[] = [
  "Founder/CEO full name",
  "Founder/CEO direct personal email",
  "General company contact email",
  "Company main phone number",
  "Company LinkedIn URL",
  "Founder/CEO personal LinkedIn URL",
  "Approximate employee count",
  "City and state of HQ",
  "Year founded",
  "Total funding raised + most recent round",
];

export function UrlInputForm({
  onSubmit,
  isLoading,
  isLocked = false,
}: {
  onSubmit: (url: string, candidateCount: number, fieldCount: number) => void;
  isLoading: boolean;
  isLocked?: boolean;
}) {
  const disabled = isLoading || isLocked;
  const [url, setUrl] = useState("");
  const [candidateCount, setCandidateCount] = useState(DEFAULT_LEADS);
  const [fieldCount, setFieldCount] = useState(DEFAULT_FIELDS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || disabled) return;
    onSubmit(url.trim(), candidateCount, fieldCount);
  };

  const leadFillPercent =
    ((candidateCount - MIN_LEADS) / (MAX_LEADS - MIN_LEADS)) * 100;
  const fieldFillPercent =
    ((fieldCount - MIN_FIELDS) / (MAX_FIELDS - MIN_FIELDS)) * 100;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-8 text-center">
        <h1 className="gradient-text text-3xl font-bold tracking-tight sm:text-4xl">
          Find Your Ideal Customers
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Enter your company URL and we will discover, score, and rank your best-fit leads.
        </p>
      </div>

      {isLocked && !isLoading && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-amber-400/10 px-4 py-3 ring-1 ring-amber-400/20">
          <Lock className="size-4 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-200">
            A pipeline is already running. Wait for it to finish before starting another one.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* URL input */}
        <div className="relative rounded-xl bg-gradient-to-r from-[oklch(0.55_0.25_280)] to-[oklch(0.65_0.22_250)] p-[1px]">
          <div className="flex items-center gap-2 rounded-[11px] bg-background px-4 py-2">
            <Globe className="size-5 text-muted-foreground shrink-0" />
            <input
              type="url"
              placeholder="https://your-company.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={disabled}
              className="flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
              required
            />
            <Button
              type="submit"
              disabled={disabled || !url.trim()}
              className="bg-gradient-to-r from-[oklch(0.55_0.25_280)] to-[oklch(0.65_0.22_250)] text-white hover:opacity-90 gap-2"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Review ICP
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Lead count slider */}
        <div className="rounded-xl ring-1 ring-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <label htmlFor="candidate-count" className="text-sm font-medium text-foreground">
                Number of leads
              </label>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="gradient-text-primary tabular-nums text-2xl font-bold">
                {candidateCount}
              </span>
              <span className="text-xs text-muted-foreground">leads</span>
            </div>
          </div>

          <div className="relative">
            <input
              id="candidate-count"
              type="range"
              min={MIN_LEADS}
              max={MAX_LEADS}
              value={candidateCount}
              onChange={(e) => setCandidateCount(Number(e.target.value))}
              disabled={disabled}
              className="lead-slider w-full"
              aria-label="Number of leads to discover"
              style={{
                background: `linear-gradient(to right, oklch(0.65 0.22 265) 0%, oklch(0.55 0.25 280) ${leadFillPercent}%, oklch(1 0 0 / 8%) ${leadFillPercent}%, oklch(1 0 0 / 8%) 100%)`,
              }}
            />
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>{MIN_LEADS}</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>{MAX_LEADS}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            More leads = longer runtime. Start with 50 for a production-sized MVP run.
          </p>
        </div>

        {/* Enrichment field count slider */}
        <div className="rounded-xl ring-1 ring-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListChecks className="size-4 text-muted-foreground" />
              <label htmlFor="field-count" className="text-sm font-medium text-foreground">
                Enrichment depth
              </label>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="gradient-text-primary tabular-nums text-2xl font-bold">
                {fieldCount}
              </span>
              <span className="text-xs text-muted-foreground">fields</span>
            </div>
          </div>

          <div className="relative">
            <input
              id="field-count"
              type="range"
              min={MIN_FIELDS}
              max={MAX_FIELDS}
              value={fieldCount}
              onChange={(e) => setFieldCount(Number(e.target.value))}
              disabled={disabled}
              className="lead-slider w-full"
              aria-label="Number of enrichment fields to request"
              style={{
                background: `linear-gradient(to right, oklch(0.65 0.22 265) 0%, oklch(0.55 0.25 280) ${fieldFillPercent}%, oklch(1 0 0 / 8%) ${fieldFillPercent}%, oklch(1 0 0 / 8%) 100%)`,
              }}
            />
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>{MIN_FIELDS}</span>
              <span>2</span>
              <span>5</span>
              <span>8</span>
              <span>{MAX_FIELDS}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Controls how many backend enrichment fields are requested. Exact field selection
            needs a backend API update.
          </p>

          <details className="group rounded-lg bg-white/[0.02] px-3 py-2 ring-1 ring-white/[0.05] open:bg-white/[0.04]">
            <summary className="flex cursor-pointer items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors">
              <span>Which fields are included at depth {fieldCount}?</span>
              <span className="text-[10px] opacity-60 group-open:hidden">show</span>
              <span className="text-[10px] opacity-60 hidden group-open:inline">hide</span>
            </summary>
            <ol className="mt-2 space-y-1 text-xs">
              {ENRICHMENT_FIELD_ORDER.map((label, i) => {
                const enabled = i < fieldCount;
                return (
                  <li
                    key={label}
                    className={`flex items-start gap-2 tabular-nums ${
                      enabled ? "text-foreground" : "text-muted-foreground/50"
                    }`}
                  >
                    <span className="w-5 shrink-0 text-right">{i + 1}.</span>
                    <span className={enabled ? "" : "line-through"}>{label}</span>
                  </li>
                );
              })}
            </ol>
          </details>
        </div>
      </form>

      <style jsx global>{`
        .lead-slider {
          appearance: none;
          -webkit-appearance: none;
          height: 6px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
        }
        .lead-slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .lead-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 0 2px oklch(0.65 0.22 265), 0 0 12px oklch(0.65 0.22 265 / 0.4);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .lead-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 2px oklch(0.65 0.22 265), 0 0 16px oklch(0.65 0.22 265 / 0.6);
        }
        .lead-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid oklch(0.65 0.22 265);
          box-shadow: 0 0 12px oklch(0.65 0.22 265 / 0.4);
        }
      `}</style>
    </div>
  );
}
