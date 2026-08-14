import type { DashboardStats } from "./types";
import { Card, CardContent } from "@/components/ui/card";

const voteChoices = [
  { key: "total_A" as const, label: "Nasi Goreng A", color: "text-violet-600", iconBg: "bg-violet-50", dot: "bg-violet-500" },
  { key: "total_B" as const, label: "Nasi Goreng B", color: "text-sky-600", iconBg: "bg-sky-50", dot: "bg-sky-500" },
  { key: "total_C" as const, label: "Nasi Goreng C", color: "text-emerald-600", iconBg: "bg-emerald-50", dot: "bg-emerald-500" },
  { key: "total_D" as const, label: "Nasi Goreng D", color: "text-amber-600", iconBg: "bg-amber-50", dot: "bg-amber-500" },
  { key: "total_E" as const, label: "Nasi Goreng E", color: "text-rose-600", iconBg: "bg-rose-50", dot: "bg-rose-500" },
];

const defaultStats: DashboardStats = {
  total_A: 0,
  total_B: 0,
  total_C: 0,
  total_D: 0,
  total_E: 0,
};

export function DashboardSummaryCards({
  stats = defaultStats,
  isLoading,
}: {
  stats?: DashboardStats;
  isLoading?: boolean;
}) {
  const totalVotes =
    stats.total_A +
    stats.total_B +
    stats.total_C +
    stats.total_D +
    stats.total_E;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-36 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {voteChoices.map((choice) => {
          const votes = stats[choice.key];
          const percent =
            totalVotes > 0
              ? ((votes / totalVotes) * 100).toFixed(1)
              : "0.0";

          return (
            <Card
              key={choice.key}
              className="shadow-lg border border-slate-200 p-0 overflow-hidden"
            >
              <CardContent className="px-5 py-5 flex flex-col gap-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2`}>
                    <span
                      className={`w-3 h-3 rounded-full ${choice.dot}`}
                    />
                    <p className="text-sm font-semibold text-slate-600">
                      {choice.label}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${choice.iconBg} ${choice.color}`}
                  >
                    {percent}%
                  </span>
                </div>

                {/* Vote count */}
                <h3 className={`text-4xl font-extrabold ${choice.color}`}>
                  {votes}
                  <span className="text-base font-medium text-slate-400 ml-1">
                    suara
                  </span>
                </h3>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${choice.dot}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total summary */}
      <div className="text-right text-sm text-slate-500 font-medium">
        Total suara masuk:{" "}
        <span className="text-slate-800 font-bold">{totalVotes}</span>
      </div>
    </div>
  );
}
