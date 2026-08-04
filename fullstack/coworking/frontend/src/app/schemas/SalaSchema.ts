import { z } from "zod";

export const salaSchema = z.object({
  nome: z.string().trim().min(1, "Preenchimento obrigatório"),
  capacidade: z.coerce
    .number({
      invalid_type_error: "A capacidade deve ser um número.",
    })
    .int("Deve ser um número inteiro.")
    .positive("A capacidade deve ser maior que 0."),
  descricao: z
    .string()
    .trim()
    .max(500, "A descrição deve ter no máximo 500 caracteres.")
    .optional(),
  precoLocacao: z.coerce
    .number({
      invalid_type_error: "O preço deve ser um número.",
    })
    .min(0, "O preço não pode ser negativo."),
});

export type FormSala = z.infer<typeof salaSchema>;
