import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Eye } from "lucide-react";
import type { GameStateData } from "@/hooks/use-game-state";
import type { CrosswordClue } from "@/components/proyektor/types";

interface Babak3ControlsProps {
  state: GameStateData;
  onCheckTTS: () => void;
  onRevealTTS: () => void;
  onSelectClue: (clue: CrosswordClue) => void;
  ttsInput: string;
  onTtsInputChange: (value: string) => void;
}

export function Babak3Controls({
  state,
  onCheckTTS,
  onRevealTTS,
  onSelectClue,
  ttsInput,
  onTtsInputChange,
}: Babak3ControlsProps) {
  const activeClue =
    state.crossword.clues.find(
      (c) =>
        c.number === state.activeClueNum && c.direction === state.activeClueDir,
    ) || null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengendali Babak 3 — Teka Teki Silang</CardTitle>
        <CardDescription>
          Kelola soal mendatar/menurun, verifikasi jawaban sementara, dan
          verifikasi skor.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Active Clue Panel */}
        <div className="border rounded-xl p-4 bg-slate-50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Pertanyaan Aktif
            </span>
            {activeClue && (
              <Badge variant="outline" className="font-extrabold uppercase">
                {activeClue.direction === "across" ? "Mendatar →" : "Menurun ↓"}{" "}
                {activeClue.number}
              </Badge>
            )}
          </div>

          {activeClue ? (
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-bold text-lg leading-snug">
                  {activeClue.text}
                </p>
                <div className="text-sm text-muted-foreground mt-1.5 flex gap-2 items-center">
                  <span>Kunci Jawaban:</span>
                  <span className="font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {activeClue.answer} ({activeClue.answer.length} Huruf)
                  </span>
                </div>
              </div>

              {!activeClue.answered ? (
                <div className="flex gap-2 items-center mt-2">
                  <Input
                    placeholder="Ketik jawaban sementara di sini..."
                    className="font-bold"
                    value={ttsInput}
                    onChange={(e) => onTtsInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onCheckTTS();
                    }}
                  />
                  <Button
                    onClick={onCheckTTS}
                    className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                  >
                    <Check className="w-4 h-4" /> Verify
                  </Button>
                  <Button
                    onClick={onRevealTTS}
                    variant="secondary"
                    className="gap-1.5"
                  >
                    <Eye className="w-4 h-4" /> Reveal
                  </Button>
                </div>
              ) : (
                <div className="text-emerald-600 font-bold flex items-center gap-1.5 mt-2 bg-emerald-50 border border-emerald-100 p-2 rounded-lg">
                  <span>
                    ✓ Soal ini sudah berhasil dijawab dan ditampilkan di
                    proyektor.
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-4 text-center">
              Belum ada clue terpilih. Silakan klik salah satu clue di bawah
              ini.
            </p>
          )}
        </div>

        {/* Clue List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Across */}
          <div>
            <h4 className="text-sm font-black mb-2 text-slate-700">
              Mendatar →
            </h4>
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
              {state.crossword.clues
                .filter((c) => c.direction === "across")
                .map((clue) => (
                  <button
                    key={`${clue.number}-across`}
                    onClick={() => onSelectClue(clue)}
                    className={`text-left text-xs p-2.5 rounded-lg border transition-all flex justify-between items-start ${
                      clue.answered
                        ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                        : state.activeClueNum === clue.number &&
                            state.activeClueDir === "across"
                          ? "bg-blue-50 border-blue-300 text-blue-900 font-semibold"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span>
                      <span className="font-extrabold">{clue.number}.</span>{" "}
                      {clue.text}
                    </span>
                    {clue.answered && (
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-1 rounded">
                        Ok
                      </span>
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Down */}
          <div>
            <h4 className="text-sm font-black mb-2 text-slate-700">
              Menurun ↓
            </h4>
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
              {state.crossword.clues
                .filter((c) => c.direction === "down")
                .map((clue) => (
                  <button
                    key={`${clue.number}-down`}
                    onClick={() => onSelectClue(clue)}
                    className={`text-left text-xs p-2.5 rounded-lg border transition-all flex justify-between items-start ${
                      clue.answered
                        ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                        : state.activeClueNum === clue.number &&
                            state.activeClueDir === "down"
                          ? "bg-blue-50 border-blue-300 text-blue-900 font-semibold"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span>
                      <span className="font-extrabold">{clue.number}.</span>{" "}
                      {clue.text}
                    </span>
                    {clue.answered && (
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-1 rounded">
                        Ok
                      </span>
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
