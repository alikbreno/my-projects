"use client";

import { AlertCircle, CalendarDays, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ReservaType } from "../../types/ReservaType";
import { getReservationStatus } from "../../utils/reservas";
import {
  useDeleteReservas,
  useInfiniteReservas,
} from "../../services/hooks/useReservas";
import ReservaCard from "./ReservaCard";
import ReservasEmptyState from "./ReservasEmptyState";
import ConfirmationModal from "../ui/ConfirmationModal";
import EditarReservaModal from "./EditarReservaModal";
import AppPageSkeleton from "../ui/AppPageSkeleton";
import { useAuth } from "../../context/useAuth";
import { DecodeToken } from "../../utils/DecodeToken";

type Filter = "all" | "upcoming" | "past";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "upcoming", label: "Agendadas" },
  { value: "past", label: "Concluídas" },
];

export default function MinhasReservasContent() {
  const [filter, setFilter] = useState<Filter>("all");
  const accessToken = useAuth((state) => state.auth?.accessToken);
  const isAdmin = useMemo(() => Boolean(accessToken && DecodeToken(accessToken)?.eAdmin), [accessToken]);
  const [reservaParaCancelar, setReservaParaCancelar] =
    useState<ReservaType | null>(null);
  const [reservaParaEditar, setReservaParaEditar] =
    useState<ReservaType | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteReservas();
  const { mutateAsync: deleteReserva, isPending: isCancelling } =
    useDeleteReservas();
  const reservas = useMemo(
    () => data?.pages.flatMap((page) => page.reservas) ?? [],
    [data],
  );

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

  const filteredReservas = useMemo(
    () =>
      reservas.filter(
        (reserva) =>
          filter === "all" || getReservationStatus(reserva) === filter,
      ),
    [filter, reservas],
  );

  async function confirmCancellation() {
    if (!reservaParaCancelar) return;

    await deleteReserva(reservaParaCancelar.id);
    toast.success("Reserva cancelada com sucesso.");
    setReservaParaCancelar(null);
  }

  if (isLoading) return <AppPageSkeleton variant="cards" />;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),linear-gradient(135deg,#0f0f11_0%,#131316_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-4xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                  {isAdmin ? "Agenda geral" : "Minha agenda"}
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                {isAdmin ? "Reservas do coworking" : "Minhas reservas"}
              </h1>
              <p className="text-sm leading-7 text-zinc-400 sm:text-base">
                {isAdmin ? "Acompanhe todas as reservas, seus responsáveis e o momento em que foram criadas." : "Acompanhe os espaços agendados e cancele quando houver pelo menos uma hora de antecedência."}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-400">
              <p className="font-medium text-zinc-100">
                {reservas.length}{" "}
                {reservas.length === 1 ? "reserva" : "reservas"}
              </p>
              <p className="mt-1">Seu histórico e próximos encontros.</p>
            </div>
          </div>
        </section>

        <section aria-label="Lista de reservas" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/80 p-1">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition ${filter === value ? "bg-cyan-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>
          </div>

          {isError ? (
            <div className="rounded-3xl border border-red-400/25 bg-red-400/5 p-6 text-center">
              <AlertCircle className="mx-auto h-7 w-7 text-red-300" />
              <h2 className="mt-3 font-semibold text-zinc-100">
                Não foi possível carregar suas reservas
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {error instanceof Error
                  ? error.message
                  : "Tente novamente em instantes."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-cyan-400/40"
              >
                Tentar novamente
              </button>
            </div>
          ) : filteredReservas.length === 0 ? (
            <ReservasEmptyState hasFilter={filter !== "all"} />
          ) : (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredReservas.map((reserva) => (
                  <ReservaCard
                    key={reserva.id}
                    reserva={reserva}
                    onCancel={setReservaParaCancelar}
                    onEdit={setReservaParaEditar}
                    isCancelling={isCancelling}
                    showOwner={isAdmin}
                  />
                ))}
              </div>
              <div
                ref={loadMoreRef}
                className="flex min-h-12 items-center justify-center"
              >
                {isFetchingNextPage && (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-400" />
                    <span className="text-sm text-zinc-400">
                      Carregando mais reservas...
                    </span>
                  </>
                )}
              </div>
            </>
          )}
          {!isLoading &&
            !isError &&
            filteredReservas.length === 0 &&
            hasNextPage && (
              <div
                ref={loadMoreRef}
                className="flex min-h-12 items-center justify-center"
              >
                {isFetchingNextPage && (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-400" />
                    <span className="text-sm text-zinc-400">
                      Carregando mais reservas...
                    </span>
                  </>
                )}
              </div>
            )}
        </section>
      </div>
      <ConfirmationModal
        open={reservaParaCancelar !== null}
        onOpenChange={(open) => !open && setReservaParaCancelar(null)}
        action="delete"
        entityName={
          reservaParaCancelar
            ? `a reserva da sala ${reservaParaCancelar.sala.nome}`
            : "reserva"
        }
        confirmLabel="Cancelar reserva"
        onConfirm={confirmCancellation}
      />
      <EditarReservaModal
        reserva={reservaParaEditar}
        onClose={() => setReservaParaEditar(null)}
      />
    </main>
  );
}
