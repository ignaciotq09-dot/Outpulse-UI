"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLeads } from "@/hooks/use-leads";
import { LeadStatsBar } from "@/components/leads/lead-stats-bar";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadDetailDrawer } from "@/components/leads/lead-detail-drawer";
import { LeadsLoading } from "@/components/leads/leads-loading";
import type { LeadRead } from "@/lib/types";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_PAGE_SIZE = 50;
const PAGE_SIZE_OPTIONS = [50, 100];

export function LeadsContent() {
  const searchParams = useSearchParams();
  const icpId = searchParams.get("icp_id");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [offset, setOffset] = useState(0);
  const { data, isLoading, error } = useLeads(icpId, {
    limit: pageSize,
    offset,
  });
  const [selectedLead, setSelectedLead] = useState<LeadRead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelect = (lead: LeadRead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const total = data?.total ?? 0;
  const shownStart = total === 0 ? 0 : offset + 1;
  const shownEnd = data ? Math.min(offset + data.leads.length, total) : 0;
  const canGoBack = offset > 0;
  const canGoForward = data ? offset + data.leads.length < total : false;

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setOffset(0);
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
          <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent p-3 ring-1 ring-white/[0.08] sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground tabular-nums">
              Showing {shownStart}-{shownEnd} of {total} leads
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Rows</span>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <Button
                  key={size}
                  type="button"
                  size="xs"
                  variant={pageSize === size ? "secondary" : "outline"}
                  onClick={() => handlePageSizeChange(size)}
                >
                  {size}
                </Button>
              ))}

              <div className="ml-1 flex items-center gap-1">
                <Button
                  type="button"
                  size="icon-xs"
                  variant="outline"
                  disabled={!canGoBack}
                  onClick={() => setOffset(Math.max(0, offset - pageSize))}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-3" />
                </Button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="outline"
                  disabled={!canGoForward}
                  onClick={() => setOffset(offset + pageSize)}
                  aria-label="Next page"
                >
                  <ChevronRight className="size-3" />
                </Button>
              </div>
            </div>
          </div>
          <LeadStatsBar leads={data.leads} />
          <LeadsTable leads={data.leads} onSelect={handleSelect} />
          <p className="text-xs text-muted-foreground text-center tabular-nums">
            Page size defaults to 50. Switch to 100 to view a full 100-lead run on one page.
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
