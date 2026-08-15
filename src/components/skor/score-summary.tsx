import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { GameStateData } from "@/hooks/use-game-state";
import { getTotalScore } from "@/components/proyektor/dummy-data";

interface ScoreSummaryProps {
  state: GameStateData;
}

export function ScoreSummary({ state }: ScoreSummaryProps) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Skor Kumulatif</CardTitle>
        <Trophy className="h-4 w-4 text-amber-500" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-xs text-muted-foreground">
          Total skor dari semua babak yang telah dilalui.
        </div>
        <div className="flex flex-col gap-3">
          {state.teams.map((team) => {
            const total = getTotalScore(team);
            return (
              <div
                key={team.id}
                className="flex justify-between items-center border-b pb-2 last:border-none"
              >
                <span className="font-extrabold text-base">{team.name}</span>
                <span className="font-black text-xl text-primary">{total}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
