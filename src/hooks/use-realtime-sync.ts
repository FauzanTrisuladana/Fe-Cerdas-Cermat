import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getEcho } from "@/lib/echo";
import { useGameState } from "@/hooks/use-game-state";
import type { ScoreEntry } from "@/services/scoreService";
import { calcTimerState } from "@/services/timerService";
import type { TimerData } from "@/services/timerService";

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
        toast.warning(`Timer dijeda pada sisa ${data.remaining} detik`, {
          icon: "⏸️",
        });
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

    // ─── Game State Channel ─────────────────────────────────────────────────
    const gameStateChannel = echo.channel("game-state");

    gameStateChannel.listen(".game.state.updated", (data: any) => {
      // Data dari backend { view: "babak1", babak: "1", tts_active_num: 1, tts_active_dir: 'across', tts_action: 'reveal' }
      updateState((prev) => {
        let nextCrossword = prev.crossword;

        // Jika trigger "lock_input", tampilkan input statis di proyektor tanpa animasi
        if (data.tts_action === "lock_input" && data.tts_active_num && data.tts_active_dir) {
          const activeClue = nextCrossword.clues.find(
            (c) => c.number === data.tts_active_num && c.direction === data.tts_active_dir
          );

          if (activeClue) {
            const tempGrid = nextCrossword.grid.map((row) =>
              row.map((cell) => {
                const inRange =
                  activeClue.direction === "across"
                    ? cell.row === activeClue.startRow &&
                      cell.col >= activeClue.startCol &&
                      cell.col < activeClue.startCol + activeClue.answer.length
                    : cell.col === activeClue.startCol &&
                      cell.row >= activeClue.startRow &&
                      cell.row < activeClue.startRow + activeClue.answer.length;
                
                if (inRange) {
                  const letterIdx =
                    activeClue.direction === "across"
                      ? cell.col - activeClue.startCol
                      : cell.row - activeClue.startRow;
                  const inputChar = (data.tts_input || "")[letterIdx];
                  
                  return { 
                    ...cell, 
                    highlight: undefined, // ensure no red/green highlight
                    tempLetter: inputChar ? inputChar.toUpperCase() : "",
                    tempRevealed: true,
                  };
                }
                return cell;
              })
            );
            nextCrossword = { ...nextCrossword, grid: tempGrid };
          }
        }

        // Jika ada trigger "check_wrong", lakukan highlight merah sementara dan tampilkan huruf yang salah
        if (data.tts_action === "check_wrong" && data.tts_active_num && data.tts_active_dir) {
          const activeClue = nextCrossword.clues.find(
            (c) => c.number === data.tts_active_num && c.direction === data.tts_active_dir
          );

          if (activeClue) {
            const tempGrid = nextCrossword.grid.map((row) =>
              row.map((cell) => {
                const inRange =
                  activeClue.direction === "across"
                    ? cell.row === activeClue.startRow &&
                    cell.col >= activeClue.startCol &&
                    cell.col < activeClue.startCol + activeClue.answer.length
                    : cell.col === activeClue.startCol &&
                    cell.row >= activeClue.startRow &&
                    cell.row < activeClue.startRow + activeClue.answer.length;

                if (inRange) {
                  const letterIdx =
                    activeClue.direction === "across"
                      ? cell.col - activeClue.startCol
                      : cell.row - activeClue.startRow;
                  const inputChar = (data.tts_input || "")[letterIdx];

                  return {
                    ...cell,
                    highlight: "wrong" as const,
                    // Kita simpan huruf salah ke property baru atau ganti sementara (disini ganti sementara)
                    tempLetter: inputChar ? inputChar.toUpperCase() : "",
                    tempRevealed: true,
                  };
                }
                return cell;
              })
            );
            nextCrossword = { ...nextCrossword, grid: tempGrid };

            // Auto-clear highlight dan huruf salah setelah 1.5 detik
            setTimeout(() => {
              updateState((s) => {
                const clearGrid = s.crossword.grid.map((row) =>
                  row.map((cell) =>
                    cell.highlight === "wrong" ? { ...cell, highlight: undefined, tempRevealed: undefined } : cell
                  )
                );
                return { ...s, crossword: { ...s.crossword, grid: clearGrid } };
              });
            }, 1500);
          }
        }

        // Jika ada trigger "reveal", lakukan highlight hijau dan set revealed = true
        if (data.tts_action === "reveal" && data.tts_active_num && data.tts_active_dir) {
          const activeClue = nextCrossword.clues.find(
            (c) => c.number === data.tts_active_num && c.direction === data.tts_active_dir
          );

          if (activeClue) {
            const nextGrid = nextCrossword.grid.map((row) =>
              row.map((cell) => {
                const inRange =
                  activeClue.direction === "across"
                    ? cell.row === activeClue.startRow &&
                    cell.col >= activeClue.startCol &&
                    cell.col < activeClue.startCol + activeClue.answer.length
                    : cell.col === activeClue.startCol &&
                    cell.row >= activeClue.startRow &&
                    cell.row < activeClue.startRow + activeClue.answer.length;

                if (inRange) {
                  const letterIdx =
                    activeClue.direction === "across"
                      ? cell.col - activeClue.startCol
                      : cell.row - activeClue.startRow;
                  return {
                    ...cell,
                    letter: activeClue.answer[letterIdx],
                    revealed: true,
                    highlight: "correct" as const,
                  };
                }
                return cell;
              })
            );

            const nextClues = nextCrossword.clues.map((c) =>
              c.number === data.tts_active_num && c.direction === data.tts_active_dir
                ? { ...c, answered: true }
                : c
            );

            nextCrossword = { ...nextCrossword, grid: nextGrid, clues: nextClues };

            // Auto-clear highlight hijau setelah 3 detik
            setTimeout(() => {
              updateState((s) => {
                const clearGrid = s.crossword.grid.map((row) =>
                  row.map((cell) =>
                    cell.highlight === "correct" ? { ...cell, highlight: undefined } : cell
                  )
                );
                return { ...s, crossword: { ...s.crossword, grid: clearGrid } };
              });
            }, 3000);
          }
        }

        return {
          ...prev,
          currentView: data.view,
          activeRound: parseInt(data.babak) || prev.activeRound,
          activeBabak2Num: data.babak2_active_num !== undefined ? data.babak2_active_num : prev.activeBabak2Num,
          activeClueNum: data.tts_active_num ?? prev.activeClueNum,
          activeClueDir: data.tts_active_dir ?? prev.activeClueDir,
          crossword: nextCrossword,
        };
      });
    });

    return () => {
      scoreChannel.stopListening(".score.col.activity");
      timerChannel.stopListening(".timer.col.activity");
      gameStateChannel.stopListening(".game.state.updated");
    };
  }, [updateState, queryClient]);
}
