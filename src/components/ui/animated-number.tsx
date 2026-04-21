"use client";

import { useAnimatedValue } from "@/hooks/use-animated-value";

export function AnimatedNumber({
  value,
  duration = 800,
  decimals = 0,
}: {
  value: number;
  duration?: number;
  decimals?: number;
}) {
  const animated = useAnimatedValue(value, duration);
  return <>{animated.toFixed(decimals)}</>;
}
