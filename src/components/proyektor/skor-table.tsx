import { useGameState } from "@/hooks/use-game-state";
import { getTotalScore } from "./team-utils";
import { cn } from "@/lib/utils";
import type {
  ScoreEntry,
  ScoreSummaryEntry,
  ScoreEachBabakEntry,
} from "@/services/scoreService";

interface SkorTableProps {
  completedRounds?: number[]; // babak yang sudah selesai, misal [1, 2, 3]
  detailData?: {
    data: ScoreEntry[];
    score_each_babak: ScoreEachBabakEntry[];
    score_summary: ScoreSummaryEntry[];
  };
}

const BABAK_LABELS: Record<number, string> = {
  1: "Babak 1",
  2: "Babak 2",
  3: "Babak 3",
  4: "Babak 4",
};

const TEAM_HEADER_COLORS: Record<string, string> = {
  blue: "text-blue-400",
  green: "text-emerald-400",
  yellow: "text-amber-400",
  red: "text-rose-400",
  purple: "text-violet-400",
};

const TEAM_ROW_COLORS: Record<string, string> = {
  blue: "bg-blue-950/40",
  green: "bg-emerald-950/40",
  yellow: "bg-amber-950/40",
  red: "bg-rose-950/40",
  purple: "bg-violet-950/40",
};

export function SkorTable({
  completedRounds = [1, 2, 3],
  detailData,
}: SkorTableProps) {
  const { state } = useGameState();

  // ─── Build per-babak totals from API data ──────────────────────────────────
  // score_each_babak: [{ babak, team, total }]
  const babakTotals: Record<number, Record<string, number>> = {};
  detailData?.score_each_babak.forEach((entry) => {
    const babak = parseInt(entry.babak);
    if (!babakTotals[babak]) {
      babakTotals[babak] = {};
    }
    babakTotals[babak][entry.team] = parseInt(entry.total);
  });

  // ─── Build summary totals from API data ────────────────────────────────────
  // score_summary: [{ team, total }]
  const summaryTotals: Record<string, number> = {};
  detailData?.score_summary.forEach((entry) => {
    summaryTotals[entry.team] = parseInt(entry.total);
  });

  // ─── Build per-team per-babak individual entries from detail data ──────────
  // data: [{ babak, team, value }]
  // For babak 1, we merge all entries for each team into one row
  const babak1Entries: Record<string, number> = {};
  detailData?.data.forEach((entry) => {
    if (parseInt(entry.babak) === 1) {
      babak1Entries[entry.team] =
        (babak1Entries[entry.team] || 0) + entry.value;
    }
  });

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-md">
      <table className="w-full text-white border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="text-left px-6 py-4 text-white/60 font-bold text-sm uppercase tracking-widest">
              Tim
            </th>
            {completedRounds.map((round) => (
              <th
                key={round}
                className="px-6 py-4 text-center text-white/60 font-bold text-sm uppercase tracking-widest"
              >
                {BABAK_LABELS[round]}
              </th>
            ))}
            <th className="px-6 py-4 text-center text-white font-black text-sm uppercase tracking-widest">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {state.teams.map((team, idx) => {
            const teamNum = idx + 1;
            const total = getTotalScore(team);

            // Get score for each round from API data
            const getRoundScore = (round: number): number => {
              if (round === 1) {
                // Babak 1: gunakan API detail (merge semua entry)
                return babak1Entries[String(teamNum)] || 0;
              } else {
                // Babak 2-4: gunakan API summary (score_each_babak)
                return babakTotals[round]?.[String(teamNum)] || 0;
              }
            };

            // Get total from API summary
            const apiTotal = summaryTotals[String(teamNum)] || total;

            return (
              <tr
                key={team.id}
                className={cn(
                  "border-b border-white/5 transition-all hover:brightness-110",
                  TEAM_ROW_COLORS[team.color],
                  idx % 2 === 0 ? "" : "bg-white/[0.02]",
                )}
              >
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "font-black text-xl",
                      TEAM_HEADER_COLORS[team.color],
                    )}
                  >
                    {team.name}
                  </span>
                </td>
                {completedRounds.map((round) => (
                  <td
                    key={round}
                    className="px-6 py-4 text-center text-2xl font-bold tabular-nums text-white/80"
                  >
                    {getRoundScore(round)}
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <span className="text-3xl font-black tabular-nums text-white">
                    {apiTotal}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* Footer: total per babak */}
        <tfoot>
          <tr className="border-t-2 border-white/20 bg-white/5">
            <td className="px-6 py-3 text-white/50 text-sm font-bold uppercase">
              Jumlah
            </td>
            {completedRounds.map((round) => {
              // Get column total from API data
              let colTotal = 0;
              if (round === 1) {
                // Babak 1: sum from detail entries
                colTotal = Object.values(babak1Entries).reduce(
                  (sum, val) => sum + val,
                  0,
                );
              } else {
                // Babak 2-4: sum from score_each_babak
                colTotal = Object.values(babakTotals[round] || {}).reduce(
                  (sum, val) => sum + val,
                  0,
                );
              }

              return (
                <td
                  key={round}
                  className="px-6 py-3 text-center text-lg font-bold text-white/50 tabular-nums"
                >
                  {colTotal}
                </td>
              );
            })}
            <td className="px-6 py-3 text-center text-lg font-bold text-white/50 tabular-nums">
              {Object.values(summaryTotals).reduce((sum, val) => sum + val, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
