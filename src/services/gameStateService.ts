import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

export interface GameStateAPIResponse {
  view: string;
  babak: string;
}

export interface UpdateGameStatePayload {
  view: string;
}

interface GameStateResponse {
  status: string;
  message: string;
  data: GameStateAPIResponse;
}

/**
 * Mengambil state game terakhir dari server
 */
export const getGameState = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await api.get<GameStateResponse>("/game-state");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);

/**
 * Menyimpan/memperbarui state game di server (khusus pindah halaman)
 */
export const updateGameState = createServerFn({ method: "POST" })
  .validator((d: UpdateGameStatePayload) => d)
  .handler(async ({ data: payload }) => {
    try {
      const response = await api.post<GameStateResponse>(
        "/game-state",
        payload,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

export interface CrosswordAPIResponse {
  clues: any[];
}

export const getCrosswordData = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await api.get<{ status: string; data: CrosswordAPIResponse }>("/crossword");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
);
