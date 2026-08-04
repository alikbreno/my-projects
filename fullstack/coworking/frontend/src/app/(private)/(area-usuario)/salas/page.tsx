import SalaSection from "@/src/app/components/salas/SalaSection";
import { Suspense } from "react";
import SalaList from "@/src/app/components/salas/SalaList";
import SalaFallback from "@/src/app/components/salas/SalaFallback";
import SalaFilters from "@/src/app/components/salas/SalaFilters";

export default function Salas() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),linear-gradient(135deg,#0f0f11_0%,#131316_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <SalaSection />
        <Suspense fallback={<SalaFallback />}>
          <SalaFilters />
          <SalaList />
        </Suspense>
      </div>
    </main>
  );
}
