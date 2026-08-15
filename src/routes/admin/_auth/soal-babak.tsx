import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { BabakControls } from "@/components/soal-babak/babak-controls";
import { Babak2Controls } from "@/components/soal-babak/babak2-controls";
import { Babak3Controls } from "@/components/soal-babak/babak3-controls";
import { MiniScoreboard } from "@/components/soal-babak/mini-scoreboard";
import { SoundController } from "@/components/soal-babak/sound-controller";
import type { CrosswordClue } from "@/components/proyektor/types";

export const Route = createFileRoute("/admin/_auth/soal-babak")({
  component: AdminSoalBabakPage,
});

function AdminSoalBabakPage() {
  const { state, updateState } = useGameState();
  const [ttsInput, setTtsInput] = useState("");

  const handleSetView = (view: string, round?: number) => {
    updateState((prev) => ({
      ...prev,
      currentView: view,
      activeRound: round ?? prev.activeRound,
      isTimerRunning: false, // Stop timer on transition
    }));
  };

  const triggerSound = (type: "correct" | "wrong" | "timesup") => {
    updateState((prev) => ({
      ...prev,
      soundTrigger: {
        type,
        timestamp: Date.now(),
      },
    }));
  };

  // ─── BABAK 2 (Tebak Gambar) Actions ────────────────────────────────────────

  const handleSetQuestionB2 = (idx: number) => {
    updateState((prev) => ({
      ...prev,
      babak2QuestionIdx: idx,
      babak2RevealedCount: 1, // Reset reveal count to 1 for new question
      timerRemaining: 90, // Reset timer
      isTimerRunning: false,
    }));
  };

  const handleSetRevealCount = (count: number) => {
    updateState((prev) => ({
      ...prev,
      babak2RevealedCount: count,
    }));
  };

  // ─── BABAK 3 (TTS) Actions ──────────────────────────────────────────────────

  const handleSelectClue = (clue: CrosswordClue) => {
    updateState((prev) => ({
      ...prev,
      activeClueNum: clue.number,
      activeClueDir: clue.direction,
    }));
    setTtsInput("");
  };

  const activeClue = state.crossword.clues.find(
    (c) => c.number === state.activeClueNum && c.direction === state.activeClueDir,
  ) || null;

  // Verifikasi jawaban sementara (check)
  const handleCheckTTS = () => {
    if (!activeClue) return;
    const isCorrect = ttsInput.toLowerCase().trim() === activeClue.answer.toLowerCase().trim();

    if (isCorrect) {
      handleRevealTTS();
    } else {
      triggerSound("wrong");
      // Highlight merah sementara di proyektor
      updateState((prev) => {
        const nextGrid = prev.crossword.grid.map((row) =>
          row.map((cell) => {
            const inRange = activeClue.direction === "across"
              ? cell.row === activeClue.startRow && cell.col >= activeClue.startCol && cell.col < activeClue.startCol + activeClue.answer.length
              : cell.col === activeClue.startCol && cell.row >= activeClue.startRow && cell.row < activeClue.startRow + activeClue.answer.length;

            if (inRange) {
              return { ...cell, highlight: "wrong" as const };
            }
            return cell;
          }),
        );
        return {
          ...prev,
          crossword: { ...prev.crossword, grid: nextGrid },
        };
      });

      // Clear highlight setelah 1.5 detik
      setTimeout(() => {
        updateState((prev) => {
          const nextGrid = prev.crossword.grid.map((row) =>
            row.map((cell) => (cell.highlight === "wrong" ? { ...cell, highlight: undefined } : cell)),
          );
          return {
            ...prev,
            crossword: { ...prev.crossword, grid: nextGrid },
          };
        });
      }, 1500);
    }
  };

  // Reveal jawaban ke grid proyektor
  const handleRevealTTS = () => {
    if (!activeClue) return;
    triggerSound("correct");

    updateState((prev) => {
      const nextGrid = prev.crossword.grid.map((row) =>
        row.map((cell) => {
          const inRange = activeClue.direction === "across"
            ? cell.row === activeClue.startRow && cell.col >= activeClue.startCol && cell.col < activeClue.startCol + activeClue.answer.length
            : cell.col === activeClue.startCol && cell.row >= activeClue.startRow && cell.row < activeClue.startRow + activeClue.answer.length;

          if (inRange) {
            const letterIdx = activeClue.direction === "across"
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

      const nextClues = prev.crossword.clues.map((c) =>
        c.number === activeClue.number && c.direction === activeClue.direction
          ? { ...c, answered: true }
          : c,
      );

      return {
        ...prev,
        crossword: {
          ...prev.crossword,
          grid: nextGrid,
          clues: nextClues,
        },
      };
    });

    // Hapus highlight hijau setelah 3 detik
    setTimeout(() => {
      updateState((prev) => {
        const nextGrid = prev.crossword.grid.map((row) =>
          row.map((cell) => (cell.highlight === "correct" ? { ...cell, highlight: undefined } : cell)),
        );
        return {
          ...prev,
          crossword: { ...prev.crossword, grid: nextGrid },
        };
      });
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Pengendali Soal & Babak</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Kontrol halaman proyektor, pemilihan soal, reveal gambar, dan verifikasi TTS.
        </p>
      </div>

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

        {/* Side Panel: Mini Scoreboard & Sound Controller (Kanan) */}
        <div className="flex flex-col gap-6">
          <MiniScoreboard state={state} />
          <SoundController onTriggerSound={triggerSound} />
        </div>
      </div>
    </div>
  );
}
