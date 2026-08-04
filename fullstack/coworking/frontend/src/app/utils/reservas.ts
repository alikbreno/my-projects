import { ReservaType } from "../types/ReservaType";

export type ReservationStatus = "upcoming" | "past";

export function getReservationStart(reserva: ReservaType): Date {
  const [year, month, day] = reserva.data.slice(0, 10).split("-").map(Number);
  const [hour, minute] = reserva.horarioInicio.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

export function getReservationStatus(reserva: ReservaType): ReservationStatus {
  return getReservationStart(reserva).getTime() > Date.now()
    ? "upcoming"
    : "past";
}

export function canCancelReservation(reserva: ReservaType): boolean {
  return getReservationStart(reserva).getTime() - Date.now() >= 60 * 60 * 1000;
}

export function formatReservationDate(date: string): string {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function formatReservationCreatedAt(date: string): string {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 60000),
  );
  if (elapsedMinutes < 60)
    return elapsedMinutes <= 1
      ? "criada agora"
      : `criada há ${elapsedMinutes} min`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24)
    return elapsedHours === 1
      ? "criada há 1 hora"
      : `criada há ${elapsedHours} horas`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  return elapsedDays === 1 ? "criada ontem" : `criada há ${elapsedDays} dias`;
}
