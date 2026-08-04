import { z } from "zod";
import {
  isValidCpfFormat,
  isValidPasswordFormat,
  isValidPhoneFormat,
} from "../utils/ValidatorsUtils";

export const MinhaContaSchema = z
  .object({
    nome: z.string().trim().min(2, "Informe seu nome completo."),
    email: z.string().trim().email("Digite um e-mail válido."),
    cpf: z.string().trim().refine(isValidCpfFormat, "CPF inválido."),
    telefone: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || isValidPhoneFormat(value),
        "Telefone inválido.",
      ),
    senha: z
      .string()
      .refine(
        (value) => !value || isValidPasswordFormat(value),
        "A senha deve ter 8 caracteres, letra maiúscula, minúscula e número.",
      ),
    confirmaSenha: z.string(),
  })
  .refine(({ senha, confirmaSenha }) => !senha || senha === confirmaSenha, {
    path: ["confirmaSenha"],
    message: "As senhas devem ser iguais.",
  });

export type MinhaContaForm = z.infer<typeof MinhaContaSchema>;
