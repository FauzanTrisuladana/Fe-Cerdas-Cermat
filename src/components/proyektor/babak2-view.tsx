import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { TimScoreCard } from "./tim-score-card";
import { TimerDisplay } from "./timer-display";
import { useGameState } from "@/hooks/use-game-state";
import { useScoreWebSocket } from "@/hooks/use-score-websocket";
import { DUMMY_IMAGE_QUESTIONS } from "./dummy-data";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getScoreDetail } from "@/services/scoreService";
import type { ScoreEntry } from "@/services/scoreService";

export function Babak2View() {
  const { state, updateState } = useGameState();

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

  const currentQuestion =
    DUMMY_IMAGE_QUESTIONS[state.babak2QuestionIdx] || DUMMY_IMAGE_QUESTIONS[0];
  const totalQuestions = DUMMY_IMAGE_QUESTIONS.length;

  // ─── Tampilan transisi skor ───────────────────────────────────────────────
  if (state.currentView === "score-transition") {
    return (
      <div className="flex flex-col h-full justify-between gap-6 py-4 animate-in fade-in duration-500">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">
            Skor Sementara
          </h1>
          <p className="text-white/50 mt-1">
            Menunggu Operator Admin untuk memindahkan ke soal berikutnya...
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

  // ─── Tampilan soal gambar ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full gap-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-3xl font-black text-white tracking-wide">
            Babak 2 — Tebak Gambar
          </h1>
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mt-0.5">
            Soal {state.babak2QuestionIdx + 1} dari {totalQuestions}
          </p>
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

      {/* Grid 2x2 gambar */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 max-h-[70vh]">
        {currentQuestion.images.map((src, imgIdx) => {
          const isRevealed = imgIdx < state.babak2RevealedCount;
          return (
            <div
              key={imgIdx}
              className={cn(
                "relative rounded-2xl overflow-hidden border-2 bg-slate-900 flex items-center justify-center transition-all duration-500 shadow-2xl",
                isRevealed
                  ? "border-white/20 opacity-100 scale-100"
                  : "border-white/5 opacity-50 scale-95",
              )}
            >
              {isRevealed ? (
                <img
                  src={src}
                  alt={`Gambar ${imgIdx + 1}`}
                  className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-white/20 text-7xl font-black">?</span>
                  <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Terkunci
                  </span>
                </div>
              )}
              {/* Nomor gambar */}
              <div className="absolute top-3 left-3 bg-black/75 border border-white/10 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                {imgIdx + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
