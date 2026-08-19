import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TimScoreCard } from "./tim-score-card";
import { TimerDisplay } from "./timer-display";
import { useGameState } from "@/hooks/use-game-state";
import { useScoreWebSocket } from "@/hooks/use-score-websocket";
import type { CrosswordCell, CrosswordClue } from "./types";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getScoreDetail } from "@/services/scoreService";
import type { ScoreEntry } from "@/services/scoreService";

function playSound(type: "correct" | "wrong" | "countdown" | "timesup") {
  const audioMap: Record<string, string> = {
    correct: "/correct.mp3",
    wrong: "/wrong.mp3",
    countdown: "/countdown.mp3",
    timesup: "/timesup.mp3",
  };
  try {
    const audio = new Audio(audioMap[type]);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  } catch (_) {}
}

export function Babak3View() {
  const { state, updateState } = useGameState();
  const soundTimestampRef = useRef(state.soundTrigger.timestamp);

  // ─── WebSocket: Listen for real-time score updates ─────────────────────────
  useScoreWebSocket();

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

  // Trigger sound effect
  useEffect(() => {
    const trigger = state.soundTrigger;
    if (trigger.type && trigger.timestamp !== soundTimestampRef.current) {
      soundTimestampRef.current = trigger.timestamp;
      playSound(trigger.type);
    }
  }, [state.soundTrigger]);

  // Find active clue
  const activeClue =
    state.crossword.clues.find(
      (c) =>
        c.number === state.activeClueNum && c.direction === state.activeClueDir,
    ) || null;

  // ─── Tampilan transisi skor ───────────────────────────────────────────────
  if (state.currentView === "score-transition") {
    return (
      <div className="flex flex-col h-full justify-between gap-6 py-4 animate-in fade-in duration-500">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">
            Skor Sementara
          </h1>
          <p className="text-white/50 mt-1">
            Menunggu Operator Admin untuk kembali ke permainan...
          </p>
        </div>
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

  return (
    <div className="flex flex-col h-full gap-3 py-2">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-3xl font-black text-white tracking-wide">
            Babak 3 — Teka Teki Silang
          </h1>
          {activeClue ? (
            <div className="mt-2 bg-blue-950/80 border border-blue-500/30 rounded-xl px-5 py-2.5 max-w-2xl shadow-lg">
              <span className="text-amber-400 font-extrabold text-base mr-2 uppercase tracking-wider">
                Pertanyaan {activeClue.number}{" "}
                {activeClue.direction === "across" ? "Mendatar" : "Menurun"}:
              </span>
              <p className="text-white text-base font-semibold leading-relaxed mt-1">
                {activeClue.text}
              </p>
            </div>
          ) : (
            <p className="text-white/50 text-sm mt-1">
              Silakan pilih clue di panel admin untuk memulai kuis.
            </p>
          )}
        </div>
        <TimerDisplay
          initialSeconds={state.timerRemaining}
          isRunning={state.isTimerRunning}
          onTimeout={() => {
            updateState((prev) => ({
              ...prev,
              isTimerRunning: false,
              timerRemaining: 0,
            }));
          }}
          size="md"
        />
      </div>

      <div className="flex-1 flex items-center justify-center overflow-auto py-4">
        <CrosswordGrid grid={state.crossword.grid} activeClue={activeClue} />
      </div>
    </div>
  );
}

// ─── Grid TTS Component ───────────────────────────────────────────────────────

function CrosswordGrid({
  grid,
  activeClue,
}: {
  grid: CrosswordCell[][];
  activeClue: CrosswordClue | null;
}) {
  const CELL_SIZE = 44; // Scale up for projector

  return (
    <div
      className="border-2 border-white/20 rounded-2xl overflow-hidden shadow-2xl p-2 bg-slate-900/60"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${grid.length}, ${CELL_SIZE}px)`,
        gap: "4px",
      }}
    >
      {grid.map((row) =>
        row.map((cell) => {
          if (cell.isBlocked) {
            return (
              <div
                key={`${cell.row}-${cell.col}`}
                className="bg-slate-950 rounded-md transition-colors duration-300"
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              />
            );
          }

          // Check if cell is in active clue
          const isInActiveClue = activeClue
            ? activeClue.direction === "across"
              ? cell.row === activeClue.startRow &&
                cell.col >= activeClue.startCol &&
                cell.col < activeClue.startCol + activeClue.answer.length
              : cell.col === activeClue.startCol &&
                cell.row >= activeClue.startRow &&
                cell.row < activeClue.startRow + activeClue.answer.length
            : false;

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className={cn(
                "relative flex items-center justify-center rounded-md font-black select-none transition-all duration-300 border",
                cell.highlight === "correct"
                  ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105 animate-[bounce_0.5s_ease-in-out]"
                  : cell.highlight === "wrong"
                    ? "bg-rose-600 border-rose-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-95 animate-[shake_0.4s_ease-in-out]"
                    : isInActiveClue
                      ? "bg-amber-600/70 border-amber-400 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      : "bg-slate-800 border-white/10 text-white/90",
              )}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            >
              {/* Nomor cell */}
              {cell.number && (
                <span className="absolute top-1 left-1.5 text-[10px] text-white/50 font-bold leading-none">
                  {cell.number}
                </span>
              )}
              {/* Huruf */}
              <span
                className={cn(
                  "text-lg font-black transition-all duration-300",
                  cell.revealed
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75",
                )}
              >
                {cell.letter}
              </span>
            </div>
          );
        }),
      )}
    </div>
  );
}
