export default function LoginSection() {
  return (
    <section className="flex flex-1 flex-col justify-between bg-zinc-900/70 p-8 sm:p-10 lg:p-12">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-300">
            Acesso seguro
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Entre e continue reservando com confiança.
          </h1>
          <p className="max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            Organize suas reservas, acompanhe sua agenda e tenha uma experiência
            fluida em cada acesso.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
          <p className="text-sm font-medium text-zinc-200">
            O que você encontra aqui
          </p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>• Acesse reservas anteriores e futuras em um só lugar.</li>
            <li>• Veja salas e horários em tempo real.</li>
            <li>• Receba uma experiência mais rápida e organizada.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
