import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { ScoreTable } from "@/components/skor/score-table";
import { ScoreSummary } from "@/components/skor/score-summary";
import HeaderComp from "@/components/shared/header-comp";
import type { ScoreChange } from "@/components/proyektor/types";

export const Route = createFileRoute("/admin/_auth/skor")({
  component: AdminSkorPage,
});

function AdminSkorPage() {
  const { state, updateState } = useGameState();
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [tempScores, setTempScores] = useState<Record<string, number>>({});

  const handleScoreChange = (teamId: string, delta: number) => {
    updateState((prev) => {
      const nextTeams = prev.teams.map((team) => {
        if (team.id === teamId) {
          const roundKey = `babak${selectedRound}` as keyof typeof team.scores;
          const currentScore = team.scores[roundKey];
          const newScore = Math.max(0, currentScore + delta);
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
  };

  const handleManualSetScore = (teamId: string, valueStr: string) => {
    const value = parseInt(valueStr) || 0;
    setTempScores((prev) => ({ ...prev, [teamId]: value }));
  };

  const handleApplyManualScore = (teamId: string) => {
    const value = tempScores[teamId];
    if (!value && value !== 0) return;

    updateState((prev) => {
      const nextTeams = prev.teams.map((team) => {
        if (team.id === teamId) {
          const roundKey = `babak${selectedRound}` as keyof typeof team.scores;
          return {
            ...team,
            scores: {
              ...team.scores,
              [roundKey]: value,
            },
          };
        }
        return team;
      });

      const team = prev.teams.find((t) => t.id === teamId);
      const delta = team
        ? value -
          team.scores[`babak${selectedRound}` as keyof typeof team.scores]
        : 0;

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
  };

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
          selectedRound={selectedRound}
          onRoundChange={setSelectedRound}
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
