"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CircularProgress } from "@/components/ui/circular-progress";
import { GradientPill } from "@/components/ui/gradient-pill";
import { SignalList } from "./signal-list";
import { useLeadDetail } from "@/hooks/use-lead-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDomain } from "@/lib/format";
import {
  Mail,
  Phone,
  MapPin,
  Users,
  User,
  ExternalLink,
} from "lucide-react";
import type { LeadRead } from "@/lib/types";

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="size-3.5 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-foreground truncate">{String(value)}</span>
    </div>
  );
}

export function LeadDetailDrawer({
  lead,
  icpId,
  open,
  onOpenChange,
}: {
  lead: LeadRead | null;
  icpId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: detail, isLoading } = useLeadDetail(
    open ? icpId : null,
    open ? lead?.id ?? null : null
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        {lead && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                {lead.company_title}
                <a
                  href={lead.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-4" />
                </a>
              </SheetTitle>
              <SheetDescription>{formatDomain(lead.url)}</SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-6">
              {/* Score + Tier */}
              <div className="flex items-center gap-4">
                <CircularProgress value={lead.fit_score} size={72} strokeWidth={5} />
                <div>
                  <GradientPill tier={lead.tier} />
                  <p className="mt-1 text-xs text-muted-foreground capitalize">
                    Verdict: {lead.verdict}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06]">
                <p className="text-sm text-foreground">{lead.summary}</p>
              </div>

              {/* Reasoning */}
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                detail?.reasoning && (
                  <div>
                    <h4 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Reasoning
                    </h4>
                    <p className="text-sm text-foreground">{detail.reasoning}</p>
                  </div>
                )
              )}

              {/* Contact Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact Info
                </h4>
                <div className="grid gap-2">
                  <ContactItem icon={Mail} label="Email" value={lead.email} />
                  <ContactItem icon={Mail} label="Direct" value={lead.direct_email} />
                  <ContactItem icon={User} label="CEO" value={lead.ceo_name} />
                  <ContactItem icon={Phone} label="Phone" value={lead.phone} />
                  <ContactItem icon={MapPin} label="HQ" value={lead.headquarters} />
                  <ContactItem icon={Users} label="Employees" value={lead.employee_count} />
                </div>
              </div>

              {/* Signals */}
              <SignalList
                matched={lead.matched_signals}
                missing={lead.missing_signals}
                risks={lead.risk_factors}
              />

              {/* Enrichments */}
              {detail?.enrichments &&
                Object.keys(detail.enrichments).length > 0 && (
                  <div>
                    <h4 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Enrichments
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(detail.enrichments).map(([key, values]) => (
                        <div key={key}>
                          <p className="text-xs font-medium text-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </p>
                          <ul className="mt-1 space-y-0.5">
                            {values.map((v, i) => (
                              <li key={i} className="text-xs text-muted-foreground">
                                {v}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
