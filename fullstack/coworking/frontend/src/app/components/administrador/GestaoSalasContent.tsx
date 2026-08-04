"use client";

import {
  AlertCircle,
  Building2,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDeleteSalas, useGetSalas } from "../../services/hooks/useSalas";
import { SalaType } from "../../types/SalaType";
import ConfirmationModal from "../ui/ConfirmationModal";
import SalaFormModal from "./SalaFormModal";
import { useAuth } from "../../context/useAuth";
import { DecodeToken } from "../../utils/DecodeToken";
import AppPageSkeleton from "../ui/AppPageSkeleton";

export default function GestaoSalasContent() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSala, setSelectedSala] = useState<SalaType | null>(null);
  const [salaParaExcluir, setSalaParaExcluir] = useState<SalaType | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const accessToken = useAuth((state) => state.auth?.accessToken);
  const isAdmin = useMemo(
    () => Boolean(accessToken && DecodeToken(accessToken)?.eAdmin),
    [accessToken],
  );
  const {
    data: salas = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetSalas(isHydrated && isAdmin);
  const { mutateAsync: deleteSala } = useDeleteSalas();

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setIsHydrated(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "180px", threshold: 0.1 },
    );
    observerRef.current.observe(target);
    return () => observerRef.current?.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  function openCreateForm() {
    setSelectedSala(null);
    setIsFormOpen(true);
  }
  function openEditForm(sala: SalaType) {
    setSelectedSala(sala);
    setIsFormOpen(true);
  }
  function closeForm() {
    setIsFormOpen(false);
    setSelectedSala(null);
  }
  async function confirmDelete() {
    if (!salaParaExcluir) return;
    await deleteSala(salaParaExcluir.id);
    toast.success("Sala excluída com sucesso.");
    setSalaParaExcluir(null);
  }

  if (!isHydrated) return <AppPageSkeleton variant="list" />;
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
  if (isLoading) return <AppPageSkeleton variant="list" />;
  if (isError)
    return (
      <main className="min-h-screen bg-zinc-950 p-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/25 bg-red-400/5 p-8 text-center">
          <AlertCircle className="mx-auto h-7 w-7 text-red-300" />
          <h1 className="mt-3 text-xl font-semibold text-zinc-100">
            Não foi possível carregar as salas
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {error instanceof Error
              ? error.message
              : "Tente novamente em instantes."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200"
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
                <Building2 className="h-3.5 w-3.5" />
                Administração
              </div>
              <h1 className="mt-3 text-3xl font-semibold text-zinc-50 sm:text-4xl">
                Gestão de salas
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                Crie e mantenha os espaços disponíveis para reserva.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateForm}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300"
            >
              <Plus className="h-4 w-4" />
              Nova sala
            </button>
          </div>
        </section>
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/75">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <p className="text-sm font-medium text-zinc-200">
              {salas.length}{" "}
              {salas.length === 1 ? "sala cadastrada" : "salas cadastradas"}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-cyan-300 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>
          </div>
          {salas.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Building2 className="mx-auto h-8 w-8 text-zinc-600" />
              <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                Nenhuma sala cadastrada
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Comece criando o primeiro espaço do coworking.
              </p>
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 text-sm font-semibold text-cyan-300"
              >
                Criar primeira sala
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {salas.map((sala) => (
                <article
                  key={sala.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-zinc-100">
                      {sala.nome}
                    </h2>
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-400">
                      {sala.descricao || "Sem descrição cadastrada."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-cyan-400" />
                        {sala.capacidade} pessoas
                      </span>
                      <span>
                        R$ {Number(sala.precoLocacao).toFixed(2)} / hora
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(sala)}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-cyan-400/25 px-3 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/10"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setSalaParaExcluir(sala)}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-red-400/25 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-400/10"
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
                    Carregando mais salas...
                  </span>
                </>
              )}
            </div>
          )}
        </section>
      </div>
      <SalaFormModal
        sala={selectedSala}
        open={isFormOpen}
        onClose={closeForm}
      />
      <ConfirmationModal
        open={salaParaExcluir !== null}
        onOpenChange={(isOpen) => !isOpen && setSalaParaExcluir(null)}
        action="delete"
        entityName={salaParaExcluir?.nome ?? "sala"}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
