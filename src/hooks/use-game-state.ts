import { useState, useEffect, useCallback } from "react";
import type {
  Team,
  CrosswordState,
  ScoreChange,
} from "@/components/proyektor/types";
import {
  DUMMY_TEAMS,
  DUMMY_CROSSWORD,
} from "@/components/proyektor/dummy-data";

export interface GameStateData {
  teams: Team[];
  activeRound: number; // 1-4
  currentView: string; // "judul", "babak1", "babak2", "babak3", "babak4", "skor", "benar", "salah", "review"
  // Timer State
  timerDuration: number;
  timerRemaining: number;
  isTimerRunning: boolean;
  // Babak 2 (Tebak Gambar)
  babak2QuestionIdx: number;
  babak2RevealedCount: number;
  // Babak 3 (TTS)
  crossword: CrosswordState;
  activeClueNum: number | null;
  activeClueDir: "across" | "down" | null;
  // Audio & Event Trigger (Timestamp to trigger play on proyektor)
  soundTrigger: {
    type: "correct" | "wrong" | "countdown" | "timesup" | null;
    timestamp: number;
  };
  lastScoreChange: ScoreChange | null;
  // Skor yang ditampilkan di layar (RT 01, dll. atau "all" atau "none")
  tampilSkorMode: string; // "1", "2", "3", "4", "5", "all", "none"
}

const STORAGE_KEY = "cc_game_state_v1";

const DEFAULT_STATE: GameStateData = {
  teams: DUMMY_TEAMS,
  activeRound: 1,
  currentView: "judul",
  timerDuration: 90,
  timerRemaining: 90,
  isTimerRunning: false,
  babak2QuestionIdx: 0,
  babak2RevealedCount: 1,
  crossword: DUMMY_CROSSWORD,
  activeClueNum: null,
  activeClueDir: null,
  soundTrigger: { type: null, timestamp: 0 },
  lastScoreChange: null,
  tampilSkorMode: "all",
};

export function useGameState() {
  const [state, setState] = useState<GameStateData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (_) {
          return DEFAULT_STATE;
        }
      }
    }
    return DEFAULT_STATE;
  });

  // Listen to storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch (_) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update helper
  const updateState = useCallback(
    (updater: (prev: GameStateData) => GameStateData) => {
      setState((prev) => {
        const next = updater(prev);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const resetState = useCallback(() => {
    updateState(() => DEFAULT_STATE);
  }, [updateState]);

  return {
    state,
    updateState,
    resetState,
  };
}
