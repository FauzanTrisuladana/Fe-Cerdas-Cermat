import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GameStateData } from "@/hooks/use-game-state";
import { getTotalScore } from "@/components/proyektor/team-utils";

interface ScoreTableProps {
  state: GameStateData;
  tempScores: Record<string, number>;
  onScoreChange: (teamId: string, delta: number) => void;
  onManualSetScore: (teamId: string, valueStr: string) => void;
  onApplyManualScore: (teamId: string) => void;
}

export function ScoreTable({
  state,
  tempScores,
  onScoreChange,
  onManualSetScore,
  onApplyManualScore,
}: ScoreTableProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Daftar Tim — Semua Babak</CardTitle>
        <CardDescription>
          Atur perolehan nilai tim kuis cerdas cermat untuk setiap babak.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Tim</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Penyesuaian Cepat</TableHead>
              <TableHead className="text-right">Input Delta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.teams.map((team) => {
              const total = getTotalScore(team);

              return (
                <TableRow key={team.id}>
                  <TableCell className="font-extrabold text-lg">
                    {team.name}
                  </TableCell>
                  <TableCell className="text-center font-black text-xl text-primary">
                    {total}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, -100)}
                        className="h-8 w-12 border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        -100
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, -50)}
                        className="h-8 w-12 border-rose-100 text-rose-500 hover:bg-rose-50"
                      >
                        -50
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, 100)}
                        className="h-8 w-12 border-emerald-100 text-emerald-500 hover:bg-emerald-50"
                      >
                        +100
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, 150)}
                        className="h-8 w-12 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      >
                        +150
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, 200)}
                        className="h-8 w-12 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      >
                        +200
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, 300)}
                        className="h-8 w-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        +300
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end items-center">
                      <Input
                        type="number"
                        className="w-20 text-center font-bold"
                        placeholder="±0"
                        value={team.id in tempScores ? tempScores[team.id] : ""}
                        onChange={(e) =>
                          onManualSetScore(team.id, e.target.value)
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => onApplyManualScore(team.id)}
                      >
                        Set
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
