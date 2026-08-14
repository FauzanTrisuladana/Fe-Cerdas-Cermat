import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { LogOut } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VotingConfirmDialog } from "@/components/voting/voting-confirm-dialog";
import { submitVote } from "@/services/voteService";
import type { VoteOption } from "@/components/voting/types";

const votingOptions = [
  { id: "A", title: "Pilih jika anda menyukai Nasi Goreng A", color: "violet" as const },
  { id: "B", title: "Pilih jika anda menyukai Nasi Goreng B", color: "sky" as const },
  { id: "C", title: "Pilih jika anda menyukai Nasi Goreng C", color: "emerald" as const },
  { id: "D", title: "Pilih jika anda menyukai Nasi Goreng D", color: "amber" as const },
  { id: "E", title: "Pilih jika anda menyukai Nasi Goreng E", color: "rose" as const },
];

const colorMap = {
  violet: { text: "text-violet-600", bg: "bg-violet-50" },
  sky: { text: "text-sky-600", bg: "bg-sky-50" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50" },
  amber: { text: "text-amber-600", bg: "bg-amber-50" },
  rose: { text: "text-rose-600", bg: "bg-rose-50" },
} as const;

export function VotingCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const submitVoteFn = useServerFn(submitVote);

  const [selected, setSelected] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if no token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("vote_token");
    if (!token) {
      router.navigate({ to: "/login", replace: true });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("vote_token");
    toast.success("Berhasil keluar dari sesi.");
    router.navigate({ to: "/login", replace: true });
  };

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setDialogOpen(true);
  };

  const handleConfirm = async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("vote_token");
      if (!token) {
        toast.error("Sesi voting tidak valid. Silakan login kembali.");
        router.navigate({ to: "/login", replace: true });
        return false;
      }

      await submitVoteFn({
        data: {
          voter_code: token,
          vote_choice: selected as VoteOption,
        },
      });

      toast.success(
        "Terimakasih sudah memilih, pilihan anda berhasil tersimpan",
      );
      localStorage.removeItem("vote_token");
      setDialogOpen(false);
      setSelected(null);
      router.navigate({ to: "/login", replace: true });
      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal menyimpan vote. Coba lagi.";
      toast.error(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    setDialogOpen(false);
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
        <Card className="w-full">
          <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle
                className="text-3xl font-bold tracking-tight"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                Juara Favorit Warga
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground leading-relaxed mt-1">
                Silakan pilih nasi goreng favorit Anda berdasarkan kriteria Lomba
                Nasi Goreng Perumahan Nogotirto V. Pilih satu opsi di bawah.
              </CardDescription>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="sm:self-start self-end text-sm font-semibold text-destructive border border-destructive/30 rounded-lg px-3.5 py-2 hover:bg-destructive/10 hover:border-destructive transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Keluar Sesi
            </button>
          </CardHeader>

          <CardContent className="pt-0">
            <form onSubmit={handleSubmitClick} suppressHydrationWarning>
              {/* 5-option voting grid */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 mb-8">
                {votingOptions.map((option) => {
                  const isSelected = selected === option.id;
                  const colors = colorMap[option.color];
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelected(option.id)}
                      className={cn(
                        "relative flex flex-col gap-4 p-6 min-h-44 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer select-none",
                        "hover:shadow-xl hover:-translate-y-1.5",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xl shadow-primary/20 ring-2 ring-primary/30"
                          : "border-border bg-card hover:border-primary/40",
                      )}
                      aria-pressed={isSelected}
                    >
                      {/* Badge */}
                      <span
                        className={cn(
                          "inline-flex items-center justify-center w-12 h-12 rounded-full text-base font-bold shrink-0 transition-colors duration-200",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : `${colors.bg} ${colors.text}`,
                        )}
                      >
                        {option.id}
                      </span>

                      {/* Title */}
                      <span
                        className={cn(
                          "text-base font-semibold leading-snug transition-colors duration-200",
                          isSelected ? "text-primary" : colors.text,
                        )}
                      >
                        {option.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selected}
                className={cn(
                  "w-full py-4 px-4 rounded-xl font-semibold text-base tracking-wide transition-all duration-200",
                  selected
                    ? "bg-foreground text-background hover:bg-foreground/85 shadow-md cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-60",
                )}
              >
                Kirim Vote Saya
              </button>

              {/* Footer note */}
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Satu suara per sesi • Anonim • Hasil real-time
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Confirm Dialog */}
      <VotingConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedOption={selected as VoteOption | null}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={isSubmitting}
      />
    </>
  );
}
