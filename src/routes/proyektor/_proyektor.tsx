import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";

export const Route = createFileRoute("/proyektor/_proyektor")({
  component: ProyektorLayout,
});

/**
 * Layout parent untuk semua halaman proyektor.
 * - Fullscreen, dark background
 * - Toaster diposisikan di tengah untuk notifikasi skor
 * - Non-interaktif (tanpa sidebar/header admin)
 * - useRealtimeSync di sini agar semua child routes tersinkron (skor + timer)
 */
function ProyektorLayout() {
  // Sinkron real-time: score + timer via WebSocket
  useRealtimeSync();

  return (
    <div className="relative min-h-svh w-full bg-slate-950 text-white overflow-hidden">
      {/* Subtle noise/grain background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "150px 150px",
        }}
      />

      {/* Gradient radial subtle */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,58,138,0.15),transparent_70%)] pointer-events-none" />

      {/* Konten utama */}
      <div className="relative z-10 h-svh flex flex-col p-6">
        <Outlet />
      </div>
    </div>
  );
}

