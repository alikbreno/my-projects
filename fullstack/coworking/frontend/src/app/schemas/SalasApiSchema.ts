import { z } from "zod";

export const BusySlotSchema = z.object({
  horarioInicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  horarioFim: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
});

export const SalaApiSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  capacidade: z.number().int().positive(),
  descricao: z.string().nullable(),
  precoLocacao: z.number(),
  busySlots: z.array(BusySlotSchema),
});

export const SalasApiResponseSchema = z.object({
  salas: z.array(SalaApiSchema),
  nextCursor: z.string().uuid().nullable(),
});
