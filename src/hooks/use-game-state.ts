import { useState, useEffect, useCallback } from "react";
import type {
  Team,
  CrosswordState,
  ScoreChange,
} from "@/components/proyektor/types";
import {
  DUMMY_TEAMS,
  buildCrosswordState,
} from "@/components/proyektor/dummy-data";

import type { ImageQuestion } from "@/services/gameStateService";

export interface GameStateData {
  teams: Team[];
  activeRound: number; // 1-4
  currentView: string; // "judul", "babak1", "babak2", "babak3", "babak4", "skor", "benar", "salah", "review"
  // Timer State
  timerDuration: number;
  timerRemaining: number;
  isTimerRunning: boolean;
  timerEnded: string | null; // ISO timestamp dari backend (kapan timer habis)
  // Babak 2 (Tebak Gambar)
  babak2Questions: ImageQuestion[];
  activeBabak2Num: number | null;
  // Babak 3 (TTS)
  crossword: CrosswordState;
  activeClueNum: number | null;
  activeClueDir: "across" | "down" | null;
  lastScoreChange: ScoreChange | null;
  // Skor yang ditampilkan di layar (RT 01, dll. atau "all" atau "none")
  tampilSkorMode: string; // "1", "2", "3", "4", "5", "all", "none"
}

const STORAGE_KEY = "cc_game_state_v1";
// Naikkan versi ini setiap kali DEFAULT_STATE berubah secara breaking
// agar localStorage lama (yg menyimpan dummy scores) otomatis di-clear
const STATE_VERSION = 5;
const STATE_VERSION_KEY = "cc_game_state_version";

const DEFAULT_STATE: GameStateData = {
  teams: DUMMY_TEAMS,
  activeRound: 1,
  currentView: "judul",
  timerDuration: 90,
  timerRemaining: 90,
  isTimerRunning: false,
  timerEnded: null,
  babak2Questions: [],
  activeBabak2Num: null,
  crossword: buildCrosswordState([]),
  activeClueNum: null,
  activeClueDir: null,
  lastScoreChange: null,
  tampilSkorMode: "all",
};

let globalState: GameStateData = (() => {
  if (typeof window !== "undefined") {
    // Cek versi state — jika beda, clear localStorage dan pakai DEFAULT_STATE
    const savedVersion = localStorage.getItem(STATE_VERSION_KEY);
    if (savedVersion !== String(STATE_VERSION)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STATE_VERSION_KEY, String(STATE_VERSION));
      return DEFAULT_STATE;
    }

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
})();

const listeners = new Set<(state: GameStateData) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        globalState = JSON.parse(e.newValue);
        listeners.forEach((listener) => listener(globalState));
      } catch (_) { }
    }
  });
}

export function useGameState() {
  const [state, setState] = useState<GameStateData>(globalState);

  useEffect(() => {
    listeners.add(setState);
    // Pastikan state tersinkron jika ada perubahan saat mount
    setState(globalState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const updateState = useCallback(
    (updater: (prev: GameStateData) => GameStateData) => {
      globalState = updater(globalState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
      // Notify all listening components di tab ini
      listeners.forEach((listener) => listener(globalState));
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
