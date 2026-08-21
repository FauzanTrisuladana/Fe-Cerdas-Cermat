import type { Team, ImageQuestion, CrosswordState, GameState } from "./types";

// ─── Data Tim ────────────────────────────────────────────────────────────────

export const DUMMY_TEAMS: Team[] = [
  {
    id: "rt01",
    name: "RT 01",
    color: "blue",
    scores: { babak1: 0, babak2: 0, babak3: 0, babak4: 0 },
  },
  {
    id: "rt02",
    name: "RT 02",
    color: "green",
    scores: { babak1: 0, babak2: 0, babak3: 0, babak4: 0 },
  },
  {
    id: "rt03",
    name: "RT 03",
    color: "yellow",
    scores: { babak1: 0, babak2: 0, babak3: 0, babak4: 0 },
  },
  {
    id: "rt04",
    name: "RT 04",
    color: "red",
    scores: { babak1: 0, babak2: 0, babak3: 0, babak4: 0 },
  },
  {
    id: "rt05",
    name: "RT 05",
    color: "purple",
    scores: { babak1: 0, babak2: 0, babak3: 0, babak4: 0 },
  },
];

// ─── Data Babak 2: Soal Gambar ───────────────────────────────────────────────
// Menggunakan placeholder via picsum.photos (ukuran konsisten)

export const DUMMY_IMAGE_QUESTIONS: ImageQuestion[] = [
  {
    id: 1,
    title: "Kalimantan Utara",
    image: "https://picsum.photos/seed/kalut1/800/600",
  },
  {
    id: 2,
    title: "Sulawesi Selatan",
    image: "https://picsum.photos/seed/sulsel1/800/600",
  },
  {
    id: 3,
    title: "Jawa Tengah",
    image: "https://picsum.photos/seed/jateng1/800/600",
  },
  {
    id: 4,
    title: "Bali",
    image: "https://picsum.photos/seed/bali1/800/600",
  },
  {
    id: 5,
    title: "Papua Barat Daya",
    image: "https://picsum.photos/seed/papua1/800/600",
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
