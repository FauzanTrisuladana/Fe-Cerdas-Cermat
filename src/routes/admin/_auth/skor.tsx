import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useGameState } from "@/hooks/use-game-state";
import { useScoreWebSocket } from "@/hooks/use-score-websocket";
import { ScoreTable } from "@/components/skor/score-table";
import { ScoreSummary } from "@/components/skor/score-summary";
import HeaderComp from "@/components/shared/header-comp";
import type { ScoreChange } from "@/components/proyektor/types";
import {
  getScoreDetail,
  getScoreSummary,
  storeScore,
} from "@/services/scoreService";
import type { ScoreEntry, ScoreSummaryEntry } from "@/services/scoreService";

export const Route = createFileRoute("/admin/_auth/skor")({
  component: AdminSkorPage,
});

function AdminSkorPage() {
  const { state, updateState } = useGameState();
  const queryClient = useQueryClient();
  const [tempScores, setTempScores] = useState<Record<string, number>>({});

  // ─── WebSocket: Listen for real-time score updates ─────────────────────────
  useScoreWebSocket();

  // ─── API: Fetch score detail & summary ─────────────────────────────────────
  const getScoreDetailFn = useServerFn(getScoreDetail);
  const getScoreSummaryFn = useServerFn(getScoreSummary);
  const storeScoreFn = useServerFn(storeScore);

  const { data: detailData } = useQuery({
    queryKey: ["score-detail"],
    queryFn: async () => {
      const response = await getScoreDetailFn();
      return response;
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: summaryData } = useQuery({
    queryKey: ["score-summary"],
    queryFn: async () => {
      const response = await getScoreSummaryFn();
      return response;
    },
    staleTime: 1000 * 60 * 2,
  });

  // ─── Sync API data ke game state ───────────────────────────────────────────
  useEffect(() => {
    if (!detailData) return;

    const { data: entries } = detailData;

    // Build per-team per-babak scores from detail entries
    const teamScores: Record<string, Record<number, number>> = {};
    entries.forEach((entry: ScoreEntry) => {
      const team = entry.team;
      const babak = parseInt(entry.babak);
      if (!teamScores[team]) {
        teamScores[team] = {};
      }
      teamScores[team][babak] = (teamScores[team][babak] || 0) + entry.value;
    });

    // Update game state teams with API scores
    updateState((prev) => {
      const nextTeams = prev.teams.map((team, idx) => {
        const teamNum = idx + 1;
        const scores = teamScores[String(teamNum)] || {};
        return {
          ...team,
          scores: {
            babak1: scores[1] || 0,
            babak2: scores[2] || 0,
            babak3: scores[3] || 0,
            babak4: scores[4] || 0,
          },
        };
      });

      return {
        ...prev,
        teams: nextTeams,
      };
    });
  }, [detailData, updateState]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleScoreChange = async (teamId: string, delta: number) => {
    const teamIdx = state.teams.findIndex((t) => t.id === teamId);
    const teamNum = teamIdx + 1;
    const roundKey = `babak${state.activeRound}` as
      "babak1" | "babak2" | "babak3" | "babak4";
    const currentScore = state.teams[teamIdx]?.scores[roundKey] || 0;
    const newScore = Math.max(0, currentScore + delta);
    const value = newScore - currentScore;

    try {
      await storeScoreFn({
        data: { team: String(teamNum), value },
      });

      // Update local state
      updateState((prev) => {
        const nextTeams = prev.teams.map((team) => {
          if (team.id === teamId) {
            return {
              ...team,
              scores: {
                ...team.scores,
                [roundKey]: newScore,
              },
            };
          }
          return team;
        });

        const change: ScoreChange = {
          teamId,
          delta,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          teams: nextTeams,
          lastScoreChange: change,
        };
      });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["score-detail"] });
      queryClient.invalidateQueries({ queryKey: ["score-summary"] });
      toast.success(
        `Skor ${teamId} diperbarui: ${value > 0 ? "+" : ""}${value}`,
      );
      setTempScores({});
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal memperbarui skor";
      toast.error(msg);
    }
  };

  const handleManualSetScore = (teamId: string, valueStr: string) => {
    const value = parseInt(valueStr) || 0;
    setTempScores((prev) => ({ ...prev, [teamId]: value }));
  };

  const handleApplyManualScore = async (teamId: string) => {
    const delta = tempScores[teamId];
    if (!delta && delta !== 0) return;

    const teamIdx = state.teams.findIndex((t) => t.id === teamId);
    const teamNum = teamIdx + 1;
    const roundKey = `babak${state.activeRound}` as
      "babak1" | "babak2" | "babak3" | "babak4";
    const currentScore = state.teams[teamIdx]?.scores[roundKey] || 0;
    const newScore = Math.max(0, currentScore + delta);

    try {
      await storeScoreFn({
        data: { team: String(teamNum), value: delta },
      });

      updateState((prev) => {
        const nextTeams = prev.teams.map((team) => {
          if (team.id === teamId) {
            return {
              ...team,
              scores: {
                ...team.scores,
                [roundKey]: newScore,
              },
            };
          }
          return team;
        });

        const change: ScoreChange = {
          teamId,
          delta,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          teams: nextTeams,
          lastScoreChange: change,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["score-detail"] });
      queryClient.invalidateQueries({ queryKey: ["score-summary"] });
      toast.success(`Skor ${teamId} diubah: ${delta > 0 ? "+" : ""}${delta}`);
      setTempScores({});
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal mengatur skor";
      toast.error(msg);
    }
  };

  // Build summary data from API or fallback to state
  const summaryTeams = summaryData?.data || [];
  const summaryMap: Record<string, string> = {};
  summaryTeams.forEach((entry: ScoreSummaryEntry) => {
    summaryMap[entry.team] = entry.total;
  });

  return (
    <>
      <HeaderComp
        title="Pengelolaan Skor"
        description="Atur perolehan nilai tim kuis cerdas cermat secara real-time."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Penyesuaian Skor */}
        <ScoreTable
          state={state}
          tempScores={tempScores}
          onScoreChange={handleScoreChange}
          onManualSetScore={handleManualSetScore}
          onApplyManualScore={handleApplyManualScore}
        />

        {/* Ringkasan Skor Total */}
        <ScoreSummary state={state} />
      </div>
    </>
  );
}
