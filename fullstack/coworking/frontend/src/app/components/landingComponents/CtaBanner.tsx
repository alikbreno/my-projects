import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="rounded-[20px] border border-zinc-700 bg-linear-to-br from-zinc-900 to-zinc-800 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 mb-2">
            Pronto pra encontrar seu próximo espaço?
          </h2>
          <p className="text-zinc-400">
            Crie sua conta grátis e veja as mesas disponíveis perto de você
            agora.
          </p>
        </div>
        <div className="flex gap-3.5 shrzinc-0">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 hover:-translate-y-0.5 transition-all"
          >
            Criar conta grátis
          </Link>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
          >
            Falar com vendas
          </a>
        </div>
      </div>
    </section>
  );
}