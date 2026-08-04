import Link from "next/link";
import { CalendarPlus2 } from "lucide-react";

type ReservasEmptyStateProps = {
  hasFilter: boolean;
};

export default function ReservasEmptyState({
  hasFilter,
}: ReservasEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
        <CalendarPlus2 className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-zinc-100">
        {hasFilter
          ? "Nenhuma reserva neste filtro"
          : "Você ainda não tem reservas"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
        {hasFilter
          ? "Tente visualizar outro período para encontrar suas reservas."
          : "Escolha uma sala disponível e organize seu próximo momento de trabalho."}
      </p>
      {!hasFilter && (
        <Link
          href="/salas"
          className="mt-6 inline-flex rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
        >
          Explorar salas
        </Link>
      )}
    </div>
  );
}
