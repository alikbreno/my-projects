"use client";

import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DecodeToken } from "../utils/DecodeToken";

const COOKIE_NAME = "userLoged";

export type AuthProps = {
  accessToken: string;
};

type UseAuthProps = {
  auth: AuthProps | null;
  setToken: (auth: AuthProps) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
};

const cookieStorage = {
  getItem: (name: string) => Cookies.get(name) ?? null,
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { expires: 7, path: "/", sameSite: "lax" });
  },
  removeItem: (name: string) => {
    Cookies.remove(name, { path: "/" });
  },
};

function hasValidToken(auth: AuthProps | null): boolean {
  if (!auth?.accessToken) return false;

  const payload = DecodeToken(auth.accessToken);
  return payload !== null && payload.exp > Date.now() / 1000;
}

export const useAuth = create<UseAuthProps>()(
  persist(
    (set, get) => ({
      auth: null,
      setToken: (auth) => set({ auth }),
      clearAuth: () => {
        set({ auth: null });
        // O persist grava o novo estado durante o set; removemos o cookie
        // depois para que o middleware também bloqueie a próxima navegação.
        cookieStorage.removeItem(COOKIE_NAME);
      },
      isAuthenticated: () => hasValidToken(get().auth),
    }),
    {
      name: COOKIE_NAME,
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
);
