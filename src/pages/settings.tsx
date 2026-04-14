import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Globe,
  Shield,
  Zap,
  Mail,
  Database,
  Send,
  Check,
  X,
} from "lucide-react";
import { mockUser } from "@/mock-data";
import { cn } from "@/lib/utils";

const domains = [
  { domain: "outpulse-ignacio.com", status: "Warming (day 8/14)", healthy: false },
  { domain: "outpulse-team.com", status: "Active", healthy: true },
];

const inboxes = [
  { email: "ignacio@outpulse-ignacio.com", limit: 40, used: 12 },
  { email: "ignacio2@outpulse-ignacio.com", limit: 40, used: 8 },
  { email: "team1@outpulse-team.com", limit: 50, used: 34 },
  { email: "team2@outpulse-team.com", limit: 50, used: 28 },
  { email: "team3@outpulse-team.com", limit: 50, used: 41 },
];

const integrations = [
  { name: "Exa", icon: Globe, desc: "Real-time web search and content retrieval", connected: true },
  { name: "Bouncer", icon: Shield, desc: "Email verification and deliverability", connected: true },
  { name: "BetterContact", icon: Mail, desc: "Waterfall enrichment for contact data", connected: false },
  { name: "FullEnrich", icon: Database, desc: "Company and contact data enrichment", connected: false },
  { name: "Smartlead", icon: Send, desc: "Cold email infrastructure and sending", connected: true },
  { name: "Maildoso", icon: Zap, desc: "Domain warming and inbox management", connected: false },
];

const invoices = [
  { id: "INV-2026-003", date: "Apr 1, 2026", amount: "$500.00", status: "Paid" },
  { id: "INV-2026-002", date: "Mar 1, 2026", amount: "$500.00", status: "Paid" },
  { id: "INV-2026-001", date: "Feb 1, 2026", amount: "$500.00", status: "Paid" },
];

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="email">Email infrastructure</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <p className="text-xs text-muted-foreground">
                Contact support to edit your profile information.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary text-xl font-medium text-primary-foreground">
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <Button variant="secondary" disabled>
                  Upload avatar
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input value={mockUser.name} disabled />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={mockUser.email} disabled />
                </div>
                <div className="space-y-1.5">
                  <Label>Company</Label>
                  <Input value={mockUser.company} disabled />
                </div>
                <div className="space-y-1.5">
                  <Label>Plan</Label>
                  <Input value={mockUser.plan.charAt(0).toUpperCase() + mockUser.plan.slice(1)} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email infrastructure */}
        <TabsContent value="email" className="mt-4 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Sending domains</CardTitle>
              <Tooltip>
                <TooltipTrigger render={<Button size="sm" disabled />}>
                  Add domain
                </TooltipTrigger>
                <TooltipContent>Coming soon</TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map((d) => (
                    <TableRow key={d.domain}>
                      <TableCell className="font-mono text-sm">{d.domain}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            d.healthy
                              ? "border-[hsl(150_50%_55%/0.4)] bg-[hsl(150_50%_55%/0.15)] text-[hsl(150_50%_55%)]"
                              : "border-[hsl(38_95%_58%/0.4)] bg-[hsl(38_95%_58%/0.15)] text-[hsl(38_95%_58%)]"
                          )}
                        >
                          {d.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inboxes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inbox</TableHead>
                    <TableHead>Daily limit</TableHead>
                    <TableHead>Used today</TableHead>
                    <TableHead className="w-48">Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inboxes.map((inbox) => (
                    <TableRow key={inbox.email}>
                      <TableCell className="font-mono text-sm">{inbox.email}</TableCell>
                      <TableCell>{inbox.limit}</TableCell>
                      <TableCell>{inbox.used}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-muted">
                            <div
                              className="h-1.5 rounded-full bg-primary"
                              style={{
                                width: `${(inbox.used / inbox.limit) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">
                            {Math.round((inbox.used / inbox.limit) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {integrations.map((integ) => (
              <Card key={integ.name}>
                <CardContent className="flex flex-col items-start gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <integ.icon className="size-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{integ.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{integ.desc}</p>
                  <div className="flex w-full items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "gap-1 text-[10px]",
                        integ.connected
                          ? "border-[hsl(150_50%_55%/0.4)] bg-[hsl(150_50%_55%/0.15)] text-[hsl(150_50%_55%)]"
                          : "text-muted-foreground"
                      )}
                    >
                      {integ.connected ? (
                        <Check className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                      {integ.connected ? "Connected" : "Disconnected"}
                    </Badge>
                    <Button variant="secondary" size="sm" disabled>
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">Growth plan</span>
                <span className="text-muted-foreground">— $500/mo</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>500 leads per month</li>
                <li>50 ICP searches per month</li>
                <li>Unlimited campaigns</li>
                <li>Full proof packs with sources</li>
                <li>Email verification included</li>
              </ul>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Leads used</span>
                  <span className="font-mono">
                    {mockUser.usage.leadsUsed} / {mockUser.usage.leadsLimit}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${(mockUser.usage.leadsUsed / mockUser.usage.leadsLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <Button disabled>Upgrade</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice history</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-sm">{inv.id}</TableCell>
                      <TableCell>{inv.date}</TableCell>
                      <TableCell className="font-mono">{inv.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="border-[hsl(150_50%_55%/0.4)] bg-[hsl(150_50%_55%/0.15)] text-[hsl(150_50%_55%)] text-[10px]"
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
