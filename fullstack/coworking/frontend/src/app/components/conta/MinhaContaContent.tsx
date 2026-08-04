"use client";

import {
  AlertCircle,
  CalendarCheck2,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DecodeToken } from "../../utils/DecodeToken";
import { useAuth } from "../../context/useAuth";
import {
  useDeleteUsuarios,
  useUsuario,
} from "../../services/hooks/useUsuarios";
import ConfirmationModal from "../ui/ConfirmationModal";
import MinhaContaForm from "./MinhaContaForm";
import AppPageSkeleton from "../ui/AppPageSkeleton";

export default function MinhaContaContent() {
  const router = useRouter();
  const accessToken = useAuth((state) => state.auth?.accessToken);
  const clearAuth = useAuth((state) => state.clearAuth);
  const userId = useMemo(
    () => (accessToken ? (DecodeToken(accessToken)?.sub ?? null) : null),
    [accessToken],
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    data: usuario,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsuario(userId);
  const { mutateAsync: deleteUsuario } = useDeleteUsuarios();

  async function deleteAccount() {
    if (!userId) return;
    await deleteUsuario(userId);
    clearAuth();
    router.replace("/sign-in");
  }

  if (isLoading || !userId)
    return <AppPageSkeleton variant="profile" />;
  if (isError || !usuario)
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/25 bg-red-400/5 p-8 text-center">
          <AlertCircle className="mx-auto h-7 w-7 text-red-300" />
          <h1 className="mt-3 text-xl font-semibold text-zinc-100">
            Não foi possível carregar sua conta
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {error instanceof Error
              ? error.message
              : "Tente novamente em instantes."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );

  const initials = usuario.nome
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const createdAt = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(usuario.dtCriacao));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),linear-gradient(135deg,#0f0f11_0%,#131316_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-4xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-cyan-300 to-cyan-600 text-2xl font-bold text-zinc-950">
              {initials}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">
                <UserRound className="h-3.5 w-3.5" />
                Minha conta
              </div>
              <h1 className="mt-3 text-3xl font-semibold text-zinc-50">
                Olá, {usuario.nome.split(" ")[0]}
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Conta criada em {createdAt}.
              </p>
            </div>
          </div>
        </section>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/75 p-5 sm:p-7">
            <MinhaContaForm usuario={usuario} />
          </section>
          <aside className="space-y-4">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/75 p-5">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <h2 className="mt-3 font-semibold text-zinc-100">
                Acesso seguro
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Sua sessão é protegida por autenticação e expira
                automaticamente.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/minhas-reservas")}
              className="cursor-pointer flex w-full items-center gap-3 rounded-3xl border border-zinc-800 bg-zinc-900/75 p-5 text-left transition hover:border-cyan-400/40"
            >
              <CalendarCheck2 className="h-5 w-5 text-cyan-400" />
              <span>
                <span className="block font-semibold text-zinc-100">
                  Minhas reservas
                </span>
                <span className="mt-1 block text-sm text-zinc-400">
                  Consulte sua agenda.
                </span>
              </span>
            </button>
            <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-5">
              <Trash2 className="h-5 w-5 text-red-300" />
              <h2 className="mt-3 font-semibold text-zinc-100">
                Excluir conta
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Remove permanentemente sua conta e seus dados.
              </p>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="cursor-pointer mt-4 text-sm font-semibold text-red-300 hover:text-red-200"
              >
                Excluir minha conta
              </button>
            </div>
          </aside>
        </div>
      </div>
      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        action="delete"
        entityName="sua conta"
        confirmLabel="Excluir minha conta"
        onConfirm={deleteAccount}
      />
    </main>
  );
}
