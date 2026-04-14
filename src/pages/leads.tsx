import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { FitSignalBadge } from "@/components/fit-signal-badge";
import { LeadScoreBadge } from "@/components/lead-score-badge";
import { ProofPackDrawer } from "@/components/proof-pack-drawer";
import { getDimensionStyle, getDimensionLabel } from "@/lib/dimensions";
import { shortRelativeTime } from "@/lib/format";
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  X,
  Minus,
  Download,
  UserPlus,
} from "lucide-react";
import { mockLeads, mockICP } from "@/mock-data";
import { cn } from "@/lib/utils";
import type { Lead, ICPDimension, EmailStatus } from "@/types";

const ALL_DIMENSIONS: ICPDimension[] = [
  "industry",
  "companySize",
  "targetTitles",
  "seniorityLevels",
  "geos",
  "painPoints",
  "techStack",
  "triggers",
  "exclusions",
];

const EMAIL_STATUSES: EmailStatus[] = ["verified", "catch-all", "unknown", "invalid"];

function EmailStatusIcon({ status }: { status?: EmailStatus }) {
  switch (status) {
    case "verified":
      return <Check className="size-3.5 text-[hsl(150_50%_55%)]" />;
    case "catch-all":
      return <AlertTriangle className="size-3.5 text-accent" />;
    case "invalid":
      return <X className="size-3.5 text-destructive" />;
    default:
      return <Minus className="size-3.5 text-muted-foreground" />;
  }
}

type SortOption = "score-desc" | "score-asc" | "recent" | "company";

export default function Leads() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("score-desc");
  const [activeDimensions, setActiveDimensions] = useState<Set<ICPDimension>>(new Set());
  const [activeEmailStatuses, setActiveEmailStatuses] = useState<Set<EmailStatus>>(new Set());
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");

  function toggleDimension(d: ICPDimension) {
    setActiveDimensions((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }

  function toggleEmailStatus(s: EmailStatus) {
    setActiveEmailStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function clearAll() {
    setActiveDimensions(new Set());
    setActiveEmailStatuses(new Set());
    setMinScore("");
    setMaxScore("");
  }

  const dimensionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of ALL_DIMENSIONS) {
      counts[d] = mockLeads.filter((l) => l.fitSignals.some((s) => s.dimension === d)).length;
    }
    return counts;
  }, []);

  const filteredLeads = useMemo(() => {
    let leads = [...mockLeads];

    if (activeDimensions.size > 0) {
      leads = leads.filter((l) =>
        l.fitSignals.some((s) => activeDimensions.has(s.dimension))
      );
    }

    if (activeEmailStatuses.size > 0) {
      leads = leads.filter((l) => l.emailStatus && activeEmailStatuses.has(l.emailStatus));
    }

    const min = minScore ? Number(minScore) : 0;
    const max = maxScore ? Number(maxScore) : 100;
    leads = leads.filter((l) => l.score >= min && l.score <= max);

    switch (sort) {
      case "score-desc":
        leads.sort((a, b) => b.score - a.score);
        break;
      case "score-asc":
        leads.sort((a, b) => a.score - b.score);
        break;
      case "recent":
        leads.sort((a, b) => new Date(b.scoredAt).getTime() - new Date(a.scoredAt).getTime());
        break;
      case "company":
        leads.sort((a, b) => a.company.localeCompare(b.company));
        break;
    }

    return leads;
  }, [activeDimensions, activeEmailStatuses, minScore, maxScore, sort]);

  function openDrawer(lead: Lead) {
    setSelectedLead(lead);
    setDrawerOpen(true);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            to="/icp/mock-icp-1"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to ICP
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-xl font-semibold">
            {filteredLeads.length} leads for {mockICP.sourceCompanyName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score-desc">Score: High to Low</SelectItem>
              <SelectItem value="score-asc">Score: Low to High</SelectItem>
              <SelectItem value="recent">Most recent</SelectItem>
              <SelectItem value="company">Company name</SelectItem>
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger render={<Button variant="secondary" disabled />}>
              <Download className="mr-1 size-4" />
              Export
            </TooltipTrigger>
            <TooltipContent>Coming soon</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button disabled />}>
              <UserPlus className="mr-1 size-4" />
              Add all to campaign
            </TooltipTrigger>
            <TooltipContent>Coming soon</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Filter rail */}
        <aside className="w-60 shrink-0 overflow-y-auto border-r border-border px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Filter by signal
          </p>
          <div className="mt-3 space-y-1">
            {ALL_DIMENSIONS.map((d) => {
              const style = getDimensionStyle(d);
              const active = activeDimensions.has(d);
              return (
                <button
                  key={d}
                  onClick={() => toggleDimension(d)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    active
                      ? cn(style.bg, style.text, "border", style.border)
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className={cn("size-2 rounded-full", style.dot)} />
                  <span className="flex-1 text-left">{getDimensionLabel(d)}</span>
                  <span className="text-xs">{dimensionCounts[d]}</span>
                </button>
              );
            })}
          </div>

          <Separator className="my-4" />

          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Score range
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="h-7 text-xs"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className="h-7 text-xs"
            />
          </div>

          <Separator className="my-4" />

          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email status
          </p>
          <div className="mt-2 space-y-1.5">
            {EMAIL_STATUSES.map((s) => (
              <label
                key={s}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Checkbox
                  checked={activeEmailStatuses.has(s)}
                  onCheckedChange={() => toggleEmailStatus(s)}
                />
                <span className="capitalize">{s === "catch-all" ? "Catch-all" : s}</span>
              </label>
            ))}
          </div>

          <Separator className="my-4" />

          <Button variant="ghost" size="sm" onClick={clearAll} className="w-full">
            Clear all
          </Button>
        </aside>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Company</TableHead>
                <TableHead className="w-[220px]">Contact</TableHead>
                <TableHead className="w-[240px]">Email</TableHead>
                <TableHead className="w-24">Score</TableHead>
                <TableHead>Fit signals</TableHead>
                <TableHead className="w-[104px]">Scored</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="h-11 cursor-pointer hover:bg-muted/50"
                  onClick={() => openDrawer(lead)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${lead.companyDomain}&sz=32`}
                        alt=""
                        className="size-5 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{lead.company}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {lead.companyDomain}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{lead.contactName}</p>
                    <p className="text-xs text-muted-foreground">{lead.contactTitle}</p>
                  </TableCell>
                  <TableCell>
                    {lead.contactEmail ? (
                      <span className="flex items-center gap-1">
                        <span className="font-mono text-xs">{lead.contactEmail}</span>
                        {lead.emailStatus && <EmailStatusIcon status={lead.emailStatus} />}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <LeadScoreBadge score={lead.score} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {lead.fitSignals.slice(0, 3).map((s, i) => (
                        <FitSignalBadge
                          key={i}
                          label={s.label}
                          dimension={s.dimension}
                        />
                      ))}
                      {lead.fitSignals.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{lead.fitSignals.length - 3} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {shortRelativeTime(lead.scoredAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProofPackDrawer
        lead={selectedLead}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
