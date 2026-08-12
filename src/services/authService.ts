import { createServerFn } from "@tanstack/react-start";
import { serialize } from "cookie";
import { api } from "./api";
import { handleApiError } from "./errorService";
import { env } from "@/env";

// Types
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  profile_image: string | null;
  has_password: boolean;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: User;
  auth: {
    token: string;
    token_type: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginGoogleCredentials {
  id_token: string;
}

export const login = createServerFn({ method: "POST" })
  .validator((data: LoginCredentials) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      const { token, token_type } = response.data.auth;
      const user = response.data.data;

      const tokenCookie = serialize("token", token, {
        httpOnly: true,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      const userCookie = serialize("user", JSON.stringify(user.id), {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      return new Response(
        JSON.stringify({ ...response.data, token, token_type }),
        {
          headers: {
            "Set-Cookie": [tokenCookie, userCookie].join(", "),
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      handleApiError(error);
    }
  });

export const loginWithGoogle = createServerFn({ method: "POST" })
  .validator((data: LoginGoogleCredentials) => data)
  .handler(async ({ data }) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login-google", data);
      const { token, token_type } = response.data.auth;
      const user = response.data.data;

      const tokenCookie = serialize("token", token, {
        httpOnly: true,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      const userCookie = serialize("user", JSON.stringify(user.id), {
        httpOnly: false,
        secure: env.VITE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      });

      return new Response(
        JSON.stringify({ ...response.data, token, token_type }),
        {
          headers: {
            "Set-Cookie": [tokenCookie, userCookie].join(", "),
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      handleApiError(error);
    }
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const tokenCookie = serialize("token", "", {
    httpOnly: true,
    secure: env.VITE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  const userCookie = serialize("user", "", {
    httpOnly: false,
    secure: env.VITE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout API error:", error);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Set-Cookie": [tokenCookie, userCookie].join(", "),
      "Content-Type": "application/json",
    },
  });
});

export const isAuthenticated = (): boolean => {
  if (typeof document === "undefined") {
    return false;
  }

  const cookies = document.cookie.split(";");
  const userCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("user="),
  );

  return !!userCookie;
};
