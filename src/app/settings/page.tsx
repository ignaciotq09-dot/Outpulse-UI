"use client";

import { Settings, Server, Key, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/lib/api/health";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function ConfigItem({
  label,
  configured,
  icon: Icon,
}: {
  label: string;
  configured: boolean;
  icon: typeof Server;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <Badge variant={configured ? "outline" : "destructive"}>
        {configured ? "Connected" : "Not Configured"}
      </Badge>
    </div>
  );
}

export default function SettingsPage() {
  const { data: health, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: ({ signal }) => getHealth(signal),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="gradient-text text-2xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          System configuration and API status
        </p>
      </div>

      <div className="ring-1 ring-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm rounded-xl p-6 space-y-1 animate-fade-in-up">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <Settings className="size-4" />
          Backend Status
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : health ? (
          <div className="divide-y divide-white/[0.06]">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Server className="size-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Service</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {health.service} v{health.version}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Globe className="size-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Environment</span>
              </div>
              <Badge variant="secondary">{health.environment}</Badge>
            </div>
            <ConfigItem
              label="Anthropic API"
              configured={health.anthropic_configured}
              icon={Key}
            />
            <ConfigItem
              label="Exa Search"
              configured={health.exa_configured}
              icon={Key}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Unable to reach backend
          </p>
        )}
      </div>
    </div>
  );
}
