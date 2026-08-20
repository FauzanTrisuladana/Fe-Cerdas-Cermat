import { useGameState } from "@/hooks/use-game-state";
import { cn } from "@/lib/utils";
import type {
  ScoreEntry,
  ScoreSummaryEntry,
  ScoreEachBabakEntry,
} from "@/services/scoreService";

interface SkorTableProps {
  completedRounds?: number[];
  detailData?: {
    data: ScoreEntry[];
    score_each_babak: ScoreEachBabakEntry[];
    score_summary: ScoreSummaryEntry[];
  };
}

const TEAM_HEADER_COLORS: Record<string, string> = {
  blue: "text-blue-400",
  green: "text-emerald-400",
  yellow: "text-amber-400",
  red: "text-rose-400",
  purple: "text-violet-400",
};

export function SkorTable({
  completedRounds = [],
  detailData,
}: SkorTableProps) {
  const { state } = useGameState();
  const teams = state.teams;

  if (!detailData || completedRounds.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-white/30 text-lg font-semibold tracking-wide">
        Memuat data skor…
      </div>
    );
  }

  // ── Group individual entries by babak → team → [values] ──────────────────
  const entriesByBabak: Record<number, Record<string, number[]>> = {};
  detailData.data.forEach((entry) => {
    const babak = parseInt(entry.babak);
    if (!entriesByBabak[babak]) entriesByBabak[babak] = {};
    if (!entriesByBabak[babak][entry.team])
      entriesByBabak[babak][entry.team] = [];
    entriesByBabak[babak][entry.team].push(entry.value);
  });

  // ── Per-babak totals (score_each_babak) ──────────────────────────────────
  const babakTotals: Record<number, Record<string, number>> = {};
  detailData.score_each_babak.forEach((entry) => {
    const babak = parseInt(entry.babak);
    if (!babakTotals[babak]) babakTotals[babak] = {};
    babakTotals[babak][entry.team] = parseInt(entry.total);
  });

  // ── Grand total (score_summary) ───────────────────────────────────────────
  const summaryTotals: Record<string, number> = {};
  detailData.score_summary.forEach((entry) => {
    summaryTotals[entry.team] = parseInt(entry.total);
  });

  const rounds = [...completedRounds].sort((a, b) => a - b);

  return (
    <div className="w-full overflow-x-auto scrollbar-hide rounded-2xl border border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-md">
      <table className="w-full text-white border-collapse">
        <thead>
          <tr className="border-b-2 border-white/10 bg-white/5">
            <th className="text-left px-5 py-4 text-white/50 font-bold text-xs uppercase tracking-widest w-28">
              Babak
            </th>
            {teams.map((team) => (
              <th
                key={team.id}
                className={cn(
                  "px-5 py-4 text-center font-black text-sm uppercase tracking-widest",
                  TEAM_HEADER_COLORS[team.color],
                )}
              >
                {team.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rounds.map((babak) => {
            const babakEntries = entriesByBabak[babak] ?? {};
            const maxRows = Math.max(
              1,
              ...Object.values(babakEntries).map((v) => v.length),
            );

            return (
              <>
                {/* ── Entry rows ───────────────────────────────────── */}
                {Array.from({ length: maxRows }, (_, rowIdx) => (
                  <tr
                    key={`${babak}-row-${rowIdx}`}
                    className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Babak number: only first row, spans all entry rows */}
                    {rowIdx === 0 && (
                      <td
                        rowSpan={maxRows}
                        className="px-5 py-3 text-center text-3xl font-black text-white/20 align-middle border-r border-white/5 select-none"
                      >
                        {babak}
                      </td>
                    )}

                    {teams.map((team, teamIdx) => {
                      const teamNum = String(teamIdx + 1);
                      const val = babakEntries[teamNum]?.[rowIdx];
                      return (
                        <td
                          key={team.id}
                          className={cn(
                            "px-5 py-2.5 text-center text-base font-semibold tabular-nums",
                            val === undefined
                              ? "text-white/10"
                              : val > 0
                                ? "text-emerald-400"
                                : val < 0
                                  ? "text-rose-400"
                                  : "text-white/40",
                          )}
                        >
                          {val !== undefined ? val : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* ── Total per babak row ───────────────────────────── */}
                <tr
                  key={`${babak}-total`}
                  className="border-b-2 border-white/15 bg-white/[0.04]"
                >
                  <td className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white/40">
                    Total B{babak}
                  </td>
                  {teams.map((team, teamIdx) => {
                    const total =
                      babakTotals[babak]?.[String(teamIdx + 1)] ?? 0;
                    return (
                      <td
                        key={team.id}
                        className={cn(
                          "px-5 py-3 text-center text-xl font-black tabular-nums",
                          TEAM_HEADER_COLORS[team.color],
                        )}
                      >
                        {total}
                      </td>
                    );
                  })}
                </tr>
              </>
            );
          })}

          {/* ── Grand total row ─────────────────────────────────────── */}
          <tr className="bg-amber-950/30 border-t-2 border-amber-500/20">
            <td className="px-5 py-4 text-[11px] font-black uppercase tracking-widest text-amber-400/80">
              Total Akhir
            </td>
            {teams.map((team, teamIdx) => {
              const total = summaryTotals[String(teamIdx + 1)] ?? 0;
              return (
                <td
                  key={team.id}
                  className={cn(
                    "px-5 py-4 text-center text-2xl font-black tabular-nums",
                    TEAM_HEADER_COLORS[team.color],
                  )}
                >
                  {total}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
