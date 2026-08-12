import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// Types
export type VoteChoice = "A" | "B" | "C" | "D" | "E";

export type TokenCheckResponse = {
  status: string;
  message: string;
  data: {
    code: string;
    already_vote: boolean;
  };
};

export type VoteSubmitResponse = {
  status: string;
  message: string;
  data: {
    code: string;
    already_vote: boolean;
    vote: {
      id: number;
    };
  };
};

export type VoteResult = {
  id: number;
};

/**
 * Check if a voter code token is valid and not yet used.
 * GET /api/vote/token?code={code}
 */
export const checkToken = createServerFn({ method: "GET" })
  .validator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<TokenCheckResponse>("/vote/token", {
        params: { code: data.code },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

/**
 * Submit a vote for a voter code.
 * POST /api/vote
 */
export const submitVote = createServerFn({ method: "POST" })
  .validator((data: { voter_code: string; vote_choice: VoteChoice }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<VoteSubmitResponse>("/vote", data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });
