import * as React from "react";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { login, loginWithGoogle } from "@/services/authService";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  // Login feature disabled for auth checking - DO NOT DELETE
  // FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginFn = useServerFn(login);
  const loginWithGoogleFn = useServerFn(loginWithGoogle);

  const handleAuthSuccess = async () => {
    await queryClient.refetchQueries({
      queryKey: ["profile"],
    });
    router.navigate({ to: "/admin/dashboard", replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginFn({ data: { email, password } });
      toast.success("Login berhasil!");
      handleAuthSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login gagal. Cek email/password.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      setError("Gagal menerima token dari Google");
      toast.error("Gagal menerima token dari Google");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await loginWithGoogleFn({ data: { id_token: idToken } });
      toast.success("Login Google berhasil!");
      handleAuthSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Login Google gagal.";
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
            Admin Login Penilaian Lomba Nasi Goreng
          </CardTitle>
          <CardDescription className="text-sm">
            Silakan login untuk mengakses halaman admin. Gunakan akun yang
            telah terdaftar atau masuk dengan AkunGoogle.
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
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan Email"
                  className="p-5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field className="gap-0">
                <div className="flex items-center">
                  <FieldLabel
                    htmlFor="password"
                    className="text-muted-foreground font-bold"
                  >
                    Password
                  </FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan Password"
                  required
                  className="p-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <FieldSeparator>Atau lanjutkan dengan</FieldSeparator>
              <Field>
                <div className="relative w-full h-12">
                  <Button
                    variant="outline"
                    type="button"
                    className="absolute inset-0 w-full h-full font-bold p-5 z-0"
                    disabled={isLoading}
                  >
                    <img
                      src="/google.svg"
                      alt="Google Logo"
                      className="h-4 w-4 mr-2"
                    />
                    Masuk Dengan Google
                  </Button>
                  <div className="absolute inset-0 z-10 opacity-0 overflow-hidden">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        setError("Gagal inisialisasi Google Login");
                        toast.error("Google Login Failed");
                      }}
                      useOneTap={false}
                      width="500"
                      text="signin_with"
                    />
                  </div>
                </div>
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
