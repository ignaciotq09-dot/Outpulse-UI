import { cn } from "@/lib/utils";
import { getScoreColor, getScoreBgColor } from "@/lib/constants";

export function FitScoreBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
        getScoreColor(score),
        getScoreBgColor(score),
        className
      )}
    >
      {score}
    </span>
  );
}
