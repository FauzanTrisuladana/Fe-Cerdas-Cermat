import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TimScoreCard } from "./tim-score-card";
import { TimerDisplay } from "./timer-display";
import { useGameState } from "@/hooks/use-game-state";

interface Babak14ViewProps {
  babakNumber: 1 | 4;
}

export function Babak14View({ babakNumber }: Babak14ViewProps) {
  const { state, updateState } = useGameState();
  const lastScoreChangeRef = useRef(state.lastScoreChange);

  // Trigger center toast on score update
  useEffect(() => {
    const change = state.lastScoreChange;
    if (change && change !== lastScoreChangeRef.current) {
      lastScoreChangeRef.current = change;
      const team = state.teams.find((t) => t.id === change.teamId);
      if (team) {
        const verb = change.delta > 0 ? "Menambahkan" : "Mengurangkan";
        const absDelta = Math.abs(change.delta);
        toast(`${verb} ${absDelta} poin ke ${team.name}`, {
          position: "top-center",
          duration: 4000,
          className: cn(
            "text-center font-bold text-lg border-2",
            change.delta > 0
              ? "bg-emerald-900/95 border-emerald-500 text-emerald-300"
              : "bg-rose-900/95 border-rose-500 text-rose-300",
          ),
        });
      }
    }
  }, [state.lastScoreChange, state.teams]);

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
          onTimeout={() => {
            updateState((prev) => ({ ...prev, isTimerRunning: false, timerRemaining: 0 }));
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
