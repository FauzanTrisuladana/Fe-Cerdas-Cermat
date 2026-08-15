import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { TimerDisplay } from "@/components/waktu/timer-display";
import { DurationSettings } from "@/components/waktu/duration-settings";
import HeaderComp from "@/components/shared/header-comp";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/admin/_auth/waktu")({
  component: AdminWaktuPage,
});

function AdminWaktuPage() {
  const { state, updateState } = useGameState();

  // Countdown timer logic running on the Admin panel
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (state.isTimerRunning && state.timerRemaining > 0) {
      interval = setInterval(() => {
        updateState((prev) => {
          if (prev.timerRemaining <= 1) {
            if (interval) clearInterval(interval);
            // Play time up sound on proyektor
            return {
              ...prev,
              timerRemaining: 0,
              isTimerRunning: false,
              soundTrigger: {
                type: "timesup",
                timestamp: Date.now(),
              },
            };
          }
          return {
            ...prev,
            timerRemaining: prev.timerRemaining - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isTimerRunning, state.timerRemaining, updateState]);

  const handleStartTimer = () => {
    updateState((prev) => ({
      ...prev,
      isTimerRunning: true,
    }));
  };

  const handlePauseTimer = () => {
    updateState((prev) => ({
      ...prev,
      isTimerRunning: false,
    }));
  };

  const handleResetTimer = () => {
    updateState((prev) => ({
      ...prev,
      timerRemaining: prev.timerDuration,
      isTimerRunning: false,
    }));
  };

  const handleSetDuration = (seconds: number) => {
    updateState((prev) => ({
      ...prev,
      timerDuration: seconds,
      timerRemaining: seconds,
      isTimerRunning: false,
    }));
  };

  return (
    <>
      <HeaderComp
        title="Pengendali Waktu & Timer"
        description="Kelola durasi pengerjaan soal cerdas cermat secara terpusat."
        icon={<Clock />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kontrol Stopwatch */}
        <TimerDisplay
          state={state}
          onPauseTimer={handlePauseTimer}
          onStartTimer={handleStartTimer}
          onResetTimer={handleResetTimer}
        />

        {/* Set Waktu Template / Custom */}
        <DurationSettings onSetDuration={handleSetDuration} />
      </div>
    </>
  );
}
