import { getDimensionStyle } from "@/lib/dimensions";
import type { ICPDimension } from "@/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface DimensionBarProps {
  dimension: ICPDimension;
  confidence: number;
}

export function DimensionBar({ dimension, confidence }: DimensionBarProps) {
  const style = getDimensionStyle(dimension);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(confidence), 50);
    return () => clearTimeout(timer);
  }, [confidence]);

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-muted">
        <div
          className={cn("h-1.5 rounded-full transition-all duration-300 ease-out", style.dot)}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="font-mono text-xs text-muted-foreground">{confidence}%</span>
    </div>
  );
}
