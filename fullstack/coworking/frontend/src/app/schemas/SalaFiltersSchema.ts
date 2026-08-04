import { z } from "zod";
import {
  isNotPastDate,
  isValidDateFormat,
  isValidDateRange,
  isValidTimeFormat,
  isValidTimeRange,
} from "../utils/ValidatorsUtils";

const optionalDate = z
  .string()
  .trim()
  .refine(
    (value) =>
      !value ||
      (isValidDateFormat(value) &&
        isValidDateRange(value) &&
        isNotPastDate(value)),
    { message: "Informe uma data válida a partir de hoje (DD/MM/AAAA)." },
  );

const optionalTime = z
  .string()
  .trim()
  .refine(
    (value) => !value || (isValidTimeFormat(value) && isValidTimeRange(value)),
    { message: "Informe um horário válido no formato HH:MM." },
  );

export const SalaFiltersSchema = z
  .object({
    search: z.string().trim(),
    data: optionalDate,
    horario: optionalTime,
  })
  .superRefine(({ data, horario }, context) => {
    if (horario && !data) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data"],
        message: "Escolha uma data para filtrar por horário.",
      });
    }
  });

export type SalaFiltersForm = z.infer<typeof SalaFiltersSchema>;
