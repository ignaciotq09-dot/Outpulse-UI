import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LeadScoreBadge } from "@/components/lead-score-badge";
import { mockCampaigns, mockLeads } from "@/mock-data";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

function statusClasses(status: string) {
  switch (status) {
    case "active":
      return "border-[hsl(150_50%_55%/0.4)] bg-[hsl(150_50%_55%/0.15)] text-[hsl(150_50%_55%)]";
    case "warming":
      return "border-[hsl(38_95%_58%/0.4)] bg-[hsl(38_95%_58%/0.15)] text-[hsl(38_95%_58%)]";
    default:
      return "text-muted-foreground";
  }
}

export default function CampaignDetail() {
  const { id } = useParams();
  const campaign = mockCampaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Campaign not found.</p>
        <Button render={<Link to="/campaigns" />} variant="link" className="mt-2">
          Back to campaigns
        </Button>
      </div>
    );
  }

  const enrolledLeads = mockLeads.slice(0, 5);
  const funnelSteps = [
    { label: "Enrolled", value: campaign.leadsEnrolled },
    { label: "Sent", value: campaign.sent },
    { label: "Opened", value: campaign.opened },
    { label: "Replied", value: campaign.replied },
  ];
  const maxFunnel = Math.max(...funnelSteps.map((s) => s.value), 1);

  return (
    <div className="flex gap-6">
      {/* Left column */}
      <div className="flex-1 space-y-6" style={{ maxWidth: "60%" }}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{campaign.name}</h1>
          <Badge
            variant="secondary"
            className={cn("text-xs uppercase", statusClasses(campaign.status))}
          >
            {campaign.status}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              label: "Enrolled",
              value: campaign.leadsEnrolled.toString(),
            },
            { label: "Sent", value: campaign.sent.toString() },
            { label: "Opened", value: campaign.opened.toString() },
            { label: "Replied", value: campaign.replied.toString() },
          ].map((stat) => (
            <Card key={stat.label} size="sm">
              <CardContent>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-0.5 font-mono text-xl font-semibold">{stat.value}</p>
                {stat.label !== "Enrolled" && campaign.sent > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formatPercent(
                      Number(stat.value),
                      stat.label === "Sent" ? campaign.leadsEnrolled : campaign.sent
                    )}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnelSteps.map((step) => (
              <div key={step.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{step.label}</span>
                  <span className="font-mono text-muted-foreground">
                    {step.value}{" "}
                    {step.label !== "Enrolled" && campaign.leadsEnrolled > 0 && (
                      <span className="text-xs">
                        ({formatPercent(step.value, campaign.leadsEnrolled)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${(step.value / maxFunnel) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Email sequence */}
        <Card>
          <CardHeader>
            <CardTitle>Email sequence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaign.sequence.map((step, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    Day {step.day}
                  </Badge>
                  <span className="text-sm font-medium">{step.subject}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground whitespace-pre-line">
                  {step.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="w-[40%]">
        <div className="sticky top-6 space-y-6">
          {/* Status toggle (visual only) */}
          <Card>
            <CardContent>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <div className="flex rounded-md border border-border">
                {(["warming", "active", "paused"] as const).map((s) => (
                  <button
                    key={s}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-sm capitalize transition-colors",
                      campaign.status === s
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enrolled leads */}
          <Card>
            <CardHeader>
              <CardTitle>Enrolled leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {enrolledLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-2 border-t border-border py-2 first:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{lead.company}</p>
                    <p className="text-xs text-muted-foreground">{lead.contactName}</p>
                  </div>
                  <LeadScoreBadge score={lead.score} size="sm" />
                </div>
              ))}
              <Link
                to="/leads"
                className="mt-2 block text-center text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardContent>
          </Card>

          <Separator />

          {/* Danger zone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled className="w-full">
                Delete campaign
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
