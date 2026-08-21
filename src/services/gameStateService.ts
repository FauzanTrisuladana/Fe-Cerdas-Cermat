import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";
import type { GameStateData } from "@/hooks/use-game-state";

interface GameStateResponse {
  status: string;
  message: string;
  data: Partial<GameStateData>;
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
 * Menyimpan/memperbarui state game di server
 */
export const updateGameState = createServerFn({ method: "POST" })
  .validator((d: Partial<GameStateData>) => d)
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
