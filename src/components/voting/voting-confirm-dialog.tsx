"use client";

import { useState } from "react";
import { Info, Loader2 } from "lucide-react";
import type { VoteOption } from "./types";
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

interface VotingConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOption: VoteOption | null;
  onConfirm: () => Promise<boolean> | boolean;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function VotingConfirmDialog({
  open,
  onOpenChange,
  selectedOption,
  onConfirm,
  onCancel,
  isLoading,
}: VotingConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const success = await onConfirm();
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <Info className="w-6 h-6 text-blue-500" />
            <AlertDialogTitle className="text-blue-500 font-bold text-lg">
              Konfirmasi Pilihan
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Anda telah memilih <strong className="text-blue-500">{selectedOption}</strong>. Apakah Anda
            yakin?
            <br />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isConfirming || isLoading}
            onClick={(e) => {
              e.preventDefault();
              onCancel?.();
              onOpenChange(false);
            }}
            className="md:w-[50%] w-full h-12 bg-slate-200 hover:bg-slate-100 text-slate-900 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            className="md:w-[50%] w-full h-12 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isConfirming || isLoading}
            variant="green"
          >
            {isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Ya, Konfirmasi"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
