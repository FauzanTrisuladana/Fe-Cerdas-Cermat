import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: Array<number>;
}

export function DataTablePagination({
  pageIndex,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (pageCount <= showMax) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);
      if (pageIndex > 2) pages.push(-1);

      let start = Math.max(1, pageIndex - 1);
      let end = Math.min(pageCount - 2, pageIndex + 1);

      if (pageIndex < 2) end = 3;
      if (pageIndex > pageCount - 3) start = pageCount - 4;

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (pageIndex < pageCount - 3) pages.push(-1);
      pages.push(pageCount - 1);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center p-4 border-t">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex <= 0}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((idx, i) =>
            idx === -1 ? (
              <span key={`dots-${i}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={idx}
                variant={pageIndex === idx ? "secondary" : "ghost"}
                size="sm"
                className={`h-8 w-8 font-bold cursor-pointer ${
                  pageIndex === idx ? "text-slate-900" : "text-muted-foreground"
                }`}
                onClick={() => onPageChange(idx)}
              >
                {idx + 1}
              </Button>
            ),
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
            className="cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={`${pageSize}`}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 md:w-27.5 w-auto bg-slate-100 border-none cursor-pointer">
            <SelectValue placeholder={`${pageSize} / Page`} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size} / Page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
