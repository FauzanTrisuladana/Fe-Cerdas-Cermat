import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.ComponentProps<"input"> {
  className?: string;
}

export function SearchBar({
  className,
  placeholder = "Search...",
  ...props
}: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="h-9 w-full rounded-lg bg-slate-50 pl-10 pr-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring border-2 border-slate-200 hover:border-slate-300 transition-all"
        {...props}
      />
    </div>
  );
}
