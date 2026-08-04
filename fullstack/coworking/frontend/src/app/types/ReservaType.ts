import { SalaType } from "./SalaType";

export type ReservaType = {
  id: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  dtCriacao: string;
  dtAtualizacao: string;
  usuarioId: string;
  salaId: string;
  sala: SalaType;
  usuario?: { id: string; nome: string; email: string };
};

export type ReservaPost = {
  data: string;
  horarioInicio: string;
  horarioFim: string;
  salaId: string;
};

export type ReservaUpdate = Partial<Pick<ReservaPost, "data" | "horarioInicio" | "horarioFim">>;
