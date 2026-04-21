"use client";

import { Users, Star, TrendingUp, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import type { LeadRead } from "@/lib/types";

export function LeadStatsBar({ leads }: { leads: LeadRead[] }) {
  const total = leads.length;
  const strong = leads.filter((l) => l.verdict === "strong").length;
  const avgScore =
    total > 0 ? Math.round(leads.reduce((s, l) => s + l.fit_score, 0) / total) : 0;
  const excluded = leads.filter((l) => l.verdict === "exclude").length;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard label="Total Leads" value={total} icon={Users} />
      <StatCard label="Strong Matches" value={strong} icon={Star} />
      <StatCard label="Avg. Score" value={avgScore} icon={TrendingUp} />
      <StatCard label="Excluded" value={excluded} icon={AlertCircle} />
    </div>
  );
}
