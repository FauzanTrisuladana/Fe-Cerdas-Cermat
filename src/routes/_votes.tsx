import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_votes")({
  component: AuthLayout,
});

function AuthLayout() {

  // Autentikasi dan authorisasi dengan client-side
  // const isAuthorized = isAuthenticated();

  // useEffect(() => {
  //   if (!isAuthorized) {
  //     router.navigate({ to: "/login", replace: true });
  //   }
  // }, [isAuthorized, router]);

  // if (!isAuthorized) {
  //   return null;
  // }

  return <Outlet />;
}
