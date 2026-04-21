import { Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignalListProps {
  matched: string[];
  missing: string[];
  risks: string[];
  className?: string;
}

export function SignalList({ matched, missing, risks, className }: SignalListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {matched.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-medium text-emerald-400 uppercase tracking-wider">
            Matched Signals
          </h4>
          <ul className="space-y-1">
            {matched.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {missing.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-medium text-amber-400 uppercase tracking-wider">
            Missing Signals
          </h4>
          <ul className="space-y-1">
            {missing.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <X className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {risks.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-medium text-red-400 uppercase tracking-wider">
            Risk Factors
          </h4>
          <ul className="space-y-1">
            {risks.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-red-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
