import { Loader2 } from "lucide-react";
import SalaModal from "./SalaModal";
import SalaCard from "./SalaCard";
import { SalaType } from "../../types/SalaType";
import { useEffect, useRef, useState } from "react";
import { useInfiniteSalas } from "../../services/hooks/useSalas";
import { useSearchParams } from "next/navigation";

export default function SalasGrid() {
  const searchParams = useSearchParams();
  const filters = {
    search: searchParams.get("search")?.trim() ?? "",
    date: searchParams.get("date") ?? "",
    time: searchParams.get("time") ?? "",
  };
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [selectedSala, setSelectedSala] = useState<SalaType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteSalas(filters);
  const salas = data.pages.flatMap((page) => page.salas);

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

  function handleSelectSala(sala: SalaType) {
    setSelectedSala(sala);
    setIsModalOpen(true);
  }

  if (salas.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/50 px-6 py-14 text-center">
        <h2 className="text-xl font-semibold text-zinc-100">
          Nenhuma sala encontrada
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Ajuste os filtros para encontrar outros espaços disponíveis.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {salas.map((sala) => (
          <SalaCard key={sala.id} sala={sala} onSelect={handleSelectSala} />
        ))}
      </section>
      <div
        ref={loadMoreRef}
        className="flex min-h-12 items-center justify-center"
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
      <SalaModal
        sala={selectedSala}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
