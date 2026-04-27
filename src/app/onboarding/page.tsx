"use client";

import { useRouter } from "next/navigation";
import { UrlInputForm } from "@/components/onboarding/url-input-form";
import { PipelineProgress } from "@/components/onboarding/pipeline-progress";
import { IcpReviewCard } from "@/components/onboarding/icp-review-card";
import { usePipeline } from "@/hooks/use-pipeline";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { steps, result, error, isRunning, elapsed, start, reset } =
    usePipeline();

  const hasStarted = isRunning || result !== null || error !== null;

  return (
    <div className="mx-auto max-w-3xl py-8 md:py-16">
      {!hasStarted && (
        <div className="animate-fade-in-up">
          <UrlInputForm
            onSubmit={(url, candidateCount) => start(url, candidateCount)}
            isLoading={isRunning}
            isLocked={isRunning}
          />
        </div>
      )}

      {isRunning && (
        <div className="animate-fade-in-up">
          <PipelineProgress steps={steps} elapsed={elapsed} />
        </div>
      )}

      {error && (
        <div className="space-y-4 text-center animate-fade-in-up">
          <div className="rounded-xl bg-red-400/10 px-6 py-4 ring-1 ring-red-400/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw className="size-4" />
            Try Again
          </Button>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center">
            <h2 className="gradient-text text-xl font-bold">
              Pipeline Complete
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Found {result.ranked_leads.length} leads in{" "}
              {Math.round(elapsed)}s
            </p>
          </div>

          <IcpReviewCard
            icp={{
              company_name: result.customer_id,
              company_url: "",
              offering: "",
              target_customer_summary: result.query_text,
              target_industries: [],
              target_company_size: "",
              target_roles: [],
              target_geography: [],
              buying_signals: [],
              differentiators: [],
              exclusions: [],
              confidence: 0.9,
              supporting_evidence: [],
            }}
          />

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="size-4" />
              New Pipeline
            </Button>
            <Button
              className="gap-2 bg-gradient-to-r from-[oklch(0.55_0.25_280)] to-[oklch(0.65_0.22_250)] text-white hover:opacity-90"
              onClick={() =>
                router.push(
                  `/leads?icp_id=${result.icp_blueprint_id}`
                )
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
