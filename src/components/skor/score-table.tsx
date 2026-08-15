import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GameStateData } from "@/hooks/use-game-state";

interface ScoreTableProps {
  state: GameStateData;
  selectedRound: number;
  onRoundChange: (round: number) => void;
  tempScores: Record<string, number>;
  onScoreChange: (teamId: string, delta: number) => void;
  onManualSetScore: (teamId: string, valueStr: string) => void;
  onApplyManualScore: (teamId: string) => void;
}

export function ScoreTable({
  state,
  selectedRound,
  onRoundChange,
  tempScores,
  onScoreChange,
  onManualSetScore,
  onApplyManualScore,
}: ScoreTableProps) {

  const scoreKeys: Record<number, "babak1" | "babak2" | "babak3" | "babak4"> = {
    1: "babak1",
    2: "babak2",
    3: "babak3",
    4: "babak4",
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Daftar Tim — Babak {selectedRound}</CardTitle>
        <CardDescription>
          Tambah/kurang skor atau input secara langsung untuk masing-masing tim.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={String(selectedRound)}
          onValueChange={(val) => onRoundChange(Number(val))}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-xl mb-6">
            <TabsTrigger value="1">Babak 1</TabsTrigger>
            <TabsTrigger value="2">Babak 2</TabsTrigger>
            <TabsTrigger value="3">Babak 3</TabsTrigger>
            <TabsTrigger value="4">Babak 4</TabsTrigger>
          </TabsList>
        </Tabs>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Tim</TableHead>
              <TableHead className="text-center">Skor Saat Ini</TableHead>
              <TableHead className="text-center">Penyesuaian Cepat</TableHead>
              <TableHead className="text-right">Input Manual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.teams.map((team) => {
              const currentScore = team.scores[scoreKeys[selectedRound]];
              const inputValue =
                tempScores[team.id] !== undefined
                  ? tempScores[team.id]
                  : currentScore;

              return (
                <TableRow key={team.id}>
                  <TableCell className="font-extrabold text-lg">
                    {team.name}
                  </TableCell>
                  <TableCell className="text-center font-black text-2xl text-primary">
                    {currentScore}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, -50)}
                        className="h-8 w-12 border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        -50
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, -10)}
                        className="h-8 w-12 border-rose-100 text-rose-500 hover:bg-rose-50"
                      >
                        -10
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, 10)}
                        className="h-8 w-12 border-emerald-100 text-emerald-500 hover:bg-emerald-50"
                      >
                        +10
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScoreChange(team.id, 50)}
                        className="h-8 w-12 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      >
                        +50
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end items-center">
                      <Input
                        type="number"
                        className="w-20 text-center font-bold"
                        value={inputValue}
                        onChange={(e) => onManualSetScore(team.id, e.target.value)}
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
