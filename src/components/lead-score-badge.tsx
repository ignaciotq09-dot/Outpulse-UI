import { cn } from "@/lib/utils";

interface LeadScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

function getScoreClasses(score: number) {
  if (score >= 90)
    return "bg-[hsl(150_50%_55%/0.15)] border-[hsl(150_50%_55%/0.4)] text-[hsl(150_50%_55%)]";
  if (score >= 80)
    return "bg-[hsl(235_65%_58%/0.15)] border-[hsl(235_65%_58%/0.4)] text-[hsl(235_65%_58%)]";
  if (score >= 70)
    return "bg-[hsl(38_95%_58%/0.15)] border-[hsl(38_95%_58%/0.4)] text-[hsl(38_95%_58%)]";
  return "bg-muted border-border text-muted-foreground";
}

export function LeadScoreBadge({ score, size = "md" }: LeadScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-mono font-medium",
        getScoreClasses(score),
        size === "sm" && "h-6 w-8 text-xs",
        size === "md" && "h-7 w-10 text-sm",
        size === "lg" && "h-9 w-12 text-base"
      )}
    >
      {score}
    </span>
  );
}
