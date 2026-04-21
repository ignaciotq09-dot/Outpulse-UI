"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { GradientPill } from "@/components/ui/gradient-pill";
import { formatDomain } from "@/lib/format";
import type { LeadRead } from "@/lib/types";

type SortKey = "fit_score" | "company_title" | "rank";
type SortDir = "asc" | "desc";

// Defined at module scope (React 19 forbids creating components during render).
function SortButton({
  column,
  currentSort,
  onSort,
  children,
}: {
  column: SortKey;
  currentSort: SortKey;
  onSort: (column: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="xs"
      className="gap-1 -ml-2 text-foreground"
      onClick={() => onSort(column)}
      data-active={currentSort === column}
    >
      {children}
      <ArrowUpDown className="size-3" />
    </Button>
  );
}

export function LeadsTable({
  leads,
  onSelect,
}: {
  leads: LeadRead[];
  onSelect: (lead: LeadRead) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("fit_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "fit_score") cmp = a.fit_score - b.fit_score;
      else if (sortKey === "company_title")
        cmp = a.company_title.localeCompare(b.company_title);
      else if (sortKey === "rank") cmp = (a.rank ?? 999) - (b.rank ?? 999);
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [leads, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="ring-1 ring-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06] hover:bg-transparent">
            <TableHead className="w-12">#</TableHead>
            <TableHead>
              <SortButton column="company_title" currentSort={sortKey} onSort={toggleSort}>
                Company
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton column="fit_score" currentSort={sortKey} onSort={toggleSort}>
                Score
              </SortButton>
            </TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="hidden md:table-cell">Signals</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((lead, i) => (
            <TableRow
              key={lead.id}
              className="group cursor-pointer border-white/[0.04] hover:bg-white/[0.03] transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 30}ms` }}
              onClick={() => onSelect(lead)}
            >
              <TableCell className="text-muted-foreground tabular-nums">
                {lead.rank ?? i + 1}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{lead.company_title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDomain(lead.url)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <CircularProgress value={lead.fit_score} size={36} strokeWidth={3} />
              </TableCell>
              <TableCell>
                <GradientPill tier={lead.tier} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-xs text-emerald-400">
                  {lead.matched_signals.length} matched
                </span>
              </TableCell>
              <TableCell>
                <a
                  href={lead.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
