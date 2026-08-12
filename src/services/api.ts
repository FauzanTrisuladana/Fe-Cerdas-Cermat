import axios from "axios";
import { getRequest } from "@tanstack/react-start/server";
import { parse, serialize } from "cookie";
import { env } from "@/env";

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(`${key}[]`, v));
        } else if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      return searchParams.toString();
    },
  },
});

api.interceptors.request.use((config) => {
  const request = getRequest();

  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const token = cookies.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Remove Content-Type for FormData to let axios set multipart/form-data automatically
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          "Set-Cookie": [tokenCookie, userCookie].join(", "),
          "Content-Type": "application/json",
        },
      });
    }

    if (error.code === "ECONNABORTED") {
      console.warn("Request timed out (30s limit exceeded)");
    }

    return Promise.reject(error);
  },
);
