import * as React from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterBarProps {
  onStatusFilterChange: (selectedStatuses: Array<string>) => void;
  defaultSelectedStatuses?: Array<string>;
  isLoading?: boolean;
  className?: string;
}

export function FilterBar({
  onStatusFilterChange,
  defaultSelectedStatuses,
  isLoading,
  className,
}: FilterBarProps) {
  const defaultAllStatuses = ["Aktif", "Pending", "Tidak Aktif"];

  const [selectedStatuses, setSelectedStatuses] = React.useState<Array<string>>(
    defaultSelectedStatuses ?? defaultAllStatuses,
  );

  // Sync state with URL params
  React.useEffect(() => {
    if (defaultSelectedStatuses !== undefined) {
      setSelectedStatuses(defaultSelectedStatuses);
    }
  }, [defaultSelectedStatuses]);

  const handleStatusChange = (status: string, checked: boolean) => {
    let newSelectedStatuses = checked
      ? [...selectedStatuses, status]
      : selectedStatuses.filter((s) => s !== status);
    // Prevent empty selection - if all unchecked, keep all checked
    if (newSelectedStatuses.length === 0) {
      newSelectedStatuses = [...defaultAllStatuses];
    }
    setSelectedStatuses(newSelectedStatuses);
    onStatusFilterChange(newSelectedStatuses);
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all px-4 py-2",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Status:</span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {["Aktif", "Pending", "Tidak Aktif"].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) =>
                  handleStatusChange(status, !!checked)
                }
                disabled={isLoading}
              />
              <label
                htmlFor={`status-${status}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
