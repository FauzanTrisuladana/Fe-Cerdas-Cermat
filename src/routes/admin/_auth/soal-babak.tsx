import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { BabakControls } from "@/components/soal-babak/babak-controls";
import { Babak2Controls } from "@/components/soal-babak/babak2-controls";
import { Babak3Controls } from "@/components/soal-babak/babak3-controls";
import { MiniScoreboard } from "@/components/soal-babak/mini-scoreboard";
import HeaderComp from "@/components/shared/header-comp";
import { Monitor } from "lucide-react";
import type { CrosswordClue } from "@/components/proyektor/types";
import { updateGameState, getCrosswordData } from "@/services/gameStateService";
import { buildCrosswordState } from "@/components/proyektor/dummy-data";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/admin/_auth/soal-babak")({
  component: AdminSoalBabakPage,
});

function AdminSoalBabakPage() {
  const { state, updateState } = useGameState();
  const [ttsInput, setTtsInput] = useState("");

  // ─── WebSocket: skor real-time & timer ──────────────────────────────────────
  useRealtimeSync();

  // ─── Fetch Crossword Data ───────────────────────────────────────────────────
  const getCrosswordFn = useServerFn(getCrosswordData);
  useQuery({
    queryKey: ["crossword-initial"],
    queryFn: async () => {
      try {
        const response = await getCrosswordFn();
        if (response?.data?.clues) {
          const crosswordData = buildCrosswordState(response.data.clues);
          updateState((prev) => ({
            ...prev,
            crossword: crosswordData,
          }));
        }
        return response;
      } catch (error) {
        console.error("Failed to fetch crossword data:", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const handleSetView = async (view: string, round?: number) => {
    // 1. Update local state optimistically
    updateState((prev) => ({
      ...prev,
      currentView: view,
      activeRound: round ?? prev.activeRound,
      isTimerRunning: false, // Stop timer on transition
    }));

    // 2. Broadcast ke proyektor via API
    try {
      await updateGameState({
        data: { view },
      });
    } catch (error) {
      toast.error("Gagal melakukan broadcast pindah halaman.");
    }
  };

  // ─── BABAK 2 (Tebak Gambar) Actions ────────────────────────────────────────

  const handleSetQuestionB2 = async (idx: number) => {
    updateState((prev) => ({
      ...prev,
      babak2QuestionIdx: idx,
      timerRemaining: 90, // Reset timer
      isTimerRunning: false,
    }));
  };

  // ─── BABAK 3 (TTS) Actions ──────────────────────────────────────────────────

  const handleSelectClue = async (clue: CrosswordClue) => {
    // Update local state optimistically
    updateState((prev) => ({
      ...prev,
      activeClueNum: clue.number,
      activeClueDir: clue.direction,
    }));
    setTtsInput("");

    // Broadcast to projector
    try {
      await updateGameState({
        data: {
          tts_active_num: clue.number,
          tts_active_dir: clue.direction,
        },
      });
    } catch (error) {
      toast.error("Gagal sinkronisasi clue ke proyektor.");
    }
  };

  const activeClue =
    state.crossword.clues.find(
      (c) =>
        c.number === state.activeClueNum && c.direction === state.activeClueDir,
    ) || null;

  // Kunci jawaban sementara ke layar proyektor (tanpa animasi)
  const handleLockTTS = async () => {
    if (!activeClue) return;
    try {
      await updateGameState({
        data: {
          tts_active_num: activeClue.number,
          tts_active_dir: activeClue.direction,
          tts_action: "lock_input",
          tts_input: ttsInput,
        },
      });
      toast.success("Input dikunci di layar proyektor");
    } catch (error) {
      toast.error("Gagal mengunci input");
    }
  };

  // Verifikasi jawaban sementara (check)
  const handleCheckTTS = async () => {
    if (!activeClue) return;
    const isCorrect =
      ttsInput.toLowerCase().trim() === activeClue.answer.toLowerCase().trim();

    if (isCorrect) {
      await handleRevealTTS();
    } else {
      // Highlight merah sementara di lokal
      const nextGrid = state.crossword.grid.map((row) =>
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
            return { ...cell, highlight: "wrong" as const };
          }
          return cell;
        }),
      );

      const newCrossword = { ...state.crossword, grid: nextGrid };

      updateState((prev) => ({
        ...prev,
        crossword: newCrossword,
      }));

      // Broadcast animasi salah (check_wrong) dan tampilkan huruf yang salah
      try {
        await updateGameState({
          data: {
            tts_active_num: activeClue.number,
            tts_active_dir: activeClue.direction,
            tts_action: "check_wrong",
            tts_input: ttsInput,
          },
        });
      } catch (error) {}

      // Clear highlight setelah 1.5 detik (lokal)
      setTimeout(() => {
        updateState((prev) => {
          const clearGrid = prev.crossword.grid.map((row) =>
            row.map((cell) =>
              cell.highlight === "wrong"
                ? { ...cell, highlight: undefined }
                : cell,
            ),
          );
          return { ...prev, crossword: { ...prev.crossword, grid: clearGrid } };
        });
      }, 1500);
    }
  };

  // Reveal jawaban ke grid proyektor
  const handleRevealTTS = async () => {
    if (!activeClue) return;

    // Reveal lokal
    const nextGrid = state.crossword.grid.map((row) =>
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
      }),
    );

    const nextClues = state.crossword.clues.map((c) =>
      c.number === activeClue.number && c.direction === activeClue.direction
        ? { ...c, answered: true }
        : c,
    );

    const newCrossword = {
      ...state.crossword,
      grid: nextGrid,
      clues: nextClues,
    };

    updateState((prev) => ({
      ...prev,
      crossword: newCrossword,
    }));

    // Broadcast reveal (ini juga akan mengupdate tabel questions di database)
    try {
      await updateGameState({
        data: {
          tts_active_num: activeClue.number,
          tts_active_dir: activeClue.direction,
          tts_action: "reveal",
        },
      });
      toast.success("Jawaban berhasil dibuka di proyektor");
    } catch (error) {
      toast.error("Gagal sinkronisasi reveal ke proyektor.");
    }

    // Hapus highlight hijau setelah 3 detik (lokal)
    setTimeout(() => {
      updateState((prev) => {
        const clearGrid = prev.crossword.grid.map((row) =>
          row.map((cell) =>
            cell.highlight === "correct"
              ? { ...cell, highlight: undefined }
              : cell,
          ),
        );
        return { ...prev, crossword: { ...prev.crossword, grid: clearGrid } };
      });
    }, 3000);
  };

  return (
    <>
      <HeaderComp
        title="Pengendali Soal & Babak"
        description="Kontrol halaman proyektor, pemilihan soal, reveal gambar, dan verifikasi TTS."
        icon={<Monitor />}
      />

      {/* Grid Utama */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Panel Pengendali Babak (Kiri) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <BabakControls state={state} onSetView={handleSetView} />

          {/* Babak 2 Controls */}
          {state.activeRound === 2 && state.currentView === "babak2" && (
            <Babak2Controls
              state={state}
              onSetQuestion={handleSetQuestionB2}
            />
          )}

          {/* Babak 3 Controls */}
          {state.activeRound === 3 && state.currentView === "babak3" && (
            <Babak3Controls
              state={state}
              onCheckTTS={handleCheckTTS}
              onRevealTTS={handleRevealTTS}
              onLockTTS={handleLockTTS}
              onSelectClue={handleSelectClue}
              ttsInput={ttsInput}
              onTtsInputChange={setTtsInput}
            />
          )}
        </div>

        {/* Side Panel: Mini Scoreboard (Kanan) */}
        <div className="flex flex-col gap-6">
          <MiniScoreboard state={state} />
        </div>
      </div>
    </>
  );
}
