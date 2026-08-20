import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { TimScoreCard } from "./tim-score-card";
import { TimerDisplay } from "./timer-display";
import { useGameState } from "@/hooks/use-game-state";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getScoreDetail } from "@/services/scoreService";
import type { ScoreEntry } from "@/services/scoreService";

interface Babak14ViewProps {
  babakNumber: 1 | 4;
}

export function Babak14View({ babakNumber }: Babak14ViewProps) {
  const { state, updateState } = useGameState();

  // ─── API: Fetch score detail for sync ──────────────────────────────────────
  const getScoreDetailFn = useServerFn(getScoreDetail);

  const { data: detailData } = useQuery({
    queryKey: ["score-detail"],
    queryFn: async () => {
      const response = await getScoreDetailFn();
      return response;
    },
    staleTime: 1000 * 60 * 2,
  });

  // ─── Sync API data ke game state ───────────────────────────────────────────
  useEffect(() => {
    if (!detailData) return;

    const { data: entries } = detailData;

    // Build per-team per-babak scores from detail entries
    const teamScores: Record<string, Record<number, number>> = {};
    entries.forEach((entry: ScoreEntry) => {
      const team = entry.team;
      const babak = parseInt(entry.babak);
      if (!teamScores[team]) {
        teamScores[team] = {};
      }
      teamScores[team][babak] = (teamScores[team][babak] || 0) + entry.value;
    });

    // Update game state teams with API scores
    updateState((prev) => {
      const nextTeams = prev.teams.map((team, idx) => {
        const teamNum = idx + 1;
        const scores = teamScores[String(teamNum)] || {};
        return {
          ...team,
          scores: {
            babak1: scores[1] || 0,
            babak2: scores[2] || 0,
            babak3: scores[3] || 0,
            babak4: scores[4] || 0,
          },
        };
      });

      return {
        ...prev,
        teams: nextTeams,
      };
    });
  }, [detailData, updateState]);

  const babakName =
    babakNumber === 1 ? "Babak 1 — Paket Soal" : "Babak 4 — Soal Rebutan";

  return (
    <div className="flex flex-col h-full justify-between gap-6 py-4">
      {/* Header Babak */}
      <div className="text-center">
        <h1 className="text-5xl font-black text-white tracking-wider">
          {babakName}
        </h1>
        <div className="mt-2 mx-auto w-32 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full" />
      </div>

      {/* Timer */}
      <div className="flex justify-center my-4">
        <TimerDisplay
          initialSeconds={state.timerRemaining}
          isRunning={state.isTimerRunning}
          timerEnded={state.timerEnded}
          onTimeout={() => {
            updateState((prev) => ({
              ...prev,
              isTimerRunning: false,
              timerRemaining: 0,
            }));
          }}
          size="xl"
        />
      </div>

      {/* Grid 5 Tim */}
      <div className="flex-1 grid grid-cols-5 gap-6 items-center px-4 max-h-[45vh]">
        {state.teams.map((team, idx) => {
          const isVisible =
            state.tampilSkorMode === "all" ||
            state.tampilSkorMode === String(idx + 1);

          return (
            <div
              key={team.id}
              className={cn(
                "transition-all duration-500 transform",
                isVisible
                  ? "opacity-100 scale-100"
                  : "opacity-20 scale-95 pointer-events-none filter blur-[1px]",
              )}
            >
              <TimScoreCard
                team={team}
                lastScoreChange={state.lastScoreChange}
                size="lg"
                showTotal
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
