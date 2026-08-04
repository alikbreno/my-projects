"use client";

import {
  AlertCircle,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import {
  useDeleteUsuarios,
  useInfiniteUsuarios,
} from "../../services/hooks/useUsuarios";
import { PublicUsuarioType } from "../../types/PublicUsuarioType";
import { DecodeToken } from "../../utils/DecodeToken";
import ConfirmationModal from "../ui/ConfirmationModal";
import AppPageSkeleton from "../ui/AppPageSkeleton";
import UsuarioFormModal from "./UsuarioFormModal";

export default function GestaoUsuariosContent() {
  const [hydrated, setHydrated] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<PublicUsuarioType | null>(null);
  const [toDelete, setToDelete] = useState<PublicUsuarioType | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const token = useAuth((state) => state.auth?.accessToken);
  const isAdmin = useMemo(
    () => Boolean(token && DecodeToken(token)?.eAdmin),
    [token],
  );
  const {
    data: usuarios = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteUsuarios(hydrated && isAdmin);
  const { mutateAsync: deleteUsuario } = useDeleteUsuarios();
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "180px" },
    );
    observerRef.current.observe(target);
    return () => observerRef.current?.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  async function confirmDelete() {
    if (!toDelete) return;
    await deleteUsuario(toDelete.id);
    toast.success("Usuário excluído com sucesso.");
    setToDelete(null);
  }
  if (!hydrated || (isAdmin && isLoading))
    return <AppPageSkeleton variant="list" />;
  if (!isAdmin)
    return (
      <main className="min-h-screen bg-zinc-950 p-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/25 bg-red-400/5 p-8 text-center">
          <AlertCircle className="mx-auto h-7 w-7 text-red-300" />
          <h1 className="mt-3 text-xl font-semibold text-zinc-100">
            Acesso restrito
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Esta página está disponível apenas para administradores.
          </p>
        </div>
      </main>
    );
  if (isError)
    return (
      <main className="min-h-screen bg-zinc-950 p-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/25 bg-red-400/5 p-8 text-center">
          <AlertCircle className="mx-auto h-7 w-7 text-red-300" />
          <h1 className="mt-3 text-xl font-semibold text-zinc-100">
            Não foi possível carregar usuários
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {error instanceof Error ? error.message : "Tente novamente."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),linear-gradient(135deg,#0f0f11_0%,#131316_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="rounded-4xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">
                <UserRound className="h-3.5 w-3.5" />
                Administração
              </div>
              <h1 className="mt-3 text-3xl font-semibold text-zinc-50 sm:text-4xl">
                Gestão de usuários
              </h1>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Gerencie contas e permissões de acesso.
              </p>
            </div>
            <button
              onClick={() => {
                setSelected(null);
                setFormOpen(true);
              }}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300"
            >
              <Plus className="h-4 w-4" />
              Novo usuário
            </button>
          </div>
        </section>
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/75">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <p className="text-sm font-medium text-zinc-200">
              {usuarios.length}{" "}
              {usuarios.length === 1
                ? "usuário cadastrado"
                : "usuários cadastrados"}
            </p>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="cursor-pointer inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-300 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>
          </div>
          {usuarios.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <UserRound className="mx-auto h-8 w-8 text-zinc-600" />
              <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                Nenhum usuário encontrado
              </h2>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {usuarios.map((usuario) => (
                <article
                  key={usuario.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-lg font-semibold text-zinc-100">
                        {usuario.nome}
                      </h2>
                      {usuario.eAdmin && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                          <ShieldCheck className="h-3 w-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-zinc-400">
                      {usuario.email}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {usuario.telefone || "Sem telefone cadastrado"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => {
                        setSelected(usuario);
                        setFormOpen(true);
                      }}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-cyan-400/25 px-3 py-2 text-sm text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => setToDelete(usuario)}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-red-400/25 px-3 py-2 text-sm text-red-300 transition hover:border-red-400/60 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="flex min-h-14 items-center justify-center border-t border-zinc-800"
            >
              {isFetchingNextPage && (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-400" />
                  <span className="text-sm text-zinc-400">
                    Carregando mais usuários...
                  </span>
                </>
              )}
            </div>
          )}
        </section>
      </div>
      <UsuarioFormModal
        usuario={selected}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelected(null);
        }}
      />
      <ConfirmationModal
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        action="delete"
        entityName={toDelete?.nome ?? "usuário"}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
