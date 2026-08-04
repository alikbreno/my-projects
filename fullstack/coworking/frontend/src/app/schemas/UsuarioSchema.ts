import { z } from "zod";
import {
  isValidCpfFormat,
  isValidPasswordFormat,
  isValidPhoneFormat,
} from "../utils/ValidatorsUtils";

export const UsuarioSchema = z
  .object({
    nome: z.string().trim().min(1, { message: "Preenchimento obrigatório" }),
    email: z.string().trim().email({ message: "Digite um email válido" }),
    senha: z
      .string()
      .min(1, { message: "Preenchimento obrigatório" })
      .max(30, { message: "O campo não deve ter mais que 30 caracteres" })
      .refine(isValidPasswordFormat, {
        message:
          "A senha deve conter pelo menos, 8 caracteres, uma letra minúscula, uma maiúscula e um número",
      }),
    confirmaSenha: z
      .string()
      .min(1, { message: "Preenchimento obrigatório" })
      .max(30, { message: "O campo não deve ter mais que 30 caracteres" }),
    telefone: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) =>
          val === undefined || val.trim() === "" || isValidPhoneFormat(val),
        { message: "Formato de telefone inválido" },
      ),
    cpf: z
      .string()
      .trim()
      .min(1, { message: "Preenchimento Obrigatório" })
      .refine(isValidCpfFormat, { message: "XXX.XXX.XXX-XX" }),
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: "As senhas devem ser iguais.",
    path: ["confirmaSenha"],
  });

export type FormUsuario = z.infer<typeof UsuarioSchema>;
