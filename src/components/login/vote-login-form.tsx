import * as React from "react";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { checkToken } from "@/services/voteService";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [kode, setKode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const checkTokenFn = useServerFn(checkToken);

  const handleAuthSuccess = async () => {
    await queryClient.refetchQueries({
      queryKey: ["profile"],
    });
    router.navigate({ to: "/vote", replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await checkTokenFn({ data: { code: kode } });

      if (!result) {
        setError("Respons server tidak valid.");
        toast.error("Respons server tidak valid.");
        return;
      }

      if (result.data.already_vote) {
        setError("Kode sudah digunakan untuk voting.");
        toast.error("Kode sudah digunakan untuk voting.");
        return;
      }

      localStorage.setItem("vote_token", kode);
      toast.success("Login berhasil silahkan pilih nasi goreng terbaik");
      handleAuthSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Kode tidak valid. Cek kode voting.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="relative h-40 w-full mb-4">
            <img
              src="/ngt5.webp"
              alt="Office Background"
              className="w-full h-full object-cover blur-[1px] rounded-md"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/Logo.webp"
                alt="Logo Nogotirto V"
                className="size-24 object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Penilaian Lomba Nasi Goreng
          </CardTitle>
          <CardDescription className="text-sm">
            Silakan Masukkan kode yang diberikan panitias untuk masuk ke sistem.
            Jika belum memiliki kode, hubungi panitia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} suppressHydrationWarning>
            <FieldGroup>
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Field className="gap-0">
                <FieldLabel
                  htmlFor="email"
                  className="text-muted-foreground font-bold"
                >
                  Kode
                </FieldLabel>
                <Input
                  id="kode"
                  type="kode"
                  placeholder="Masukkan Kode Voting"
                  className="p-5"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="font-bold bg-primary p-6 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Masuk
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
