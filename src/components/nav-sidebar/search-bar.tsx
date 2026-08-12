import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.ComponentProps<"input"> {
  className?: string;
}

export function SearchBar({ className, ...props }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
      <Input
        type="search"
        placeholder="Search..."
        className="h-10 w-full rounded-full bg-slate-50 pl-10 pr-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring border-2 border-slate-200 hover:border-slate-300 transition-all"
        onFocus={() => setIsOpen(true)}
        {...props}
      />

      {isOpen && (
        <div className="absolute top-12 left-0 w-full rounded-xl border border-slate-200 bg-white shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col">
            <span className="text-center">Fitur Segera Hadir</span>
          </div>
        </div>
      )}
    </div>
  );
}
