import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  title?: string;
  error?: any;
  reset?: () => void;
}

const ErrorPage = ({
  title = "Terjadi Kesalahan",
  error,
  reset,
}: ErrorPageProps) => {
  let errorMessage = "Terjadi kesalahan yang tidak diketahui.";

  if (error) {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      errorMessage =
        "Koneksi internet lambat (Request Timeout). Silakan coba lagi.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>

      <p className="text-slate-500 max-w-[400px] mb-6">{errorMessage}</p>

      {reset && (
        <Button
          onClick={reset}
          variant="outline"
          className="gap-2 border-slate-300 hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
};

export default ErrorPage;
