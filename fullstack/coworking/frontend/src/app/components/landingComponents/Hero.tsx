import Link from "next/link";

export default function Hero() {
  return (
    <section id="top" className="pt-24 pb-20 md:pt-28 md:pb-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            <span className="font-mono text-xs text-cyan-400">
              DISPONIBILIDADE EM TEMPO REAL
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.08] tracking-tight text-zinc-50 mb-5">
            Seu próximo espaço de trabalho está a{" "}
            <span className="text-cyan-400">um clique</span> de distância.
          </h1>

          <p className="text-lg text-zinc-400 max-w-md mb-9">
            O COWORKINGapp mostra na hora quais mesas e salas estão livres,
            em cada unidade parceira, e deixa você reservar sem ligação, sem
            e-mail e sem fila.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 mb-10">
            <Link
              href="/salas"
              className="inline-flex items-center justify-center rounded-lg bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 hover:-translate-y-0.5 transition-all"
            >
              Ver espaços disponíveis
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
            >
              Como funciona
            </a>
          </div>

          <div className="flex gap-8 flex-wrap">
            <div className="border-l-2 border-zinc-700 pl-3">
              <div className="font-mono text-lg text-zinc-50">38</div>
              <div className="text-xs text-zinc-500">espaços parceiros</div>
            </div>
            <div className="border-l-2 border-zinc-700 pl-3">
              <div className="font-mono text-lg text-zinc-50">4.2k</div>
              <div className="text-xs text-zinc-500">reservas por mês</div>
            </div>
            <div className="border-l-2 border-zinc-700 pl-3">
              <div className="font-mono text-lg text-zinc-50">97%</div>
              <div className="text-xs text-zinc-500">satisfação</div>
            </div>
          </div>
        </div>

        <BookingPreviewCard />
      </div>
    </section>
  );
}

function BookingPreviewCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-xs text-zinc-500">RESERVA #4821</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 px-2.5 py-1 font-mono text-xs text-cyan-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Confirmada
        </span>
      </div>

      <h3 className="font-display font-semibold text-zinc-50 text-lg mb-1">
        Sala Ipê — reunião
      </h3>
      <p className="text-sm text-zinc-400 mb-5">
        Unidade Centro · até 6 pessoas
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
          <div className="text-xs text-zinc-500 mb-1">Data</div>
          <div className="text-sm text-zinc-200 font-medium">Qui, 30 jul</div>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
          <div className="text-xs text-zinc-500 mb-1">Horário</div>
          <div className="text-sm text-zinc-200 font-medium">
            14:00 – 15:00
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-cyan-400 to-cyan-700 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-semibold text-zinc-950">
            AN
          </div>
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-zinc-500 to-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-semibold text-zinc-100">
            RC
          </div>
          <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-semibold text-zinc-400">
            +2
          </div>
        </div>
        <span className="font-mono text-sm text-zinc-100">
          R$ 80<span className="text-zinc-500 text-xs">/hora</span>
        </span>
      </div>
    </div>
  );
}