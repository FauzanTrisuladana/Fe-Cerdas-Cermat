import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScoreEntry {
  babak: string;
  team: string;
  value: number;
}

export interface ScoreSummaryEntry {
  team: string;
  total: string;
}

export interface ScoreEachBabakEntry {
  babak: string;
  team: string;
  total: string;
}

export interface ScoreDetailResponse {
  data: ScoreEntry[];
  score_each_babak: ScoreEachBabakEntry[];
  score_summary: ScoreSummaryEntry[];
}

export interface ScoreSummaryResponse {
  data: ScoreSummaryEntry[];
}

export interface StoreScorePayload {
  team: string;
  value: number;
}

export interface StoreScoreResponse {
  data: ScoreEntry;
}

// ─── API Functions ───────────────────────────────────────────────────────────

// Get score summary (total per team)
export const getScoreSummary = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await api.get<ScoreSummaryResponse>("/score/summary");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);

// Get score detail (per babak per team + summaries)
export const getScoreDetail = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await api.get<ScoreDetailResponse>("/score/detail");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);

// Store score (requires auth)
export const storeScore = createServerFn({ method: "POST" })
  .validator((data: StoreScorePayload) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<StoreScoreResponse>("/score/store", data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });
