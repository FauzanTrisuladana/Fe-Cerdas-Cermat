import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_IMAGE_QUESTIONS } from "@/components/proyektor/dummy-data";
import type { GameStateData } from "@/hooks/use-game-state";

interface Babak2ControlsProps {
  state: GameStateData;
  onSetQuestion: (idx: number) => void;
  onSetRevealCount: (count: number) => void;
}

export function Babak2Controls({ state, onSetQuestion, onSetRevealCount }: Babak2ControlsProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengendali Babak 2 — Tebak Gambar</CardTitle>
        <CardDescription>
          Pilih soal tebak gambar aktif dan kelola jumlah potongan gambar yang terbuka.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <h4 className="text-sm font-bold mb-3">Pilih Soal (1-10):</h4>
          <div className="flex flex-wrap gap-2">
            {DUMMY_IMAGE_QUESTIONS.map((_, idx) => (
              <Button
                key={idx}
                variant={state.babak2QuestionIdx === idx ? "default" : "outline"}
                onClick={() => onSetQuestion(idx)}
                className="w-10 h-10 p-0 font-bold"
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kunci Jawaban & Info */}
          <div className="border rounded-xl p-4 bg-slate-50 flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Informasi Soal
            </span>
            <div className="text-sm">
              <span className="font-bold">Kunci Jawaban: </span>
              <Badge className="bg-emerald-600 text-white text-sm font-black px-2 py-0.5 ml-1">
                {DUMMY_IMAGE_QUESTIONS[state.babak2QuestionIdx].title}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Gambar ini memiliki 4 grid potongan gambar. Operator dapat membuka potongan gambar satu per satu secara berurutan.
            </div>
          </div>

          {/* Level Reveal */}
          <div className="border rounded-xl p-4 flex flex-col justify-between gap-3">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
              Reveal Potongan Gambar
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((num) => (
                <Button
                  key={num}
                  variant={state.babak2RevealedCount === num ? "default" : "outline"}
                  onClick={() => onSetRevealCount(num)}
                  className="flex-1 font-bold text-lg"
                >
                  {num} Grid
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Gambar preview admin */}
        <div>
          <h4 className="text-sm font-bold mb-3">Preview Gambar (Operator):</h4>
          <div className="grid grid-cols-4 gap-2">
            {DUMMY_IMAGE_QUESTIONS[state.babak2QuestionIdx].images.map((src, idx) => (
              <div key={idx} className="relative aspect-video border rounded-lg overflow-hidden bg-slate-100">
                <img src={src} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
