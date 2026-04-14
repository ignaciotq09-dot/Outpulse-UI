import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { mockCampaigns } from "@/mock-data";
import { shortRelativeTime, formatPercent } from "@/lib/format";
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

export default function Campaigns() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <Tooltip>
          <TooltipTrigger render={<Button disabled />}>
            <Plus className="mr-1 size-4" />
            New campaign
          </TooltipTrigger>
          <TooltipContent>Coming soon</TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign name</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-28">Enrolled</TableHead>
              <TableHead className="w-20">Sent</TableHead>
              <TableHead className="w-24">Opened</TableHead>
              <TableHead className="w-24">Replied</TableHead>
              <TableHead className="w-36">Reply rate</TableHead>
              <TableHead className="w-28">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCampaigns.map((c) => {
              const replyRate = c.sent > 0 ? (c.replied / c.sent) * 100 : 0;
              return (
                <TableRow key={c.id} className="h-11">
                  <TableCell>
                    <Link
                      to={`/campaigns/${c.id}`}
                      className="font-medium hover:underline"
                    >
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("text-[10px] uppercase", statusClasses(c.status))}
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.leadsEnrolled}</TableCell>
                  <TableCell>{c.sent}</TableCell>
                  <TableCell>{c.opened}</TableCell>
                  <TableCell>{c.replied}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {c.sent > 0 ? formatPercent(c.replied, c.sent) : "—"}
                      </span>
                      {c.sent > 0 && (
                        <div className="h-1.5 w-16 rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${Math.min(replyRate * 2, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {shortRelativeTime(c.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
