/**
 * Handle API error dengan format yang konsisten
 * Format error dari backend:
 * - status: string (unauthenticated, forbidden, error, dll)
 * - message: string
 * - errors: object (opsional, untuk validasi error 422)
 */
interface ApiError extends Error {
  apiErrors?: Record<string, Array<string>>;
  status?: number;
}

/**
 * Handle error dari API response
 * @param err - Error object dari axios atau error lainnya
 * @throws Error dengan properti apiErrors dan status
 */
const handleApiError = (err: any): never => {
  const data = err?.response?.data;
  const message = data?.message ?? err?.message ?? "Terjadi kesalahan";
  const errors = data?.errors ?? {};
  const status = err?.response?.status ?? 500;

  const error: ApiError = new Error(message);
  error.apiErrors = errors;
  error.status = status;

  throw error;
};

/**
 * Handle error dengan custom message
 * @param err - Error object
 * @param customMessage - Pesan custom jika ingin override
 */
const handleApiErrorWithMessage = (err: any, customMessage?: string): never => {
  const data = err?.response?.data;
  const message =
    customMessage ?? data?.message ?? err?.message ?? "Terjadi kesalahan";
  const errors = data?.errors ?? {};
  const status = err?.response?.status ?? 500;

  const error: ApiError = new Error(message);
  error.apiErrors = errors;
  error.status = status;

  throw error;
};

/**
 * Cek apakah error adalah error API
 * @param err - Error object yang akan dicek
 */
const isApiError = (err: any): err is ApiError => {
  return err?.status !== undefined && err?.apiErrors !== undefined;
};

/**
 * Ambil semua error messages dari apiErrors
 * @param err - Error object yang memiliki apiErrors
 */
const getErrorMessages = (err: ApiError): Array<string> => {
  const messages: Array<string> = [];
  const errors = err.apiErrors || {};

  Object.values(errors).forEach((fieldErrors) => {
    if (Array.isArray(fieldErrors)) {
      messages.push(...fieldErrors);
    }
  });

  return messages;
};

/**
 * Ambil error message untuk field tertentu
 * @param err - Error object yang memiliki apiErrors
 * @param field - Nama field yang ingin diambil error-nya
 */
const getFieldError = (err: ApiError, field: string): string | undefined => {
  return err.apiErrors?.[field]?.[0];
};

export {
  handleApiError,
  handleApiErrorWithMessage,
  isApiError,
  getErrorMessages,
  getFieldError,
  type ApiError,
};
