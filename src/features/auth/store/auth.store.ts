import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cookieUtils } from "@/lib/cookies";
import type { AuthState, User } from "../types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user: User, token: string) => {
        // Store token in cookie
        cookieUtils.setToken(token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        // Remove token from cookie
        cookieUtils.removeToken();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist token in localStorage, only in cookie
      }),
    },
  ),
);
