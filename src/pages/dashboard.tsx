import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { ArrowRight, Plus } from "lucide-react";
import { mockUser, mockSearchHistory, mockCampaigns } from "@/mock-data";
import { getGreeting, shortRelativeTime, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const recentSearches = mockSearchHistory.slice(0, 4);
  const activeCampaigns = mockCampaigns.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold">
          {getGreeting()}, {mockUser.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your lead generation.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total leads" value="324" subtitle="+18 this week" trend="up" />
        <StatCard title="Active campaigns" value="3" subtitle="Unchanged" trend="neutral" />
        <StatCard title="Reply rate" value="24.3%" subtitle="+2.1% vs last week" trend="up" />
        <StatCard
          title="Leads remaining"
          value="176"
          subtitle="of 500"
          trend="neutral"
          progress={{ value: 324, max: 500 }}
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-5 gap-6">
        {/* Recent searches (60%) */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent searches</CardTitle>
              <Link
                to="/history"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-0">
              {recentSearches.map((s) => (
                <Link
                  key={s.id}
                  to="/leads"
                  className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${new URL(s.sourceUrl).hostname}&sz=32`}
                    alt=""
                    className="size-5 rounded"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{s.sourceCompanyName}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {s.sourceUrl}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">{s.leadCount} leads</span>
                  <span className="text-xs text-muted-foreground">
                    {shortRelativeTime(s.runAt)}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Active campaigns (40%) */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active campaigns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeCampaigns.map((c) => (
                <Link
                  key={c.id}
                  to={`/campaigns/${c.id}`}
                  className="block rounded-md border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{c.name}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] uppercase",
                        c.status === "active" &&
                          "border-[hsl(150_50%_55%/0.4)] bg-[hsl(150_50%_55%/0.15)] text-[hsl(150_50%_55%)]",
                        c.status === "warming" &&
                          "border-[hsl(38_95%_58%/0.4)] bg-[hsl(38_95%_58%/0.15)] text-[hsl(38_95%_58%)]",
                        c.status === "paused" &&
                          "text-muted-foreground"
                      )}
                    >
                      {c.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span>{c.leadsEnrolled} enrolled</span>
                    <span>
                      {c.sent > 0
                        ? formatPercent(c.replied, c.sent) + " reply rate"
                        : "Not started"}
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom CTA */}
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">Ready to find more leads?</p>
            <p className="text-sm text-muted-foreground">
              Paste any company URL to reverse-engineer their ICP and discover matching leads.
            </p>
          </div>
          <Button render={<Link to="/ingest" />}>
            <Plus className="mr-1 size-4" />
            New search
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
