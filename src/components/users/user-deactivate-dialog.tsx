import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { UserRecord } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserDeactivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserRecord | null;
  onConfirm: (id: number) => Promise<boolean> | boolean;
}

export function UserDeactivateDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: UserDeactivateDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async (id: number) => {
    setIsProcessing(true);
    try {
      const success = await onConfirm(id);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle>Non-aktifkan User?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menon-aktifkan user <b>{user?.name}</b>?
            <br />
            User tidak akan bisa login sampai diaktifkan kembali.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isProcessing}
            className="md:w-[50%] w-full bg-slate-900 text-white hover:text-white hover:bg-slate-800 h-12 cursor-pointer"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-600 hover:bg-rose-700 md:w-[50%] w-full h-12 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (user) handleConfirm(user.id);
            }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Ya, Non-aktifkan"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
