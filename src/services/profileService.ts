import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";
import type { User } from "./authService";

export type ProfileResponse = {
  status: string;
  message: string;
  data: User;
};

export const getProfile = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await api.get<ProfileResponse>("/profile/me");
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },
);
