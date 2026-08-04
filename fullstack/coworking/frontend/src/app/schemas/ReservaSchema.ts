import { z } from "zod";
import {
  isNotPastDate,
  isValidDateFormat,
  isValidDateRange,
  isValidTimeFormat,
  isValidTimeOrder,
  isValidTimeRange,
} from "../utils/ValidatorsUtils";

export const ReservaSchema = z
  .object({
    data: z
      .string()
      .trim()
      .refine(isValidDateFormat, {
        message: "Formato esperado: DD/MM/AAAA",
      })
      .refine((val) => isValidDateRange(val), {
        message: "Data inválida.",
      })
      .refine((val) => isNotPastDate(val), {
        message: "A data da reserva não pode ser no passado.",
      }),

    horarioInicio: z
      .string()
      .trim()
      .refine(isValidTimeFormat, {
        message: "Formato inválido. Use HH:MM",
      })
      .refine(isValidTimeRange, {
        message:
          "Horário inexistente (Use horas de 00 a 23 e minutos de 00 a 59)",
      }),

    horarioFim: z
      .string()
      .trim()
      .refine(isValidTimeFormat, {
        message: "Formato inválido. Use HH:MM",
      })
      .refine(isValidTimeRange, {
        message:
          "Horário inexistente (Use horas de 00 a 23 e minutos de 00 a 59)",
      }),
  })
  .refine((data) => isValidTimeOrder(data.horarioInicio, data.horarioFim), {
    message: "O horário final deve ser maior que o horário inicial",
    path: ["horarioFim"],
  });

export type FormReserva = z.infer<typeof ReservaSchema>;
