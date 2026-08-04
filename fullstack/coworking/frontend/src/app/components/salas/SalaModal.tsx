"use client";

import Image from "next/image";
import { Users, DollarSign, CalendarDays } from "lucide-react";
import ModalBase from "../ui/ModalBase";
import { SalaType } from "../../types/SalaType";
import ReservaForm from "./ReservaForm";
import { cleanMasksNumeralDocuments } from "../../utils/MaskUtils";

type SalaModalProps = {
  sala: SalaType | null;
  open: boolean;
  onClose: () => void;
};

const imagens = [
  "/sala-reuniao.webp",
  "/mesa-compartilhada.webp",
  "/salas-privativas.webp",
];

export default function SalaModal({ sala, open, onClose }: SalaModalProps) {
  if (!sala) return null;

  const imageSrc =
    imagens[
      Number(cleanMasksNumeralDocuments(sala.id) || "0") % imagens.length
    ];

  return (
    <ModalBase
      openModal={open}
      setOpenModal={onClose}
      titleTooltip="Fechar detalhes da sala"
      className="max-w-4xl bg-zinc-950 border border-zinc-800 p-0 rounded-[1.75rem]"
    >
      <div className="overflow-hidden rounded-[1.75rem] bg-zinc-900">
        <div className="relative h-56 w-full sm:h-72">
          <Image
            src={imageSrc}
            alt={sala.nome}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
              Sala disponível
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-50">
              {sala.nome}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-sm text-zinc-300">
                <Users className="h-4 w-4 text-cyan-400" />
                {sala.capacidade} pessoas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-sm text-zinc-300">
                <DollarSign className="h-4 w-4 text-cyan-400" />
                R$ {Number(sala.precoLocacao).toFixed(2)} / hora
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-sm text-zinc-300">
                <CalendarDays className="h-4 w-4 text-cyan-400" />
                Reserva de até 4 horas
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="text-sm font-semibold text-zinc-100">Descrição</p>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                {sala.descricao ||
                  "Espaço acolhedor e moderno, ideal para reuniões, workshops ou trabalho focado em equipe."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <ReservaForm sala={sala} onClose={onClose} />
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
