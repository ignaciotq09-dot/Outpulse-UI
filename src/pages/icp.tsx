import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TagInput } from "@/components/tag-input";
import { ExternalLink, RefreshCw } from "lucide-react";
import { mockICP, mockLeads } from "@/mock-data";
import { shortRelativeTime } from "@/lib/format";
import type { ICP as ICPType } from "@/types";

export default function ICP() {
  const [icp, setIcp] = useState<ICPType>(mockICP);

  const triggerCount = icp.triggers.length;
  const leadCount = mockLeads.filter((l) => l.icpId === icp.id).length;

  return (
    <div className="flex gap-6">
      {/* Left column */}
      <div className="flex-1 space-y-4 overflow-auto pb-8" style={{ maxWidth: "60%" }}>
        {/* Company overview */}
        <Card>
          <CardHeader>
            <CardTitle>Company overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={icp.companyDescription}
                onChange={(e) => setIcp({ ...icp, companyDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Value proposition</Label>
              <Textarea
                value={icp.valueProposition}
                onChange={(e) => setIcp({ ...icp, valueProposition: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Target company */}
        <Card>
          <CardHeader>
            <CardTitle>Target company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <TagInput
                values={icp.industry}
                onChange={(v) => setIcp({ ...icp, industry: v })}
                dimension="industry"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company size (employees)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={icp.companySize.min}
                  onChange={(e) =>
                    setIcp({
                      ...icp,
                      companySize: { ...icp.companySize, min: Number(e.target.value) },
                    })
                  }
                  className="w-28"
                />
                <span className="text-muted-foreground">&mdash;</span>
                <Input
                  type="number"
                  value={icp.companySize.max}
                  onChange={(e) =>
                    setIcp({
                      ...icp,
                      companySize: { ...icp.companySize, max: Number(e.target.value) },
                    })
                  }
                  className="w-28"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target contact */}
        <Card>
          <CardHeader>
            <CardTitle>Target contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Target titles</Label>
              <TagInput
                values={icp.targetTitles}
                onChange={(v) => setIcp({ ...icp, targetTitles: v })}
                dimension="targetTitles"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Seniority levels</Label>
              <TagInput
                values={icp.seniorityLevels}
                onChange={(v) => setIcp({ ...icp, seniorityLevels: v })}
                dimension="seniorityLevels"
              />
            </div>
          </CardContent>
        </Card>

        {/* Geography */}
        <Card>
          <CardHeader>
            <CardTitle>Geography</CardTitle>
          </CardHeader>
          <CardContent>
            <TagInput
              values={icp.geos}
              onChange={(v) => setIcp({ ...icp, geos: v })}
              dimension="geos"
            />
          </CardContent>
        </Card>

        {/* Pain points & tech stack */}
        <Card>
          <CardHeader>
            <CardTitle>Pain points & tech stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Pain points</Label>
              <TagInput
                values={icp.painPoints}
                onChange={(v) => setIcp({ ...icp, painPoints: v })}
                dimension="painPoints"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tech stack</Label>
              <TagInput
                values={icp.techStack}
                onChange={(v) => setIcp({ ...icp, techStack: v })}
                dimension="techStack"
              />
            </div>
          </CardContent>
        </Card>

        {/* Buying triggers — special treatment */}
        <Card className="border-l-2 border-l-accent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Buying triggers</CardTitle>
              <Badge className="bg-accent/15 text-accent border-accent/40 text-[10px]">
                Differentiator
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time signals Outpulse surfaces that static databases can&apos;t see.
            </p>
          </CardHeader>
          <CardContent>
            <TagInput
              values={icp.triggers}
              onChange={(v) => setIcp({ ...icp, triggers: v })}
              dimension="triggers"
            />
          </CardContent>
        </Card>

        {/* Exclusions */}
        <Card>
          <CardHeader>
            <CardTitle>Exclusions</CardTitle>
          </CardHeader>
          <CardContent>
            <TagInput
              values={icp.exclusions}
              onChange={(v) => setIcp({ ...icp, exclusions: v })}
              dimension="exclusions"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right column — sticky summary */}
      <div className="w-[40%]">
        <div className="sticky top-6">
          <Card>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Source URL</p>
                <a
                  href={icp.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {icp.sourceUrl}
                  <ExternalLink className="size-3" />
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <RefreshCw className="size-3" />
                Extracted {shortRelativeTime(icp.createdAt)}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent" />
                  <span className="text-sm">
                    <strong>{leadCount}</strong> leads matched
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent" />
                  <span className="text-sm text-accent">
                    <strong>{triggerCount}</strong> triggers detected
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button render={<Link to="/leads" />} className="w-full">
                  Find leads
                </Button>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="secondary" className="w-full" disabled />}>
                    Save as template
                  </TooltipTrigger>
                  <TooltipContent>Coming soon</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
