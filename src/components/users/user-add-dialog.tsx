import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FormEvent } from "react";
import type { UserFormErrors } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────
type UserAddDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreate: (payload: {
    name: string;
    email: string;
  }) => Promise<boolean> | boolean;
  errors?: UserFormErrors;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function UserAddDialog({
  open,
  onOpenChange,
  onCreate,
  errors: _errors,
}: UserAddDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = name.trim() !== "" && email.trim() !== "";

  const resetForm = () => {
    setName("");
    setEmail("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const success = await onCreate({
        name: name.trim(),
        email: email.trim(),
      });
      if (success) {
        setDialogOpen(false);
        resetForm();
      }
    } catch {
      toast.error("Gagal membuat user baru");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) resetForm();
    setDialogOpen(val);
  };

  const generalError = _errors?.general?.[0];
  const nameError = _errors?.name?.[0];
  const emailError = _errors?.email?.[0];

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogForm onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Tambah User Baru
            </DialogTitle>
            <DialogDescription>
              Isi form berikut untuk menambahkan user baru
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 py-4">
            {/* Nama Lengkap */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-600 font-medium">
                Nama Lengkap*
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="h-12"
                disabled={isLoading}
              />
              {nameError ? (
                <p className="text-sm text-destructive">{nameError}</p>
              ) : null}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-600 font-medium">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className="h-12"
                disabled={isLoading}
              />
              {emailError ? (
                <p className="text-sm text-destructive">{emailError}</p>
              ) : null}
            </div>

            {generalError ? (
              <p className="text-sm text-destructive">{generalError}</p>
            ) : null}
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="md:w-[50%] w-full h-12 cursor-pointer"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12 cursor-pointer"
              disabled={isLoading || !isFormValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogForm>
      </DialogContent>
    </Dialog>
  );
}
