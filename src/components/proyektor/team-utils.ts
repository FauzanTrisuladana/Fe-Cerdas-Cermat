import type { Team } from "./types";

// ─── Warna Per Tim ───────────────────────────────────────────────────────────

export const TEAM_COLOR_MAP = {
  blue: {
    bg: "bg-blue-600",
    bgLight: "bg-blue-950/80",
    border: "border-blue-500",
    text: "text-blue-400",
    badge: "bg-blue-500",
    glow: "shadow-blue-500/40",
  },
  green: {
    bg: "bg-emerald-600",
    bgLight: "bg-emerald-950/80",
    border: "border-emerald-500",
    text: "text-emerald-400",
    badge: "bg-emerald-500",
    glow: "shadow-emerald-500/40",
  },
  yellow: {
    bg: "bg-amber-500",
    bgLight: "bg-amber-950/80",
    border: "border-amber-400",
    text: "text-amber-400",
    badge: "bg-amber-500",
    glow: "shadow-amber-500/40",
  },
  red: {
    bg: "bg-rose-600",
    bgLight: "bg-rose-950/80",
    border: "border-rose-500",
    text: "text-rose-400",
    badge: "bg-rose-500",
    glow: "shadow-rose-500/40",
  },
  purple: {
    bg: "bg-violet-600",
    bgLight: "bg-violet-950/80",
    border: "border-violet-500",
    text: "text-violet-400",
    badge: "bg-violet-500",
    glow: "shadow-violet-500/40",
  },
} as const;

// ─── Utility Functions ───────────────────────────────────────────────────────

export function getTotalScore(team: Team): number {
  return (
    team.scores.babak1 +
    team.scores.babak2 +
    team.scores.babak3 +
    team.scores.babak4
  );
}
