"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/useAuth";

type LogoutButtonProps = {
  mobile?: boolean;
};

export default function LogoutButton({ mobile = false }: LogoutButtonProps) {
  const router = useRouter();
  const clearAuth = useAuth((state) => state.clearAuth);

  function handleLogout() {
    clearAuth();
    router.replace("/sign-in");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        mobile
          ? "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
          : "cursor-pointer ml-2 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
      }
    >
      <LogOut size={mobile ? 18 : 16} className="text-cyan-400" />
      Sair
    </button>
  );
}
