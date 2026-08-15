import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { Button } from "@/components/ui/button";
import { ScoreTable } from "@/components/skor/score-table";
import { ScoreSummary } from "@/components/skor/score-summary";
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
    if (value === undefined) return;

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
      const delta = team ? value - team.scores[`babak${selectedRound}` as keyof typeof team.scores] : 0;

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
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Pengelolaan Skor</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Atur perolehan nilai tim kuis cerdas cermat secara real-time.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            updateState((prev) => ({
              ...prev,
              teams: prev.teams.map((t) => ({
                ...t,
                scores: { babak1: 0, babak2: 0, babak3: 0, babak4: 0 },
              })),
              lastScoreChange: null,
            }));
          }}
          className="text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          Reset Skor Semua Tim
        </Button>
      </div>

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
    </div>
  );
}
