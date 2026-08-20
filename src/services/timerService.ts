import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimerData {
  duration: number;
  ended: string | null;
  status: "paused" | null;
}

export interface TimerResponse {
  status: string;
  message: string;
  data: TimerData;
}

export interface SetTimerPayload {
  duration: number;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Hitung sisa detik dan status running dari data timer backend.
 *
 * Logika:
 * - `ended` ada (playing) → sisa = ended - now
 * - `ended` null + status paused → sisa = duration (BE sudah hitung)
 * - `ended` null + status null → idle, sisa = duration
 */
export function calcTimerState(data: TimerData): {
  remaining: number;
  isRunning: boolean;
  duration: number;
} {
  const duration = Math.max(0, Math.ceil(data.duration));

  if (data.ended) {
    // Timer sedang berjalan — hitung sisa dari ended timestamp
    const endedMs = new Date(data.ended).getTime();
    const nowMs = Date.now();
    const remaining = Math.max(0, Math.ceil((endedMs - nowMs) / 1000));

    return { remaining, isRunning: remaining > 0, duration };
  }

  if (data.status === "paused") {
    // Timer dijeda — duration berisi sisa detik
    return { remaining: duration, isRunning: false, duration };
  }

  // Idle — belum play
  return { remaining: duration, isRunning: false, duration };
}

// ─── API Functions ───────────────────────────────────────────────────────────

// Get current timer state
export const getTimer = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const response = await api.get<TimerResponse>("/timer");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
});

// Set timer duration (new value)
export const setTimer = createServerFn({ method: "POST" })
  .validator((data: SetTimerPayload) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<TimerResponse>("/timer/set", data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Play (start/resume) timer
export const playTimer = createServerFn({ method: "POST" }).handler(
  async () => {
    try {
      const response = await api.post<TimerResponse>("/timer/play");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);

// Pause timer
export const pauseTimer = createServerFn({ method: "POST" }).handler(
  async () => {
    try {
      const response = await api.post<TimerResponse>("/timer/pause");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);

// Reset timer (back to original duration)
export const resetTimer = createServerFn({ method: "POST" }).handler(
  async () => {
    try {
      const response = await api.post<TimerResponse>("/timer/reset");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);
