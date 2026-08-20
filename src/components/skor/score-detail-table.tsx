import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ScoreDetailResponse } from "@/services/scoreService";
import type { GameStateData } from "@/hooks/use-game-state";

interface ScoreDetailTableProps {
  detailData?: ScoreDetailResponse;
  state: GameStateData;
}

const TEAM_COLORS: Record<string, string> = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-emerald-600 dark:text-emerald-400",
  yellow: "text-amber-600 dark:text-amber-400",
  red: "text-rose-600 dark:text-rose-400",
  purple: "text-violet-600 dark:text-violet-400",
};

export function ScoreDetailTable({ detailData, state }: ScoreDetailTableProps) {
  const teams = state.teams;

  if (!detailData || detailData.data.length === 0) return null;

  // ── Group individual entries by babak → team → [values] ──────────────────
  const entriesByBabak: Record<number, Record<string, number[]>> = {};
  detailData.data.forEach((entry) => {
    const babak = parseInt(entry.babak);
    if (!entriesByBabak[babak]) entriesByBabak[babak] = {};
    if (!entriesByBabak[babak][entry.team])
      entriesByBabak[babak][entry.team] = [];
    entriesByBabak[babak][entry.team].push(entry.value);
  });

  // ── Per-babak totals ──────────────────────────────────────────────────────
  const babakTotals: Record<number, Record<string, number>> = {};
  detailData.score_each_babak.forEach((entry) => {
    const babak = parseInt(entry.babak);
    if (!babakTotals[babak]) babakTotals[babak] = {};
    babakTotals[babak][entry.team] = parseInt(entry.total);
  });

  // ── Grand total ───────────────────────────────────────────────────────────
  const summaryTotals: Record<string, number> = {};
  detailData.score_summary.forEach((entry) => {
    summaryTotals[entry.team] = parseInt(entry.total);
  });

  const rounds = Array.from(
    new Set(detailData.data.map((e) => parseInt(e.babak))),
  ).sort((a, b) => a - b);

  return (
    <Card className="col-span-full pb-0">
      <CardHeader>
        <CardTitle>Rincian Skor per Babak</CardTitle>
        <CardDescription>
          Setiap baris adalah poin per pertanyaan, dipisahkan per babak. Negatif
          berarti pengurangan poin.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-32 text-center font-black">
                  Babak
                </TableHead>
                {teams.map((team) => (
                  <TableHead
                    key={team.id}
                    className={cn(
                      "text-center font-black text-sm",
                      TEAM_COLORS[team.color],
                    )}
                  >
                    {team.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rounds.map((babak) => {
                const babakEntries = entriesByBabak[babak] ?? {};
                const maxRows = Math.max(
                  1,
                  ...Object.values(babakEntries).map((v) => v.length),
                );

                return (
                  <>
                    {/* Entry rows */}
                    {Array.from({ length: maxRows }, (_, rowIdx) => (
                      <TableRow key={`${babak}-row-${rowIdx}`}>
                        {rowIdx === 0 && (
                          <TableCell
                            rowSpan={maxRows}
                            className="text-center text-2xl font-black text-muted-foreground/50 align-middle border-r"
                          >
                            {babak}
                          </TableCell>
                        )}
                        {teams.map((team, teamIdx) => {
                          const val =
                            babakEntries[String(teamIdx + 1)]?.[rowIdx];
                          return (
                            <TableCell
                              key={team.id}
                              className={cn(
                                "text-center font-semibold tabular-nums",
                                val === undefined
                                  ? "text-muted-foreground/20"
                                  : val > 0
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : val < 0
                                      ? "text-rose-600 dark:text-rose-400"
                                      : "text-muted-foreground",
                              )}
                            >
                              {val !== undefined ? val : "—"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}

                    {/* Total per babak */}
                    <TableRow
                      key={`${babak}-total`}
                      className="bg-muted/70 border-y-2"
                    >
                      <TableCell className="text-[11px] font-black uppercase tracking-wider text-muted-foreground text-center">
                        Total B{babak}
                      </TableCell>
                      {teams.map((team, teamIdx) => {
                        const total =
                          babakTotals[babak]?.[String(teamIdx + 1)] ?? 0;
                        return (
                          <TableCell
                            key={team.id}
                            className={cn(
                              "text-center text-lg font-black tabular-nums",
                              TEAM_COLORS[team.color],
                            )}
                          >
                            {total}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </>
                );
              })}

              {/* Grand total */}
              <TableRow className="bg-primary/5 border-t-2 border-primary/20">
                <TableCell className="text-[11px] font-black uppercase tracking-wider text-primary text-center">
                  Total Akhir
                </TableCell>
                {teams.map((team, teamIdx) => {
                  const total = summaryTotals[String(teamIdx + 1)] ?? 0;
                  return (
                    <TableCell
                      key={team.id}
                      className={cn(
                        "text-center text-xl font-black tabular-nums",
                        TEAM_COLORS[team.color],
                      )}
                    >
                      {total}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
