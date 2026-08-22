import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GameStateData } from "@/hooks/use-game-state";

interface Babak2ControlsProps {
  state: GameStateData;
  onSetQuestion: (num: number) => void;
}

export function Babak2Controls({
  state,
  onSetQuestion,
}: Babak2ControlsProps) {
  const activeQuestion = state.babak2Questions.find(q => q.number === state.activeBabak2Num) || null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengendali Babak 2 — Tebak Gambar</CardTitle>
        <CardDescription>
          Pilih soal tebak gambar aktif. Data diambil langsung dari database.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <h4 className="text-sm font-bold mb-3">Pilih Soal (1-{state.babak2Questions.length}):</h4>
          <div className="flex flex-wrap gap-2">
            {state.babak2Questions.map((q) => (
              <Button
                key={q.id}
                variant={
                  state.activeBabak2Num === q.number ? "default" : "outline"
                }
                onClick={() => onSetQuestion(q.number)}
                className="w-10 h-10 p-0 font-bold"
              >
                {q.number}
              </Button>
            ))}
            {state.babak2Questions.length === 0 && (
              <p className="text-sm text-muted-foreground">Memuat data soal...</p>
            )}
          </div>
        </div>

        {activeQuestion && (
          <div className="grid grid-cols-1 gap-4">
            {/* Kunci Jawaban & Info */}
            <div className="border rounded-xl p-4 bg-slate-50 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                Informasi Soal
              </span>
              <div className="text-sm">
                <span className="font-bold">Kunci Jawaban: </span>
                <Badge className="bg-emerald-600 text-white text-sm font-black px-2 py-0.5 ml-1">
                  {activeQuestion.title}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Gambar ini akan langsung terbuka seutuhnya di layar proyektor.
              </div>
            </div>
          </div>
        )}

        {/* Gambar preview admin */}
        {activeQuestion && (
          <div>
            <h4 className="text-sm font-bold mb-3">Preview Gambar (Operator):</h4>
            <div className="w-full max-w-sm">
              <div className="relative aspect-video border rounded-lg overflow-hidden bg-slate-100">
                <img src={activeQuestion.image} className="w-full h-full object-contain" alt={activeQuestion.title} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
