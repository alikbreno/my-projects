export default function SalaSection() {
  return (
    <section className="rounded-4xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8 lg:p-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-300">
              Espaços disponíveis
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Encontre o espaço ideal para sua próxima reserva.
          </h1>
          <p className="text-sm leading-7 text-zinc-400 sm:text-base">
            Explore salas com capacidade, preço e ambiente indicados para
            reuniões, trabalho em equipe ou momentos de foco.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-400">
          <p className="font-medium text-zinc-200">
            Disponibilidade em tempo real
          </p>
          <p className="mt-1">Encontre o espaço ideal para o seu horário.</p>
        </div>
      </div>
    </section>
  );
}
