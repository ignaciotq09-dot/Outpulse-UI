import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";

export type StatCardAccent = "primary" | "blue" | "emerald" | "amber";

const ACCENTS: Record<
  StatCardAccent,
  { iconBg: string; iconColor: string; ring: string }
> = {
  primary: {
    iconBg:
      "bg-gradient-to-br from-[oklch(0.55_0.25_280)]/30 to-[oklch(0.65_0.22_250)]/20",
    iconColor: "text-[oklch(0.75_0.2_265)]",
    ring: "hover:ring-[oklch(0.65_0.22_265)]/30",
  },
  blue: {
    iconBg: "bg-gradient-to-br from-blue-500/30 to-blue-400/20",
    iconColor: "text-blue-400",
    ring: "hover:ring-blue-400/30",
  },
  emerald: {
    iconBg: "bg-gradient-to-br from-emerald-500/30 to-emerald-400/20",
    iconColor: "text-emerald-400",
    ring: "hover:ring-emerald-400/30",
  },
  amber: {
    iconBg: "bg-gradient-to-br from-amber-500/30 to-amber-400/20",
    iconColor: "text-amber-400",
    ring: "hover:ring-amber-400/30",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  suffix,
  accent = "primary",
  subValue,
  className,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  accent?: StatCardAccent;
  subValue?: string;
  className?: string;
}) {
  const a = ACCENTS[accent];
  return (
    <div
      className={cn(
        "ring-1 ring-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5",
        a.ring,
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            a.iconBg,
          )}
        >
          <Icon className={cn("size-4", a.iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tabular-nums text-foreground">
            <AnimatedNumber value={value} />
            {suffix && (
              <span className="ml-0.5 text-sm text-muted-foreground">
                {suffix}
              </span>
            )}
          </p>
          {subValue && (
            <p className="text-[11px] text-muted-foreground tabular-nums">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
