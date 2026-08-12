// Shared data used across components

export type KasOption = {
  id: number;
  nama: string;
};

export type AkunOption = {
  id: number;
  nama: string;
};

export const KAS_OPTIONS: Array<KasOption> = [
  { id: 1, nama: "kas pemuda" },
  { id: 2, nama: "17 an" },
];

export const AKUN_OPTIONS: Array<AkunOption> = [
  { id: 1, nama: "Cash Bila" },
  { id: 2, nama: "Cash" },
  { id: 3, nama: "Rekening" },
];
