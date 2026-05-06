"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check, Loader2, RotateCcw, Search, Sparkles } from "lucide-react";

import { UrlInputForm } from "@/components/onboarding/url-input-form";
import { PipelineProgress } from "@/components/onboarding/pipeline-progress";
import { IcpReviewCard } from "@/components/onboarding/icp-review-card";
import { Button } from "@/components/ui/button";
import { usePipeline } from "@/hooks/use-pipeline";
import { ingestUrl } from "@/lib/api/ingest";
import { ApiError } from "@/lib/api-client";
import type { IngestResponse } from "@/lib/types";

interface PendingRun {
  url: string;
  candidateCount: number;
  fieldCount: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { steps, result, error, isRunning, elapsed, start, reset } =
    usePipeline();

  const [ingestData, setIngestData] = useState<IngestResponse | null>(null);
  const [pending, setPending] = useState<PendingRun | null>(null);

  const ingestMutation = useMutation<IngestResponse, Error, string>({
    mutationFn: (url) => ingestUrl(url),
    onSuccess: (data) => setIngestData(data),
  });

  // When a search starts, drop the cached ingest review state so it doesn't
  // linger after reset.
  useEffect(() => {
    if (isRunning) {
      ingestMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // On fresh /onboarding mount, drop any stale terminal state from a prior
  // visit so navigating here from Dashboard / Sidebar / "New Pipeline" always
  // shows the URL form, not the previous run's "Pipeline Complete" screen.
  // Skipped if a run is currently in flight.
  useEffect(() => {
    if (!isRunning && (result || error)) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-route to leads only when this page has observed an active search.
  // The completed result lives in the global pipeline context; without this
  // guard, returning to /onboarding after viewing leads would immediately
  // redirect back to the previous run.
  const navigatedForRef = useRef<string | null>(null);
  const sawRunningRef = useRef(false);
  useEffect(() => {
    if (isRunning) {
      sawRunningRef.current = true;
    }
  }, [isRunning]);

  useEffect(() => {
    if (
      sawRunningRef.current &&
      result?.icp_blueprint_id &&
      navigatedForRef.current !== result.icp_blueprint_id
    ) {
      navigatedForRef.current = result.icp_blueprint_id;
      sawRunningRef.current = false;
      router.push(`/leads?icp_id=${result.icp_blueprint_id}`);
    }
  }, [result, router]);

  const ingestError = ingestMutation.error
    ? ingestMutation.error instanceof ApiError
      ? ingestMutation.error.detail
      : ingestMutation.error.message
    : null;

  const handleFormSubmit = (
    url: string,
    candidateCount: number,
    fieldCount: number,
  ) => {
    setPending({ url, candidateCount, fieldCount });
    setIngestData(null);
    ingestMutation.mutate(url);
  };

  const handleApprove = () => {
    if (!pending) return;
    start(pending.url, pending.candidateCount, pending.fieldCount);
  };

  const handleTryDifferentUrl = () => {
    setIngestData(null);
    setPending(null);
    ingestMutation.reset();
  };

  const handleReset = () => {
    reset();
    handleTryDifferentUrl();
    navigatedForRef.current = null;
  };

  const phase: "idle" | "ingesting" | "review" | "searching" | "error" | "complete" =
    result
      ? "complete"
      : isRunning
        ? "searching"
        : error || ingestError
          ? "error"
          : ingestMutation.isPending
            ? "ingesting"
            : ingestData
              ? "review"
              : "idle";

  return (
    <div className="mx-auto max-w-3xl py-8 md:py-16">
      {phase === "idle" && (
        <div className="animate-fade-in-up">
          <UrlInputForm
            onSubmit={handleFormSubmit}
            isLoading={false}
            isLocked={isRunning}
          />
        </div>
      )}

      {phase === "ingesting" && (
        <div className="animate-fade-in-up flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex items-center gap-3 rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_280)]/20 to-[oklch(0.65_0.22_250)]/20 px-4 py-2 ring-1 ring-[oklch(0.65_0.22_250)]/30">
            <Loader2 className="size-4 animate-spin text-[oklch(0.65_0.22_250)]" />
            <span className="text-sm text-[oklch(0.65_0.22_250)]">
              Reading your website…
            </span>
          </div>
          <p className="max-w-sm text-xs text-muted-foreground">
            Extracting your offering and inferring an Ideal Customer Profile. This
            usually takes 5–15 seconds.
          </p>
        </div>
      )}

      {phase === "review" && ingestData && pending && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 ring-1 ring-white/[0.08]">
              <Sparkles className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Review the ICP we inferred from {pending.url}
              </span>
            </div>
            <h2 className="gradient-text mt-3 text-xl font-bold">
              Does this look right?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Approve to search for {pending.candidateCount} matching companies, or try a different URL.
            </p>
          </div>

          <IcpReviewCard icp={ingestData.icp_blueprint} />

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleTryDifferentUrl}
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              Try a different URL
            </Button>
            <Button
              onClick={handleApprove}
              className="gap-2 bg-gradient-to-r from-[oklch(0.55_0.25_280)] to-[oklch(0.65_0.22_250)] text-white hover:opacity-90"
            >
              <Search className="size-4" />
              Approve & search
            </Button>
          </div>
        </div>
      )}

      {phase === "searching" && (
        <div className="animate-fade-in-up">
          <PipelineProgress steps={steps} elapsed={elapsed} />
        </div>
      )}

      {phase === "error" && (
        <div className="space-y-4 text-center animate-fade-in-up">
          <div className="rounded-xl bg-red-400/10 px-6 py-4 ring-1 ring-red-400/20">
            <p className="text-sm text-red-400">{error ?? ingestError}</p>
          </div>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="size-4" />
            Try Again
          </Button>
        </div>
      )}

      {phase === "complete" && result && (
        <div className="space-y-6 animate-fade-in-up text-center">
          <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/30">
            <Check className="size-4 text-emerald-400" />
          </div>
          <h2 className="gradient-text text-xl font-bold">Pipeline Complete</h2>
          <p className="text-sm text-muted-foreground">
            Finished in {Math.round(elapsed)}s. Taking you to leads…
          </p>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="size-4" />
              New Pipeline
            </Button>
            <Button
              className="gap-2 bg-gradient-to-r from-[oklch(0.55_0.25_280)] to-[oklch(0.65_0.22_250)] text-white hover:opacity-90"
              onClick={() =>
                router.push(`/leads?icp_id=${result.icp_blueprint_id}`)
              }
            >
              View Leads
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
