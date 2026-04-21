// ── Score color helpers ──

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-blue-400";
  if (score >= 50) return "text-amber-400";
  if (score >= 30) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-400/15";
  if (score >= 70) return "bg-blue-400/15";
  if (score >= 50) return "bg-amber-400/15";
  if (score >= 30) return "bg-orange-400/15";
  return "bg-red-400/15";
}

export function getScoreRingColor(score: number): string {
  if (score >= 90) return "ring-emerald-400/30";
  if (score >= 70) return "ring-blue-400/30";
  if (score >= 50) return "ring-amber-400/30";
  if (score >= 30) return "ring-orange-400/30";
  return "ring-red-400/30";
}

export function getScoreStrokeColor(score: number): string {
  if (score >= 90) return "#34d399";
  if (score >= 70) return "#60a5fa";
  if (score >= 50) return "#fbbf24";
  if (score >= 30) return "#fb923c";
  return "#f87171";
}

// ── Tier config ──

export const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  strong_match: { label: "Strong Match", color: "text-emerald-400", bg: "bg-emerald-400/15" },
  good_match: { label: "Good Match", color: "text-blue-400", bg: "bg-blue-400/15" },
  moderate_match: { label: "Moderate", color: "text-amber-400", bg: "bg-amber-400/15" },
  weak_match: { label: "Weak Match", color: "text-orange-400", bg: "bg-orange-400/15" },
  no_match: { label: "No Match", color: "text-red-400", bg: "bg-red-400/15" },
};

// ── Verdict config ──

export const VERDICT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  strong: { label: "Strong", color: "text-emerald-400", bg: "bg-emerald-400/15" },
  medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-400/15" },
  weak: { label: "Weak", color: "text-orange-400", bg: "bg-orange-400/15" },
  exclude: { label: "Exclude", color: "text-red-400", bg: "bg-red-400/15" },
};

// ── Pipeline steps ──

export const PIPELINE_STEPS = [
  { id: "ingest", label: "Analyzing Website", description: "Scraping and understanding your company" },
  { id: "icp", label: "Building ICP", description: "Creating ideal customer profile blueprint" },
  { id: "discover", label: "Discovering Leads", description: "Searching for matching companies" },
  { id: "score", label: "Scoring Leads", description: "Evaluating fit for each candidate" },
  { id: "rank", label: "Ranking Results", description: "Ordering leads by relevance" },
] as const;

// ── Pipeline tips ──

export const PIPELINE_TIPS = [
  "The pipeline typically takes 60-180 seconds to complete.",
  "We analyze your website to understand your ideal customer profile.",
  "Leads are scored on a 0-100 scale based on ICP fit.",
  "Strong matches (90+) are auto-approved for outreach.",
  "Each lead includes matched and missing buying signals.",
];
