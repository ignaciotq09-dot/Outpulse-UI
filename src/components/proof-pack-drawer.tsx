import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DimensionBar } from "@/components/dimension-bar";
import { getDimensionStyle, getDimensionLabel } from "@/lib/dimensions";
import { shortRelativeTime } from "@/lib/format";
import {
  X,
  Check,
  AlertTriangle,
  Minus,
  ExternalLink,
  Bookmark,
  Send,
  Download,
  Link as LinkIcon,
} from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Lead, EmailStatus } from "@/types";

function EmailStatusIcon({ status }: { status: EmailStatus }) {
  switch (status) {
    case "verified":
      return <Check className="size-3.5 text-[hsl(150_50%_55%)]" />;
    case "catch-all":
      return <AlertTriangle className="size-3.5 text-accent" />;
    case "invalid":
      return <X className="size-3.5 text-destructive" />;
    default:
      return <Minus className="size-3.5 text-muted-foreground" />;
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-[hsl(150_50%_55%)]";
  if (score >= 80) return "text-primary";
  if (score >= 70) return "text-accent";
  return "text-muted-foreground";
}

function AnimatedScore({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.8 });
    return controls.stop;
  }, [value, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded" />
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

interface ProofPackDrawerProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

export function ProofPackDrawer({
  lead,
  open,
  onOpenChange,
  loading = false,
}: ProofPackDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] overflow-y-auto p-0 sm:max-w-[600px]">
        {loading ? (
          <LoadingSkeleton />
        ) : !lead ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <Users className="mx-auto size-10 text-muted-foreground/50" />
              <p className="mt-3 text-muted-foreground">
                Select a lead to view its proof pack
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <SheetHeader className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
              <div className="flex items-start gap-3">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${lead.companyDomain}&sz=64`}
                  alt=""
                  className="size-10 rounded"
                />
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-xl font-semibold">
                    {lead.company}
                  </SheetTitle>
                  <p className="font-mono text-xs text-muted-foreground">
                    {lead.companyDomain}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">{lead.contactName}</span>
                    <span className="text-muted-foreground">{lead.contactTitle}</span>
                    {lead.contactLinkedIn && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <a
                          href={lead.contactLinkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <LinkIcon className="size-4" />
                        </a>
                      </>
                    )}
                    {lead.contactEmail && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="flex items-center gap-1 font-mono text-xs">
                          {lead.contactEmail}
                          {lead.emailStatus && (
                            <EmailStatusIcon status={lead.emailStatus} />
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="px-6 py-6 space-y-6">
              {/* Score */}
              <div className="text-center">
                <div
                  className={cn(
                    "font-mono text-6xl font-medium",
                    getScoreColor(lead.score)
                  )}
                >
                  <AnimatedScore value={lead.score} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  scored {shortRelativeTime(lead.scoredAt)}
                </p>
              </div>

              <Separator />

              {/* Summary */}
              <Card className="border-l-2 border-l-primary">
                <CardContent className="relative">
                  <p className="text-[15px] leading-relaxed">
                    {lead.proofPack.summary}
                  </p>
                  <span className="absolute top-2 right-4 text-[10px] text-muted-foreground">
                    AI summary
                  </span>
                </CardContent>
              </Card>

              {/* Evidence by dimension */}
              <div className="space-y-6">
                {lead.proofPack.dimensions.map((dim) => {
                  const style = getDimensionStyle(dim.dimension);
                  return (
                    <div key={dim.dimension} className="space-y-2">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn("size-2 rounded-full", style.dot)}
                          />
                          <span className="text-sm font-medium">
                            {getDimensionLabel(dim.dimension)}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {dim.confidence}%
                        </span>
                      </div>

                      {/* Bar */}
                      <DimensionBar
                        dimension={dim.dimension}
                        confidence={dim.confidence}
                      />

                      {/* Reasoning */}
                      <p className="text-sm leading-relaxed">{dim.reasoning}</p>

                      {/* Sources */}
                      {dim.sources.length > 0 ? (
                        <div className="space-y-2 pl-2">
                          {dim.sources.map((source, i) => {
                            let domain = "";
                            try {
                              domain = new URL(source.url).hostname;
                            } catch {
                              domain = "unknown";
                            }
                            return (
                              <div key={i} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                                    alt=""
                                    className="size-4 rounded-sm"
                                  />
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm hover:underline"
                                  >
                                    {source.title}
                                    <ExternalLink className="ml-1 inline size-3 text-muted-foreground" />
                                  </a>
                                </div>
                                <blockquote className="ml-6 border-l-2 border-muted pl-3 text-xs italic text-muted-foreground">
                                  {source.snippet}
                                </blockquote>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="pl-2 text-xs italic text-muted-foreground">
                          No sources cited
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-card px-6 py-3">
              <Tooltip>
                <TooltipTrigger render={<Button disabled />}>
                  <Send className="mr-1 size-4" />
                  Add to campaign
                </TooltipTrigger>
                <TooltipContent>Coming soon</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="secondary" disabled />}>
                  <Download className="mr-1 size-4" />
                  Export lead
                </TooltipTrigger>
                <TooltipContent>Coming soon</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" disabled />}>
                  <Bookmark className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Coming soon</TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
