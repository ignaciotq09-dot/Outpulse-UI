"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLeads } from "@/hooks/use-leads";
import { LeadStatsBar } from "@/components/leads/lead-stats-bar";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadDetailDrawer } from "@/components/leads/lead-detail-drawer";
import { LeadsLoading } from "@/components/leads/leads-loading";
import type { LeadRead } from "@/lib/types";
import { AlertCircle } from "lucide-react";

export function LeadsContent() {
  const searchParams = useSearchParams();
  const icpId = searchParams.get("icp_id");
  const { data, isLoading, error } = useLeads(icpId);
  const [selectedLead, setSelectedLead] = useState<LeadRead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelect = (lead: LeadRead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  if (!icpId) {
    return (
      <div className="mx-auto max-w-5xl flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-10 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-foreground">No ICP Selected</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Run a pipeline first to generate leads, or select an ICP from your runs.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="gradient-text text-2xl font-bold tracking-tight">
          Leads
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Scored and ranked leads for your ICP
        </p>
      </div>

      {isLoading ? (
        <LeadsLoading />
      ) : error ? (
        <div className="rounded-xl bg-red-400/10 px-6 py-4 ring-1 ring-red-400/20">
          <p className="text-sm text-red-400">
            {error instanceof Error ? error.message : "Failed to load leads"}
          </p>
        </div>
      ) : data ? (
        <div className="space-y-6 animate-fade-in-up">
          <LeadStatsBar leads={data.leads} />
          <LeadsTable leads={data.leads} onSelect={handleSelect} />
          <p className="text-xs text-muted-foreground text-center tabular-nums">
            Showing {data.leads.length} of {data.total} leads
          </p>
        </div>
      ) : null}

      <LeadDetailDrawer
        lead={selectedLead}
        icpId={icpId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
