import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down" | "neutral";
  progress?: { value: number; max: number };
}

export function StatCard({ title, value, subtitle, trend, progress }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-1">
        <p className="text-muted-foreground text-xs">{title}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-semibold">{value}</span>
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs",
              trend === "up" && "text-[hsl(150_50%_55%)]",
              trend === "down" && "text-destructive",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {trend === "up" && <TrendingUp className="size-3" />}
            {trend === "down" && <TrendingDown className="size-3" />}
            {trend === "neutral" && <Minus className="size-3" />}
            <span>{subtitle}</span>
          </div>
        </div>
        {progress && (
          <div className="mt-3">
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${(progress.value / progress.max) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
