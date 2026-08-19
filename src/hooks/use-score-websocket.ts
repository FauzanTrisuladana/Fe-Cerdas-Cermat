import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getEcho } from "@/lib/echo";
import { useGameState } from "@/hooks/use-game-state";
import type { ScoreEntry } from "@/services/scoreService";

/**
 * Hook untuk mendengarkan WebSocket score updates.
 * Ketika ada perubahan skor dari backend, hook ini akan:
 * 1. Mengupdate game state secara real-time
 * 2. Menampilkan toaster notifikasi
 * 3. Invalidasi query skor untuk refetch
 */
export function useScoreWebSocket() {
  const queryClient = useQueryClient();
  const { updateState } = useGameState();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel("score");

    channel.listen(".score.col.activity", (data: ScoreEntry) => {
      console.log(data);
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

    return () => {
      channel.stopListening(".score.col.activity");
    };
  }, [updateState, queryClient]);
}
