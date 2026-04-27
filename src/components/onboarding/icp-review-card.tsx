"use client";

import {
  Target,
  Building2,
  Globe2,
  Users,
  TrendingUp,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { ICPBlueprint } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="size-4 text-muted-foreground" />
        {title}
      </div>
      {children}
    </div>
  );
}

function TagList({ items, variant = "secondary" }: { items: string[]; variant?: "secondary" | "outline" | "destructive" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <Badge key={i} variant={variant} className="text-xs">
          {item}
        </Badge>
      ))}
    </div>
  );
}

export function IcpReviewCard({ icp }: { icp: ICPBlueprint }) {
  return (
    <div className="ring-1 ring-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm rounded-xl p-6 space-y-6 animate-fade-in-up">
      <div>
        <h3 className="gradient-text text-lg font-semibold">{icp.company_name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{icp.offering}</p>
      </div>

      <div className="rounded-lg bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06]">
        <p className="text-sm text-foreground">{icp.target_customer_summary}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Section icon={Building2} title="Target Industries">
          <TagList items={icp.target_industries} />
        </Section>

        <Section icon={Users} title="Target Roles">
          <TagList items={icp.target_roles} />
        </Section>

        <Section icon={Globe2} title="Geography">
          <TagList items={icp.target_geography} />
        </Section>

        <Section icon={Target} title="Company Size">
          <p className="text-sm text-muted-foreground">{icp.target_company_size}</p>
        </Section>

        <Section icon={TrendingUp} title="Buying Signals">
          <TagList items={icp.buying_signals} />
        </Section>

        <Section icon={ShieldCheck} title="Differentiators">
          <TagList items={icp.differentiators} variant="outline" />
        </Section>
      </div>

      {icp.exclusions.length > 0 && (
        <Section icon={XCircle} title="Exclusions">
          <TagList items={icp.exclusions} variant="destructive" />
        </Section>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
        <span className="text-xs text-muted-foreground">Confidence</span>
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[oklch(0.55_0.25_280)] to-[oklch(0.65_0.22_250)]"
            style={{ width: `${icp.confidence * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums text-foreground">
          {Math.round(icp.confidence * 100)}%
        </span>
      </div>
    </div>
  );
}
