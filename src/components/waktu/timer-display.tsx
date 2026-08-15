import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";
import type { GameStateData } from "@/hooks/use-game-state";

interface TimerDisplayProps {
  state: GameStateData;
  onPauseTimer: () => void;
  onStartTimer: () => void;
  onResetTimer: () => void;
}

export function TimerDisplay({
  state,
  onPauseTimer,
  onStartTimer,
  onResetTimer,
}: TimerDisplayProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Stopwatch Operator
        </CardTitle>
        <CardDescription>
          Gunakan tombol di bawah ini untuk memulai, menjeda, atau mengatur
          ulang timer proyektor.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-8 py-8">
        {/* Display Besar */}
        <div className="text-center select-none">
          <div className="text-7xl font-black tabular-nums tracking-tight text-primary">
            {formatTime(state.timerRemaining)}
          </div>
          <div className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-2">
            Durasi Target: {formatTime(state.timerDuration)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {state.isTimerRunning ? (
            <Button
              size="lg"
              onClick={onPauseTimer}
              variant="outline"
              className="h-16 px-8 text-lg font-bold border-amber-300 text-amber-600 hover:bg-amber-50"
            >
              <Pause className="w-5 h-5 mr-2" /> Pause
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={onStartTimer}
              disabled={state.timerRemaining <= 0}
              className="h-16 px-8 text-lg font-bold bg-emerald-600 hover:bg-emerald-700"
            >
              <Play className="w-5 h-5 mr-2" /> Start
            </Button>
          )}
          <Button
            size="lg"
            variant="secondary"
            onClick={onResetTimer}
            className="h-16 px-8 text-lg font-bold"
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60)
    .toString()
    .padStart(2, "0");
  const s = (Math.max(0, seconds) % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
