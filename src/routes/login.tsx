import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/login/vote-login-form";
import { Card } from "#/components/ui/card";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const voteToken = localStorage.getItem("vote_token");
    if (voteToken) {
      router.navigate({ to: "/vote", replace: true });
    }
    setIsChecking(false);
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
      {isChecking ? (
        <div className="relative z-10 w-full max-w-md">
          <Card className="p-8 flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
            <p className="text-sm text-muted-foreground">
              Memeriksa sesi login...
            </p>
          </Card>
        </div>
      ) : (
        <>
          <div className="relative w-full max-w-md z-10">
            <LoginForm />
          </div>
        </>
      )}
    </div>
  );
}
