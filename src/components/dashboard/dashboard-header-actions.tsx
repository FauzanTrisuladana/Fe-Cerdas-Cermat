import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const REFRESH_INTERVAL = 10;

interface DashboardHeaderActionsProps {
  query: ReturnType<typeof useQuery>;
  onManualRefresh: () => void;
}

export const DashboardHeaderActions = ({
  query,
  onManualRefresh,
}: DashboardHeaderActionsProps) => {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refetchRef = useRef(query.refetch);

  // Keep refetch ref up to date
  useEffect(() => {
    refetchRef.current = query.refetch;
  }, [query.refetch]);

  // Reset countdown every time a fetch completes (success or error)
  useEffect(() => {
    if (!query.isFetching) {
      setCountdown(REFRESH_INTERVAL);
    }
  }, [query.isFetching]);

  // Tick countdown every second; refetch when it hits 0
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refetchRef.current();
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Circle progress for countdown
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (countdown / REFRESH_INTERVAL) * circumference;

  return (
    <div className="flex items-center gap-3 pt-4">
      {/* Countdown badge */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
        {/* SVG ring */}
        <svg width="28" height="28" className="-rotate-90">
          {/* Track */}
          <circle
            cx="14"
            cy="14"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          {/* Progress */}
          <circle
            cx="14"
            cy="14"
            r={radius}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="text-sm font-semibold text-slate-700 tabular-nums w-6 text-center">
          {countdown}s
        </span>
        <span className="text-xs text-slate-400 hidden sm:inline">
          auto-refresh
        </span>
      </div>

      {/* Refresh button */}
      <button
        onClick={onManualRefresh}
        disabled={query.isFetching}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
      >
        <RefreshCw
          className={`w-4 h-4 ${query.isFetching ? "animate-spin" : ""}`}
        />
        <span>{query.isFetching ? "Memuat..." : "Refresh"}</span>
      </button>
    </div>
  );
};
