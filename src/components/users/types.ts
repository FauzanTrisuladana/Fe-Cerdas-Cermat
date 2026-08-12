export type UserStatus = "Aktif" | "Tidak Aktif" | "Pending";

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  profile_image: string | null;
  has_password: boolean;
};

export type UserFormErrors = Partial<Record<string, Array<string>>> | null;

// Status options untuk filter - sesuai dengan backend enum
export const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "Aktif", label: "Aktif" },
  { value: "Tidak Aktif", label: "Tidak Aktif" },
  { value: "Pending", label: "Pending" },
];
