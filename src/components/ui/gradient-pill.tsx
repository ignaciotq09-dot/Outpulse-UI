import { cn } from "@/lib/utils";
import { TIER_CONFIG } from "@/lib/constants";

export function GradientPill({
  tier,
  className,
}: {
  tier: string;
  className?: string;
}) {
  const config = TIER_CONFIG[tier] ?? { label: tier, color: "text-gray-400", bg: "bg-gray-400/15" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
