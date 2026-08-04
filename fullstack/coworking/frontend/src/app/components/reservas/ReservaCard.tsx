"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { ReservaType } from "../../types/ReservaType";
import {
  canCancelReservation,
  formatReservationDate,
  formatReservationCreatedAt,
  getReservationStatus,
} from "../../utils/reservas";

type ReservaCardProps = {
  reserva: ReservaType;
  onCancel: (reserva: ReservaType) => void;
  onEdit: (reserva: ReservaType) => void;
  isCancelling: boolean;
  showOwner?: boolean;
};

export default function ReservaCard({
  reserva,
  onCancel,
  onEdit,
  isCancelling,
  showOwner = false,
}: ReservaCardProps) {
  const isUpcoming = getReservationStatus(reserva) === "upcoming";
  const canCancel = canCancelReservation(reserva);

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/75 shadow-lg shadow-black/20 transition hover:border-cyan-400/35">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-400">
              Reserva confirmada
            </p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-50">
              {reserva.sala.nome}
            </h2>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${isUpcoming ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-300" : "border-zinc-700 bg-zinc-800 text-zinc-400"}`}
          >
            {isUpcoming ? "Agendada" : "Concluída"}
          </span>
        </div>

        <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>{formatReservationDate(reserva.data)}</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
            <Clock3 className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>
              {reserva.horarioInicio} às {reserva.horarioFim}
            </span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <Users className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>Até {reserva.sala.capacidade} pessoas</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <MapPin className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>
              R$ {Number(reserva.sala.precoLocacao).toFixed(2)} / hora
            </span>
          </div>
        </div>

        {showOwner && reserva.usuario && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3 py-2 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5 text-cyan-400" />
              Reservada por{" "}
              <strong className="font-semibold text-zinc-200">
                {reserva.usuario.nome}
              </strong>
            </span>
            <span>{formatReservationCreatedAt(reserva.dtCriacao)}</span>
          </div>
        )}

        {isUpcoming && (
          <div className="flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-zinc-500">
              {canCancel
                ? "Edições e cancelamentos são permitidos até 1 hora antes do início."
                : "Esta reserva não pode mais ser alterada por estar a menos de 1 hora do início."}
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                disabled={!canCancel || isCancelling}
                onClick={() => onEdit(reserva)}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </button>
              <button
                type="button"
                disabled={!canCancel || isCancelling}
                onClick={() => onCancel(reserva)}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400/60 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
              >
                <Trash2 className="h-4 w-4" />
                {isCancelling ? "Cancelando..." : "Cancelar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
