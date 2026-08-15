import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Monitor } from "lucide-react";
import { SkorTable } from "@/components/proyektor/skor-table";

export const Route = createFileRoute("/proyektor/_proyektor/skor")({
  component: ProyektorSkor,
});

function ProyektorSkor() {
  // Babak yang sudah dilaksanakan (untuk demo bisa di-toggle)
  const [completedRounds] = useState<number[]>([1, 2, 3]);

  return (
    <div className="flex flex-col flex-1 gap-6 min-h-0">
      {/* DEV nav */}
      {import.meta.env.DEV && (
        <div className="flex items-center gap-2 text-xs text-white/30 flex-shrink-0">
          <Link to="/proyektor" className="hover:text-white/60 transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Judul
          </Link>
          {[1, 2, 3, 4].map((b) => (
            <Link key={b} to={("/proyektor/babak/" + b) as any}
              className="hover:text-white/60 transition-colors flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              B{b}
            </Link>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="text-center flex-shrink-0">
        <h1 className="text-5xl font-black text-white tracking-wide">
          Papan Skor
        </h1>
        <p className="text-white/50 mt-2 text-lg">
          Lomba Cerdas Cermat Bagimu Negeri 2026
        </p>
        <div className="mt-3 mx-auto w-32 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent rounded-full" />
      </div>

      {/* Tabel skor */}
      <div className="flex-1 flex items-start justify-center overflow-y-auto">
        <div className="w-full max-w-4xl">
          <SkorTable completedRounds={completedRounds} />
        </div>
      </div>

      {/* Badge babak selesai */}
      <div className="flex justify-center gap-3 flex-shrink-0">
        {[1, 2, 3, 4].map((b) => (
          <span
            key={b}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              completedRounds.includes(b)
                ? "bg-emerald-800/60 text-emerald-300 border border-emerald-600/50"
                : "bg-white/5 text-white/20 border border-white/10"
            }`}
          >
            Babak {b}
          </span>
        ))}
      </div>
    </div>
  );
}
