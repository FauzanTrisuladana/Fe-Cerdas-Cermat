import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard } from "@/services/dashboardService";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";
import HeaderComp from "@/components/shared/header-comp";

const REFRESH_INTERVAL = 10;

export const Route = createFileRoute("/admin/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const getDashboardFn = useServerFn(getDashboard);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const result = await getDashboardFn({ data: undefined });
      return result;
    },
    staleTime: 1000 * REFRESH_INTERVAL,
  });

  const handleManualRefresh = () => {
    dashboardQuery.refetch();
  };

  const data = dashboardQuery.data?.data;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <HeaderComp
          title="Dashboard"
          description="Rekap total suara per Nasi Goreng"
        />

        <DashboardHeaderActions
          query={dashboardQuery}
          onManualRefresh={handleManualRefresh}
        />
      </div>

      <DashboardSummaryCards
        stats={
          data ?? {
            total_A: 0,
            total_B: 0,
            total_C: 0,
            total_D: 0,
            total_E: 0,
          }
        }
        isLoading={dashboardQuery.isLoading}
      />
    </>
  );
}
