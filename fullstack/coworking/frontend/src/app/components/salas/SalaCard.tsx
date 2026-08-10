"use client";

import Image from "next/image";
import { Users, DollarSign, ArrowRight } from "lucide-react";
import { SalaType } from "../../types/SalaType";
import { cleanMasksNumeralDocuments } from "../../utils/MaskUtils";
import RoomAvailabilityClock from "./RoomAvailabilityClock";

type SalaCardProps = {
  sala: SalaType;
  onSelect: (sala: SalaType) => void;
};

const imagens = [
  "/sala-reuniao.webp",
  "/mesa-compartilhada.webp",
  "/salas-privativas.webp",
];

export default function SalaCard({ sala, onSelect }: SalaCardProps) {
  const imageSrc =
    imagens[
      Number(cleanMasksNumeralDocuments(sala.id) || "0") % imagens.length
    ];

  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 text-left shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/40">
      <button
        type="button"
        onClick={() => onSelect(sala)}
        className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
      >
        <div className="relative h-48 w-full">
          <Image
            src={imageSrc}
            alt={sala.nome}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
        </div>
        <div className="space-y-4 px-5 pb-4 pt-5">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-zinc-50">{sala.nome}</h3>
            <p className="line-clamp-2 text-sm text-zinc-400">
              {sala.descricao ||
                "Espaço moderno, confortável e preparado para reuniões e trabalho em equipe."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1">
              <Users className="h-4 w-4 text-cyan-400" />
              {sala.capacidade} pessoas
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1">
              <DollarSign className="h-4 w-4 text-cyan-400" />
              R$ {Number(sala.precoLocacao).toFixed(2)}
            </span>
          </div>
        </div>
      </button>
      <div className="mx-5 border-y border-zinc-800 py-3">
        <RoomAvailabilityClock busySlots={sala.busySlots} />
      </div>
      <button
        type="button"
        onClick={() => onSelect(sala)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-cyan-400 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
      >
        <span>Ver detalhes e reservar</span>
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </button>
    </article>
  );
}
