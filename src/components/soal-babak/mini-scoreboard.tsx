import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";
import type { GameStateData } from "@/hooks/use-game-state";
import { getTotalScore } from "@/components/proyektor/dummy-data";

interface MiniScoreboardProps {
  state: GameStateData;
}

export function MiniScoreboard({ state }: MiniScoreboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Skor Akumulatif</span>
          <Trophy className="w-4 h-4 text-amber-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tim</TableHead>
              <TableHead className="text-right">Skor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-bold">{team.name}</TableCell>
                <TableCell className="text-right font-black text-lg text-primary">
                  {getTotalScore(team)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
