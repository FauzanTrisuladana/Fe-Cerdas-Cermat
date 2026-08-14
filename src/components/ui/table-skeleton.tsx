import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="rounded-lg border-2 border-slate-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i} className="bg-slate-50">
                <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx} className="border-slate-200">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <TableCell key={colIdx} className="py-3">
                  <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
