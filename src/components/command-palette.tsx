import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Home,
  Plus,
  Users,
  Send,
  Clock,
  Settings,
  Search,
  Zap,
} from "lucide-react";
import { mockSearchHistory } from "@/mock-data";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  function go(path: string) {
    navigate(path);
    onOpenChange(false);
  }

  const recentSearches = mockSearchHistory.slice(0, 3);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/")}>
            <Home className="mr-2 size-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/ingest")}>
            <Plus className="mr-2 size-4" />
            New search
          </CommandItem>
          <CommandItem onSelect={() => go("/leads")}>
            <Users className="mr-2 size-4" />
            Leads
          </CommandItem>
          <CommandItem onSelect={() => go("/campaigns")}>
            <Send className="mr-2 size-4" />
            Campaigns
          </CommandItem>
          <CommandItem onSelect={() => go("/history")}>
            <Clock className="mr-2 size-4" />
            History
          </CommandItem>
          <CommandItem onSelect={() => go("/settings")}>
            <Settings className="mr-2 size-4" />
            Settings
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Recent searches">
          {recentSearches.map((s) => (
            <CommandItem key={s.id} onSelect={() => go("/leads")}>
              <Search className="mr-2 size-4" />
              {s.sourceCompanyName}
              <span className="ml-auto text-xs text-muted-foreground">
                {s.leadCount} leads
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/ingest")}>
            <Zap className="mr-2 size-4" />
            New search
          </CommandItem>
          <CommandItem onSelect={() => go("/campaigns")}>
            <Send className="mr-2 size-4" />
            View campaigns
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
