import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockSearchHistory } from "@/mock-data";

function groupByDay(
  entries: typeof mockSearchHistory
): { label: string; entries: typeof mockSearchHistory }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: Record<string, typeof mockSearchHistory> = {
    Today: [],
    Yesterday: [],
    "This week": [],
    Earlier: [],
  };

  for (const entry of entries) {
    const d = new Date(entry.runAt);
    if (d >= today) {
      groups["Today"].push(entry);
    } else if (d >= yesterday) {
      groups["Yesterday"].push(entry);
    } else if (d >= weekAgo) {
      groups["This week"].push(entry);
    } else {
      groups["Earlier"].push(entry);
    }
  }

  return Object.entries(groups)
    .filter(([, entries]) => entries.length > 0)
    .map(([label, entries]) => ({ label, entries }));
}

export default function History() {
  const grouped = groupByDay(mockSearchHistory);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Search history</h1>
      <p className="mt-1 text-muted-foreground">
        All your past ICP extractions and lead searches
      </p>

      <div className="mt-6 space-y-6">
        {grouped.map((group) => (
          <div key={group.label}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <div className="space-y-0">
              {group.entries.map((entry) => {
                let domain = "";
                try {
                  domain = new URL(entry.sourceUrl).hostname;
                } catch {
                  domain = "unknown";
                }
                const d = new Date(entry.runAt);
                const timeStr = d.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                      alt=""
                      className="size-5 rounded"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{entry.sourceCompanyName}</p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {entry.sourceUrl}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {entry.leadCount} leads
                    </span>
                    <span className="w-20 text-right text-xs text-muted-foreground">
                      {timeStr}
                    </span>
                    <Button render={<Link to="/leads" />} variant="secondary" size="sm">
                      View
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
