import { cn } from "@/lib/utils";
import type { Team, ScoreChange } from "./types";
import { TEAM_COLOR_MAP, getTotalScore } from "./dummy-data";

interface TimScoreCardProps {
  team: Team;
  lastScoreChange?: ScoreChange | null;
  showBabakScore?: number; // jika ada, tampilkan skor babak tertentu
  size?: "sm" | "md" | "lg";
  showTotal?: boolean;
}

export function TimScoreCard({
  team,
  lastScoreChange,
  size = "lg",
  showTotal = false,
}: TimScoreCardProps) {
  const colors = TEAM_COLOR_MAP[team.color];
  const totalScore = getTotalScore(team);
  const isRecentChange =
    lastScoreChange?.teamId === team.id &&
    Date.now() - lastScoreChange.timestamp < 5000;
  const delta = isRecentChange ? lastScoreChange.delta : null;

  const sizeClasses = {
    sm: "p-3 gap-2",
    md: "p-4 gap-3",
    lg: "p-6 gap-4",
  };

  const scoreSizeClasses = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  const nameSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center rounded-2xl border-2 transition-all duration-500 overflow-hidden",
        sizeClasses[size],
        colors.bgLight,
        colors.border,
        isRecentChange && "scale-105",
        isRecentChange && delta && delta > 0
          ? "ring-4 ring-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.4)]"
          : isRecentChange && delta && delta < 0
            ? "ring-4 ring-rose-400/60 shadow-[0_0_30px_rgba(251,113,133,0.4)]"
            : `shadow-lg ${colors.glow}`,
      )}
    >
      {/* Nama Tim */}
      <span
        className={cn(
          "font-extrabold tracking-wide text-white",
          nameSizeClasses[size],
        )}
      >
        {team.name}
      </span>

      {/* Skor Utama */}
      <span
        className={cn(
          "font-black tabular-nums leading-none",
          scoreSizeClasses[size],
          colors.text,
        )}
      >
        {totalScore}
      </span>

      {showTotal && (
        <span className="text-white/50 text-sm font-medium">Total Poin</span>
      )}

      {/* Badge perubahan skor */}
      {isRecentChange && delta !== null && delta !== 0 && (
        <div
          className={cn(
            "absolute top-3 right-3 flex items-center gap-0.5 px-2.5 py-1 rounded-full text-sm font-bold text-white animate-bounce",
            delta > 0 ? "bg-emerald-500" : "bg-rose-500",
          )}
        >
          {delta > 0 ? `+${delta}` : delta}
        </div>
      )}

      {/* Accent bar bawah */}
      <div className={cn("absolute bottom-0 left-0 right-0 h-1", colors.bg)} />
    </div>
  );
}
