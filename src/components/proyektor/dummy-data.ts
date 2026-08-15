import type { Team, ImageQuestion, CrosswordState, GameState } from "./types";

// ─── Data Tim ────────────────────────────────────────────────────────────────

export const DUMMY_TEAMS: Team[] = [
  {
    id: "rt01",
    name: "RT 01",
    color: "blue",
    scores: { babak1: 100, babak2: 75, babak3: 50, babak4: 0 },
  },
  {
    id: "rt02",
    name: "RT 02",
    color: "green",
    scores: { babak1: 75, babak2: 100, babak3: 25, babak4: 0 },
  },
  {
    id: "rt03",
    name: "RT 03",
    color: "yellow",
    scores: { babak1: 125, babak2: 50, babak3: 75, babak4: 0 },
  },
  {
    id: "rt04",
    name: "RT 04",
    color: "red",
    scores: { babak1: 50, babak2: 125, babak3: 100, babak4: 0 },
  },
  {
    id: "rt05",
    name: "RT 05",
    color: "purple",
    scores: { babak1: 150, babak2: 25, babak3: 0, babak4: 0 },
  },
];

export function getTotalScore(team: Team): number {
  return (
    team.scores.babak1 +
    team.scores.babak2 +
    team.scores.babak3 +
    team.scores.babak4
  );
}

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

// ─── Data Babak 2: Soal Gambar ───────────────────────────────────────────────
// Menggunakan placeholder via picsum.photos (ukuran konsisten)

export const DUMMY_IMAGE_QUESTIONS: ImageQuestion[] = [
  {
    id: 1,
    title: "Kalimantan Utara",
    images: [
      "https://picsum.photos/seed/kalut1/400/300",
      "https://picsum.photos/seed/kalut2/400/300",
      "https://picsum.photos/seed/kalut3/400/300",
      "https://picsum.photos/seed/kalut4/400/300",
    ],
    revealedCount: 1,
  },
  {
    id: 2,
    title: "Sulawesi Selatan",
    images: [
      "https://picsum.photos/seed/sulsel1/400/300",
      "https://picsum.photos/seed/sulsel2/400/300",
      "https://picsum.photos/seed/sulsel3/400/300",
      "https://picsum.photos/seed/sulsel4/400/300",
    ],
    revealedCount: 1,
  },
  {
    id: 3,
    title: "Jawa Tengah",
    images: [
      "https://picsum.photos/seed/jateng1/400/300",
      "https://picsum.photos/seed/jateng2/400/300",
      "https://picsum.photos/seed/jateng3/400/300",
      "https://picsum.photos/seed/jateng4/400/300",
    ],
    revealedCount: 1,
  },
  {
    id: 4,
    title: "Bali",
    images: [
      "https://picsum.photos/seed/bali1/400/300",
      "https://picsum.photos/seed/bali2/400/300",
      "https://picsum.photos/seed/bali3/400/300",
      "https://picsum.photos/seed/bali4/400/300",
    ],
    revealedCount: 1,
  },
  {
    id: 5,
    title: "Papua Barat Daya",
    images: [
      "https://picsum.photos/seed/papua1/400/300",
      "https://picsum.photos/seed/papua2/400/300",
      "https://picsum.photos/seed/papua3/400/300",
      "https://picsum.photos/seed/papua4/400/300",
    ],
    revealedCount: 1,
  },
];

// ─── Data Babak 3: Teka-Teki Silang ─────────────────────────────────────────
// Grid 7x7 sederhana untuk demo

export const DUMMY_CROSSWORD: CrosswordState = {
  grid: buildDummyCrosswordGrid(),
  clues: [
    {
      number: 1,
      direction: "across",
      text: "Ibukota Indonesia",
      answer: "JAKARTA",
      startRow: 0,
      startCol: 0,
      answered: false,
    },
    {
      number: 2,
      direction: "down",
      text: "Pulau terbesar di Indonesia",
      answer: "KALIMANTAN",
      startRow: 0,
      startCol: 0,
      answered: false,
    },
    {
      number: 3,
      direction: "across",
      text: "Bahasa resmi Indonesia",
      answer: "INDONESIA",
      startRow: 2,
      startCol: 0,
      answered: false,
    },
    {
      number: 4,
      direction: "across",
      text: "Semboyan Bhinneka Tunggal ___",
      answer: "IKA",
      startRow: 4,
      startCol: 2,
      answered: false,
    },
    {
      number: 5,
      direction: "down",
      text: "Presiden pertama Indonesia",
      answer: "SOEKARNO",
      startRow: 0,
      startCol: 4,
      answered: false,
    },
  ],
  activeClue: null,
};

function buildDummyCrosswordGrid() {
  // 10 baris x 11 kolom untuk demo TTS
  const ROWS = 10;
  const COLS = 11;

  // Definisikan pola: 0 = kotak aktif, 1 = kotak hitam
  const pattern = [
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
  ];

  // Isi jawaban secara sederhana (partial, untuk demo)
  const answers: Record<string, string> = {
    "0,0": "J",
    "0,1": "A",
    "0,2": "K",
    "0,3": "A",
    "0,4": "R",
    "0,5": "T",
    "0,6": "A",
    "1,0": "A",
    "2,0": "I",
    "2,1": "N",
    "2,2": "D",
    "2,3": "O",
    "2,4": "N",
    "2,5": "E",
    "2,6": "S",
    "2,7": "I",
    "2,8": "A",
    "3,0": "K",
    "4,0": "A",
    "4,2": "I",
    "4,3": "K",
    "4,4": "A",
    "5,2": "A",
    "6,0": "R",
    "6,2": "L",
    "7,0": "T",
    "8,0": "A",
    "9,0": "N",
  };

  const grid = [];
  let cellNumber = 1;

  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const isBlocked = pattern[r][c] === 1;
      const key = `${r},${c}`;
      const letter = answers[key] ?? "";

      // Berikan nomor pada sel pertama dari setiap kata
      let number: number | undefined;
      if (!isBlocked) {
        const isStartAcross =
          (c === 0 || pattern[r][c - 1] === 1) &&
          c + 1 < COLS &&
          pattern[r][c + 1] === 0;
        const isStartDown =
          (r === 0 || pattern[r - 1][c] === 1) &&
          r + 1 < ROWS &&
          pattern[r + 1][c] === 0;
        if (isStartAcross || isStartDown) {
          number = cellNumber++;
        }
      }

      row.push({
        row: r,
        col: c,
        letter,
        revealed: false,
        isBlocked,
        number,
        highlight: undefined,
      });
    }
    grid.push(row);
  }

  return grid;
}

// ─── Initial Game State ──────────────────────────────────────────────────────

export const INITIAL_GAME_STATE: GameState = {
  currentRound: 1,
  currentView: "judul",
  timer: {
    timeRemaining: 90,
    isRunning: false,
    duration: 90,
  },
  teams: DUMMY_TEAMS,
  lastScoreChange: null,
  currentQuestionIndex: 0,
  revealedImageCount: 1,
  showScoreTransition: false,
  crossword: DUMMY_CROSSWORD,
};
