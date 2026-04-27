"use client";

import { useAnimatedValue } from "@/hooks/use-animated-value";
import { getScoreStrokeColor, getScoreColor } from "@/lib/constants";

export function CircularProgress({
  value,
  size = 48,
  strokeWidth = 4,
  showLabel = true,
  className = "",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const animated = useAnimatedValue(value, 1000);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;
  const color = getScoreStrokeColor(value);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/[0.06]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      {showLabel && (
        <span
          className={`absolute text-xs font-semibold tabular-nums ${getScoreColor(value)}`}
          style={{ fontSize: size * 0.26 }}
        >
          {Math.round(animated)}
        </span>
      )}
    </div>
  );
}
