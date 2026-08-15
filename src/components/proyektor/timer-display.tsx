import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  /** Waktu dalam detik */
  initialSeconds: number;
  isRunning?: boolean;
  onTimeout?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60)
    .toString()
    .padStart(2, "0");
  const s = (Math.max(0, seconds) % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function TimerDisplay({
  initialSeconds,
  isRunning = false,
  onTimeout,
  size = "xl",
  className,
}: TimerDisplayProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            onTimeout?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onTimeout]);

  const isLow = seconds <= 10 && seconds > 0;
  const isDone = seconds === 0;

  const sizeClasses = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-7xl",
    xl: "text-8xl",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 select-none",
        className,
      )}
    >
      <span className="text-white/60 text-sm font-semibold tracking-widest uppercase">
        Waktu
      </span>
      <span
        className={cn(
          "font-black tabular-nums leading-none tracking-tight transition-colors duration-300",
          sizeClasses[size],
          isDone
            ? "text-rose-500 animate-pulse"
            : isLow
              ? "text-amber-400 animate-pulse"
              : "text-white",
        )}
      >
        {formatTime(seconds)}
      </span>
      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            isDone
              ? "bg-rose-500"
              : isLow
                ? "bg-amber-400"
                : "bg-emerald-400",
          )}
          style={{
            width: `${Math.max(0, (seconds / initialSeconds) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
