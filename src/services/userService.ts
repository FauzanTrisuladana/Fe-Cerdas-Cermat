import { createServerFn } from "@tanstack/react-start";
import { api } from "./api";
import { handleApiError } from "./errorService";

// Types
export type UserStatus = "Aktif" | "Tidak Aktif" | "Pending";

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  profile_image: string | null;
  has_password: boolean;
};

export type UsersResponse = {
  status: string;
  message: string;
  data: Array<UserRecord>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type UserResponse = {
  status: string;
  message: string;
  data: UserRecord;
};

export type IndexUserParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: Array<string>;
};

export type StoreUserPayload = {
  nama: string;
  email: string;
};

// Get list of users
export const getUsers = createServerFn({ method: "GET" })
  .validator((data: { params?: IndexUserParams }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.get<UsersResponse>("/user", {
        params: data.params,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Create user
export const createUser = createServerFn({ method: "POST" })
  .validator((data: StoreUserPayload) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<UserResponse>("/user", data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Delete user
export const deleteUser = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.delete<UserResponse>(`/user/${data.id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });

// Toggle user status
export const toggleUserStatus = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.put<UserResponse>(
        `/user/${data.id}/toggle-status`,
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  });
