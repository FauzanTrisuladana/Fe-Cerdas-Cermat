import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { useGameState } from "@/hooks/use-game-state";
import { getGameState } from "@/services/gameStateService";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/proyektor/_proyektor")({
  component: ProyektorLayout,
});

function ProyektorLayout() {
  useRealtimeSync();
  const { state, updateState } = useGameState();
  const navigate = useNavigate();

  // 1. Fetch initial game state from server (supaya dapat halaman terakhir)
  const getGameStateFn = useServerFn(getGameState);

  useQuery({
    queryKey: ["game-state-initial"],
    queryFn: async () => {
      try {
        const response = await getGameStateFn();
        if (response?.data) {
          updateState((prev) => ({
            ...prev,
            ...response.data
          }));
        }
        return response;
      } catch (error) {
        console.error("Failed to fetch initial game state:", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Cukup fetch sekali di awal
  });

  // 2. Efek untuk otomatis berpindah halaman jika currentView berubah
  useEffect(() => {
    const viewToUrl: Record<string, string> = {
      judul: "/proyektor",
      babak1: "/proyektor/babak/1",
      babak2: "/proyektor/babak/2",
      babak3: "/proyektor/babak/3",
      babak4: "/proyektor/babak/4",
      skor: "/proyektor/skor",
    };

    const targetUrl = viewToUrl[state.currentView];

    if (targetUrl) {
      navigate({ to: targetUrl, replace: true });
    }
  }, [state.currentView, navigate]);

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

