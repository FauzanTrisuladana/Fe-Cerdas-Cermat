import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Trophy } from "lucide-react";
import type { GameStateData } from "@/hooks/use-game-state";

interface BabakControlsProps {
  state: GameStateData;
  onSetView: (view: string, round?: number) => void;
}

export function BabakControls({ state, onSetView }: BabakControlsProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kontrol Alur Proyektor</CardTitle>
        <CardDescription>
          Pilih halaman atau babak aktif untuk langsung ditampilkan di layar proyektor.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          variant={state.currentView === "judul" ? "default" : "outline"}
          onClick={() => onSetView("judul")}
          className="gap-2"
        >
          <Monitor className="w-4 h-4" />
          Halaman Judul
        </Button>
        <Button
          variant={state.currentView === "babak1" ? "default" : "outline"}
          onClick={() => onSetView("babak1", 1)}
        >
          Babak 1 (Paket)
        </Button>
        <Button
          variant={state.currentView === "babak2" ? "default" : "outline"}
          onClick={() => onSetView("babak2", 2)}
        >
          Babak 2 (Tebak Gambar)
        </Button>
        <Button
          variant={state.currentView === "babak3" ? "default" : "outline"}
          onClick={() => onSetView("babak3", 3)}
        >
          Babak 3 (TTS)
        </Button>
        <Button
          variant={state.currentView === "babak4" ? "default" : "outline"}
          onClick={() => onSetView("babak4", 4)}
        >
          Babak 4 (Rebutan)
        </Button>
        <Button
          variant={state.currentView === "skor" ? "default" : "outline"}
          onClick={() => onSetView("skor")}
          className="gap-2"
        >
          <Trophy className="w-4 h-4" />
          Papan Skor Akhir
        </Button>
        <Button
          variant={state.currentView === "score-transition" ? "default" : "outline"}
          onClick={() => onSetView("score-transition")}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Transisi Skor
        </Button>
      </CardContent>
    </Card>
  );
}
