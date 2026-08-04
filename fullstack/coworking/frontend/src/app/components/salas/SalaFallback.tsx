export default function SalaFallback() {
  return (
    <div
      aria-label="Carregando salas"
      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60"
        >
          <div className="h-48 animate-pulse bg-zinc-800/80" />
          <div className="space-y-4 p-5">
            <div className="h-6 w-2/3 animate-pulse rounded-xl bg-zinc-800/80" />
            <div className="h-4 w-full animate-pulse rounded-xl bg-zinc-800/80" />
            <div className="h-4 w-4/5 animate-pulse rounded-xl bg-zinc-800/80" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-800/80" />
          </div>
        </article>
      ))}
    </div>
  );
}
