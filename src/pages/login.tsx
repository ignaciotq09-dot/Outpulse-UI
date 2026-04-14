import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadScoreBadge } from "@/components/lead-score-badge";

const previewLeads = [
  { company: "Flowplane", title: "VP of Engineering", score: 96, signal: "Series B" },
  { company: "Usermatic", title: "CTO", score: 94, signal: "Left Jira" },
  { company: "Nodecraft", title: "Dir. of Engineering", score: 91, signal: "Hiring EMs" },
  { company: "Pulsemetric", title: "Head of Product", score: 88, signal: "CEO posted" },
  { company: "Signalforge", title: "Dir. of DX", score: 85, signal: "Series C" },
];

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/");
  }

  return (
    <div className="flex h-screen">
      {/* Left — Login */}
      <div className="flex w-1/2 flex-col justify-center bg-background px-16">
        <div className="mb-12">
          <span className="text-xl font-semibold">
            <span className="text-primary">O</span>utpulse
          </span>
        </div>
        <div className="max-w-sm">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-muted-foreground">Sign in to continue</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ignacio@outpulse.com"
                defaultValue="ignacio@outpulse.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="password123" />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button onClick={() => navigate("/")} className="text-primary hover:underline">
              Start free trial
            </button>
          </p>
        </div>
      </div>

      {/* Right — Preview */}
      <div className="flex w-1/2 items-center justify-center bg-card">
        <Card className="w-[420px] opacity-80">
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">Recent leads</span>
              <Badge variant="secondary" className="text-[10px]">
                Live preview
              </Badge>
            </div>
            <div className="space-y-0">
              {previewLeads.map((lead) => (
                <div
                  key={lead.company}
                  className="flex items-center gap-3 border-t border-border py-2.5"
                >
                  <div className="flex size-7 items-center justify-center rounded bg-muted text-xs font-medium">
                    {lead.company[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{lead.company}</p>
                    <p className="text-xs text-muted-foreground">{lead.title}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="border border-[hsl(38_95%_58%/0.4)] bg-[hsl(38_95%_58%/0.15)] text-[hsl(38_95%_58%)] text-[10px]"
                  >
                    {lead.signal}
                  </Badge>
                  <LeadScoreBadge score={lead.score} size="sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
