import { useGameState } from "@/hooks/use-game-state";
import { getTotalScore } from "./dummy-data";
import { cn } from "@/lib/utils";

interface SkorTableProps {
  completedRounds?: number[]; // babak yang sudah selesai, misal [1, 2, 3]
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

export function SkorTable({ completedRounds = [1, 2, 3] }: SkorTableProps) {
  const { state } = useGameState();

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
            const total = getTotalScore(team);
            const scoreKey: Record<number, keyof typeof team.scores> = {
              1: "babak1",
              2: "babak2",
              3: "babak3",
              4: "babak4",
            };

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
                    {team.scores[scoreKey[round]]}
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <span className="text-3xl font-black tabular-nums text-white">
                    {total}
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
              const scoreKey: Record<
                number,
                keyof (typeof state.teams)[0]["scores"]
              > = { 1: "babak1", 2: "babak2", 3: "babak3", 4: "babak4" };
              const colTotal = state.teams.reduce(
                (sum, t) => sum + t.scores[scoreKey[round]],
                0,
              );
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
              {state.teams.reduce((sum, t) => sum + getTotalScore(t), 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
