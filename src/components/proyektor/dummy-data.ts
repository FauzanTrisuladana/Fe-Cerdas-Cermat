import type { Team, ImageQuestion, CrosswordState, GameState, CrosswordClue, CrosswordCell } from "./types";

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

// ─── Utility: Build Crossword State from Clues ─────────────────────────────

export function buildCrosswordState(clues: Omit<CrosswordClue, "number">[]): CrosswordState {
  let maxRow = 0;
  let maxCol = 0;

  // 1. Tentukan ukuran grid maksimal berdasarkan clue
  clues.forEach((c) => {
    const endRow = c.direction === "down" ? c.startRow + c.answer.length - 1 : c.startRow;
    const endCol = c.direction === "across" ? c.startCol + c.answer.length - 1 : c.startCol;
    if (endRow > maxRow) maxRow = endRow;
    if (endCol > maxCol) maxCol = endCol;
  });

  const ROWS = maxRow + 1;
  const COLS = maxCol + 1;

  // 2. Buat grid kosong
  const grid: CrosswordCell[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: CrosswordCell[] = [];
    for (let c = 0; c < COLS; c++) {
      row.push({
        row: r,
        col: c,
        letter: "",
        revealed: false,
        isBlocked: true, // Default true, akan di-false-kan jika ada kata
      });
    }
    grid.push(row);
  }

  // 3. Masukkan huruf ke dalam grid
  clues.forEach((c) => {
    for (let i = 0; i < c.answer.length; i++) {
      const r = c.direction === "down" ? c.startRow + i : c.startRow;
      const col = c.direction === "across" ? c.startCol + i : c.startCol;
      grid[r][col].letter = c.answer[i];
      grid[r][col].isBlocked = false;
      if ((c as any).answered) {
        grid[r][col].revealed = true; // Auto-reveal untuk clue yang sudah dijawab
      }
    }
  });

  // 4. Hitung penomoran (kiri-ke-kanan, atas-ke-bawah)
  let currentNumber = 1;
  const sortedClues: CrosswordClue[] = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // Cari apakah ada clue yang berawal dari cell ini
      const startingClues = clues.filter((cl) => cl.startRow === r && cl.startCol === c);
      
      if (startingClues.length > 0) {
        // Assign nomor ke cell ini
        grid[r][c].number = currentNumber;
        
        // Simpan ke clues dengan nomor yang sudah diassign
        startingClues.forEach((cl) => {
          sortedClues.push({
            ...cl as CrosswordClue,
            number: currentNumber,
          });
        });
        
        currentNumber++;
      }
    }
  }

  return {
    grid,
    clues: sortedClues,
    activeClue: null,
  };
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
  crossword: buildCrosswordState([]), // Inisialisasi awal dengan empty state
};
