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
import { updateGameState } from "@/services/gameStateService";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/_auth/soal-babak")({
  component: AdminSoalBabakPage,
});

function AdminSoalBabakPage() {
  const { state, updateState } = useGameState();
  const [ttsInput, setTtsInput] = useState("");

  // ─── WebSocket: skor real-time & timer ──────────────────────────────────────
  useRealtimeSync();

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
        data: {
          currentView: view,
          activeRound: round ?? state.activeRound,
        },
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
      babak2RevealedCount: 1, // Reset reveal count to 1 for new question
      timerRemaining: 90, // Reset timer
      isTimerRunning: false,
    }));
    try {
      await updateGameState({
        data: {
          babak2QuestionIdx: idx,
          babak2RevealedCount: 1,
        },
      });
    } catch (e) {
      toast.error("Gagal broadcast ubah pertanyaan tebak gambar.");
    }
  };

  const handleSetRevealCount = async (count: number) => {
    updateState((prev) => ({
      ...prev,
      babak2RevealedCount: count,
    }));
    try {
      await updateGameState({ data: { babak2RevealedCount: count } });
    } catch (e) {
      toast.error("Gagal broadcast reveal count tebak gambar.");
    }
  };

  // ─── BABAK 3 (TTS) Actions ──────────────────────────────────────────────────

  const handleSelectClue = async (clue: CrosswordClue) => {
    updateState((prev) => ({
      ...prev,
      activeClueNum: clue.number,
      activeClueDir: clue.direction,
    }));
    setTtsInput("");
    try {
      await updateGameState({
        data: {
          activeClueNum: clue.number,
          activeClueDir: clue.direction,
        },
      });
    } catch (e) {
      toast.error("Gagal broadcast pilih TTS.");
    }
  };

  const activeClue =
    state.crossword.clues.find(
      (c) =>
        c.number === state.activeClueNum && c.direction === state.activeClueDir,
    ) || null;

  // Verifikasi jawaban sementara (check)
  const handleCheckTTS = () => {
    if (!activeClue) return;
    const isCorrect =
      ttsInput.toLowerCase().trim() === activeClue.answer.toLowerCase().trim();

    if (isCorrect) {
      handleRevealTTS();
    } else {
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
      updateGameState({ data: { crossword: newCrossword } }).catch(() => {
        toast.error("Gagal sinkronisasi highlight merah TTS.");
      });

      // Clear highlight setelah 1.5 detik
      setTimeout(() => {
        const clearGrid = newCrossword.grid.map((row) =>
          row.map((cell) =>
            cell.highlight === "wrong"
              ? { ...cell, highlight: undefined }
              : cell,
          ),
        );
        const clearCrossword = { ...newCrossword, grid: clearGrid };
        updateState((prev) => ({
          ...prev,
          crossword: clearCrossword,
        }));
        updateGameState({ data: { crossword: clearCrossword } }).catch(
          () => {},
        );
      }, 1500);
    }
  };

  // Reveal jawaban ke grid proyektor
  const handleRevealTTS = () => {
    if (!activeClue) return;

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
    updateGameState({ data: { crossword: newCrossword } }).catch(() => {
      toast.error("Gagal sinkronisasi jawaban TTS.");
    });

    // Hapus highlight hijau setelah 3 detik
    setTimeout(() => {
      const clearGrid = newCrossword.grid.map((row) =>
        row.map((cell) =>
          cell.highlight === "correct"
            ? { ...cell, highlight: undefined }
            : cell,
        ),
      );
      const clearCrossword = { ...newCrossword, grid: clearGrid };

      updateState((prev) => ({
        ...prev,
        crossword: clearCrossword,
      }));
      updateGameState({ data: { crossword: clearCrossword } }).catch(() => {});
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
              onSetRevealCount={handleSetRevealCount}
            />
          )}

          {/* Babak 3 Controls */}
          {state.activeRound === 3 && state.currentView === "babak3" && (
            <Babak3Controls
              state={state}
              onCheckTTS={handleCheckTTS}
              onRevealTTS={handleRevealTTS}
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
