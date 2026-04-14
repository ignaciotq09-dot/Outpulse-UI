import { getDimensionStyle } from "@/lib/dimensions";
import type { ICPDimension } from "@/types";
import { cn } from "@/lib/utils";

interface FitSignalBadgeProps {
  label: string;
  dimension: ICPDimension;
}

export function FitSignalBadge({ label, dimension }: FitSignalBadgeProps) {
  const style = getDimensionStyle(dimension);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
        style.bg,
        style.text,
        style.border
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {label}
    </span>
  );
}
