// ─── Tipe Data untuk Halaman Proyektor ─────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  color: TeamColor;
  scores: {
    babak1: number;
    babak2: number;
    babak3: number;
    babak4: number;
  };
}

export type TeamColor = "blue" | "green" | "yellow" | "red" | "purple";

export interface ScoreChange {
  teamId: string;
  delta: number; // positif = tambah, negatif = kurang
  timestamp: number;
}

export interface TimerState {
  timeRemaining: number; // detik
  isRunning: boolean;
  duration: number; // durasi awal dalam detik
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
  media?: {
    type: "image" | "audio";
    src: string;
  };
  round: number;
}

// ─── Babak 2: Tebak Gambar ──────────────────────────────────────────────────

export interface ImageQuestion {
  id: number;
  title: string; // jawaban / nama gambar
  image: string; // path ke gambar
}

// ─── Babak 3: Teka-Teki Silang ──────────────────────────────────────────────

export interface CrosswordCell {
  row: number;
  col: number;
  letter?: string;
  tempLetter?: string;
  revealed?: boolean;
  tempRevealed?: boolean;
  isBlocked: boolean; // kotak hitam
  number?: number; // nomor clue
  highlight?: "active" | "correct" | "wrong";
}

export interface CrosswordClue {
  number: number;
  direction: "across" | "down";
  text: string;
  answer: string;
  startRow: number;
  startCol: number;
  answered: boolean;
  tempAnswer?: string; // jawaban sementara dari admin
}

export interface CrosswordState {
  grid: CrosswordCell[][];
  clues: CrosswordClue[];
  activeClue: CrosswordClue | null;
}

// ─── Game State Global ───────────────────────────────────────────────────────

export type ViewMode =
  | "judul"
  | "babak1"
  | "babak2"
  | "babak3"
  | "babak4"
  | "skor"
  | "score-transition"; // tampilan skor sementara antar soal

export interface GameState {
  currentRound: number; // 1-4
  currentView: ViewMode;
  timer: TimerState;
  teams: Team[];
  lastScoreChange: ScoreChange | null;
  // Babak 2
  currentQuestionIndex: number;
  revealedImageCount: number;
  showScoreTransition: boolean;
  // Babak 3
  crossword: CrosswordState | null;
}
