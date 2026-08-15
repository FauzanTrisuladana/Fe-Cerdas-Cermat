import { createFileRoute, Link } from "@tanstack/react-router";
import { Monitor, Trophy } from "lucide-react";

export const Route = createFileRoute("/proyektor/_proyektor/")({
  component: ProyektorJudul,
});

/**
 * Halaman Judul / Prestart Proyektor
 * - Logo + nama acara memenuhi layar
 * - Background: foto ngt5.webp
 * - Non-interaktif (display only)
 */
function ProyektorJudul() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center gap-8 -m-6 overflow-hidden">
      {/* Background foto */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/ngt5.webp')" }}
      />
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-black/75" />
      {/* Gradient overlay bawah */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Konten */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-8">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-2xl bg-blue-500/20 scale-150" />
          <img
            src="/Logo.webp"
            alt="Logo Nogotirto 5"
            className="relative w-48 h-48 object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          />
        </div>

        {/* Judul */}
        <div className="flex flex-col gap-3">
          <h1 className="text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
            Lomba Cerdas Cermat
          </h1>
          <p className="text-4xl font-bold text-blue-300 tracking-wide">
            Bagimu Negeri 2026
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-sm">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/30" />
          <Trophy className="w-6 h-6 text-amber-400" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/30" />
        </div>

        {/* Sub-teks sponsor/acara */}
        <p className="text-white/60 text-xl font-medium">
          Perumahan Nogotirto V — RT 01, 02, 03, 04, 05
        </p>
      </div>

      {/* Link navigasi ke halaman lain (DEV only) */}
      {import.meta.env.DEV && (
        <div className="relative z-10 flex flex-wrap gap-2 justify-center">
          <p className="text-white/30 text-xs w-full text-center">[DEV] Navigasi cepat</p>
          {[1, 2, 3, 4].map((b) => (
            <Link
              key={b}
              to={("/proyektor/babak/" + b) as any}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-full font-semibold transition-all"
            >
              <Monitor className="w-3 h-3" />
              Babak {b}
            </Link>
          ))}
          <Link
            to="/proyektor/skor"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-full font-semibold transition-all"
          >
            <Trophy className="w-3 h-3" />
            Skor
          </Link>
        </div>
      )}
    </div>
  );
}
