import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoginForm } from "@/components/login/login-form";
import { isAuthenticated } from "@/services/authService";

export const Route = createFileRoute("/admin/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [router]);

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[3px]"
        style={{
          backgroundImage: "url('/ngt5.webp')",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-md z-10">
        <LoginForm />
      </div>
    </div>
  );
}
