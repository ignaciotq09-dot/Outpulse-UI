import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Plus,
  Users,
  Send,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { mockUser, mockNotifications } from "@/mock-data";
import { shortRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./command-palette";

const navItems = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "New search", icon: Plus, path: "/ingest" },
  { label: "Leads", icon: Users, path: "/leads" },
  { label: "Campaigns", icon: Send, path: "/campaigns" },
  { label: "History", icon: Clock, path: "/history" },
];

function getBreadcrumb(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/ingest")) return "New Search";
  if (pathname.startsWith("/icp")) return "ICP Profile";
  if (pathname.startsWith("/leads")) return "Leads";
  if (pathname.startsWith("/campaigns/")) return "Campaign Detail";
  if (pathname.startsWith("/campaigns")) return "Campaigns";
  if (pathname.startsWith("/history")) return "History";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Page";
}

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();
  const hasUnread = mockNotifications.some((n) => !n.read);

  const isFullWidth = location.pathname.startsWith("/leads");

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card transition-all duration-200",
          collapsed ? "w-14" : "w-[220px]"
        )}
      >
        {/* Logo + collapse toggle */}
        <div className="flex h-12 items-center justify-between px-3">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-0.5 text-lg font-semibold">
              <span className="text-primary">O</span>
              <span>utpulse</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-2 py-2">
          {navItems.map((item) => {
            const active =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="space-y-0.5 px-2 pb-2">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              location.pathname === "/settings" && "bg-primary/10 text-primary",
              collapsed && "justify-center px-0"
            )}
          >
            <Settings className="size-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <Separator className="my-2" />
          <div
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5",
              collapsed && "justify-center px-0"
            )}
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {mockUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{mockUser.name}</p>
                <Badge variant="secondary" className="mt-0.5 text-[10px] uppercase">
                  {mockUser.plan}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-12 shrink-0 items-center gap-4 border-b border-border px-6">
          <span className="text-sm text-muted-foreground">
            Outpulse <span className="mx-1">/</span>{" "}
            <span className="text-foreground">{getBreadcrumb(location.pathname)}</span>
          </span>

          <div className="flex-1" />

          {/* Search trigger */}
          <button
            onClick={() => setCommandOpen(true)}
            className="flex h-7 w-56 items-center gap-2 rounded-md border border-input bg-secondary px-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <Search className="size-3.5" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger render={<Button variant="ghost" size="icon-sm" className="relative" />}>
              <Bell className="size-4" />
              {hasUnread && (
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-accent" />
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="border-b border-border px-3 py-2">
                <p className="text-sm font-medium">Notifications</p>
              </div>
              <div className="divide-y divide-border">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={cn("px-3 py-2", !n.read && "bg-muted/50")}>
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.body}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {shortRelativeTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground" />
              }
            >
              {mockUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/settings" />}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/login" />}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className={cn(!isFullWidth && "mx-auto max-w-[1440px] px-8 py-6")}>
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
