import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getEcho } from "@/lib/echo";
import { useGameState } from "@/hooks/use-game-state";
import type { ScoreEntry } from "@/services/scoreService";
import { calcTimerState, type TimerData } from "@/services/timerService";

/**
 * Hook gabungan untuk mendengarkan WebSocket updates:
 * 1. Score channel → update skor tim real-time
 * 2. Timer channel → sinkron timer antar semua device
 *
 * Panggil di layout level agar semua child routes otomatis tersinkron.
 */
export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { updateState } = useGameState();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    // ─── Score Channel ──────────────────────────────────────────────────────
    const scoreChannel = echo.channel("score");

    scoreChannel.listen(".score.col.activity", (data: ScoreEntry) => {
      const teamNum = parseInt(data.team);
      const teamName = `RT ${String(teamNum).padStart(2, "0")}`;
      const delta = data.value;

      // Tampilkan toaster notifikasi
      const verb = delta > 0 ? "Menambahkan" : "Mengurangkan";
      const absDelta = Math.abs(delta);
      if (delta > 0) {
        toast.success(`${verb} ${absDelta} poin ke ${teamName}`);
      } else if (delta < 0) {
        toast.error(`${verb} ${absDelta} poin dari ${teamName}`);
      }

      // Update game state secara real-time
      updateState((prev) => {
        const babak = parseInt(data.babak);
        const roundKey = `babak${babak}` as
          "babak1" | "babak2" | "babak3" | "babak4";

        const nextTeams = prev.teams.map((team, idx) => {
          if (idx + 1 === teamNum) {
            return {
              ...team,
              scores: {
                ...team.scores,
                [roundKey]: team.scores[roundKey] + data.value,
              },
            };
          }
          return team;
        });

        return {
          ...prev,
          teams: nextTeams,
          lastScoreChange: {
            teamId: `rt${String(teamNum).padStart(2, "0")}`,
            delta: data.value,
            timestamp: Date.now(),
          },
        };
      });

      // Invalidate queries untuk refetch data terbaru
      queryClient.invalidateQueries({ queryKey: ["score-detail"] });
      queryClient.invalidateQueries({ queryKey: ["score-summary"] });
    });

    // ─── Timer Channel ──────────────────────────────────────────────────────
    const timerChannel = echo.channel("timer");

    timerChannel.listen(".timer.col.activity", (data: TimerData) => {
      // Tampilkan notifikasi (toast) sesuai dengan state timer yang diterima
      if (data.ended) {
        toast.info("Timer dijalankan", { icon: "▶️" });
      } else if (data.status === "paused") {
        toast.warning(`Timer dijeda pada sisa ${data.remaining} detik`, { icon: "⏸️" });
      } else {
        toast.success(`Timer diatur ke ${data.duration} detik`, { icon: "🔄" });
      }

      const { remaining, isRunning, duration } = calcTimerState(data);

      updateState((prev) => ({
        ...prev,
        timerDuration: duration,
        timerRemaining: remaining,
        isTimerRunning: isRunning,
        // Simpan ended timestamp agar proyektor bisa hitung sendiri
        timerEnded: data.ended,
      }));

      // Invalidate timer query jika ada
      queryClient.invalidateQueries({ queryKey: ["timer"] });
    });

    return () => {
      scoreChannel.stopListening(".score.col.activity");
      timerChannel.stopListening(".timer.col.activity");
    };
  }, [updateState, queryClient]);
}
