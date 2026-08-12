import { Card, CardContent } from "./card";

interface SummaryItem {
  label: string;
  value: string;
  valueColor?: string;
}

interface SummaryCardProps {
  title: string;
  items: Array<SummaryItem>;
  isLoading?: boolean;
}

export function SummaryCard({ title, items, isLoading }: SummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-slate-900 text-white w-full lg:w-64 flex-shrink-0 max-h-48 lg:max-h-none flex flex-col">
        <CardContent className="px-4 py-3 flex flex-col justify-between h-full overflow-y-auto">
          <div className="h-4 w-24 rounded bg-slate-700 animate-pulse mb-2" />
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-3 w-16 rounded bg-slate-700 animate-pulse" />
                <div className="h-3 w-20 rounded bg-slate-700 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 text-white w-full lg:w-64 flex-shrink-0 max-h-48 lg:max-h-none flex flex-col">
      <CardContent className="px-4 py-3 flex flex-col justify-between h-full overflow-y-auto">
        <h3 className="text-sm font-bold mb-2 pb-2 border-b border-slate-700">
          {title}
        </h3>
        <div className="flex flex-col gap-2 flex-1 justify-between">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-xs text-slate-300">{item.label}</span>
              <span
                className={`text-xs font-semibold ${item.valueColor ?? "text-white"}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
