import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useGameState } from "@/hooks/use-game-state";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { TimerDisplay } from "@/components/waktu/timer-display";
import { DurationSettings } from "@/components/waktu/duration-settings";
import HeaderComp from "@/components/shared/header-comp";
import { Clock } from "lucide-react";
import {
  getTimer,
  playTimer,
  pauseTimer,
  resetTimer,
  setTimer,
  calcTimerState,
} from "@/services/timerService";

export const Route = createFileRoute("/admin/_auth/waktu")({
  component: AdminWaktuPage,
});

function AdminWaktuPage() {
  const { state, updateState } = useGameState();

  // Sinkronisasi realtime
  useRealtimeSync();

  // Server functions
  const getTimerFn = useServerFn(getTimer);
  const playTimerFn = useServerFn(playTimer);
  const pauseTimerFn = useServerFn(pauseTimer);
  const resetTimerFn = useServerFn(resetTimer);
  const setTimerFn = useServerFn(setTimer);

  // Fetch initial timer state
  useQuery({
    queryKey: ["timer"],
    queryFn: async () => {
      const response = await getTimerFn();
      if (response?.data) {
        const { remaining, isRunning, duration } = calcTimerState(response.data);
        updateState((prev) => ({
          ...prev,
          timerDuration: duration,
          timerRemaining: remaining,
          isTimerRunning: isRunning,
          timerEnded: response.data.ended,
        }));
      }
      return response;
    },
    // Hanya ambil sekali saat mount, selebihnya diurus websocket
    staleTime: Infinity,
  });

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const playMutation = useMutation({
    mutationFn: () => playTimerFn(),
  });

  const pauseMutation = useMutation({
    mutationFn: () => pauseTimerFn(),
  });

  const resetMutation = useMutation({
    mutationFn: () => resetTimerFn(),
  });

  const setMutation = useMutation({
    mutationFn: (duration: number) => setTimerFn({ data: { duration } }),
  });

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleStartTimer = () => {
    playMutation.mutate();
  };

  const handlePauseTimer = () => {
    pauseMutation.mutate();
  };

  const handleResetTimer = () => {
    resetMutation.mutate();
  };

  const handleSetDuration = (seconds: number) => {
    setMutation.mutate(seconds);
  };

  // ─── Local Countdown for Admin Display ──────────────────────────────────────
  // Hitung mundur lokal agar display di admin terlihat berjalan
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (state.isTimerRunning && state.timerRemaining > 0 && state.timerEnded) {
      interval = setInterval(() => {
        const endedMs = new Date(state.timerEnded!).getTime();
        const nowMs = Date.now();
        const remaining = Math.max(0, Math.ceil((endedMs - nowMs) / 1000));

        updateState((prev) => {
          if (remaining <= 0) {
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
            timerRemaining: remaining,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isTimerRunning, state.timerEnded, updateState]);

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
