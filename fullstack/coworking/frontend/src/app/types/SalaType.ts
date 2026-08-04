export type BusySlot = {
  horarioInicio: string;
  horarioFim: string;
};

export type SalaType = {
  id: string;
  nome: string;
  capacidade: number;
  descricao: string | null;
  precoLocacao: number;
  busySlots: BusySlot[];
};
