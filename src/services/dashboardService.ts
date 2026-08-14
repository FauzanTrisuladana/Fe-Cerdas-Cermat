import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// Types
export type DashboardData = {
  total_A: number;
  total_B: number;
  total_C: number;
  total_D: number;
  total_E: number;
};

export type DashboardResponse = {
  status: string;
  message: string;
  data: DashboardData;
};

// Get dashboard data
export const getDashboard = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const response = await api.get<DashboardResponse>("/dashboard");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });
