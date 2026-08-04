"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { ArrowLeft, CalendarDays, Clock3, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { ReservaSchema, type FormReserva } from "../../schemas/ReservaSchema";
import { SalaType } from "../../types/SalaType";
import { maskDate, maskTime } from "../../utils/MaskUtils";
import { useAddReservas } from "../../services/hooks/useReservas";
import { useSalaAvailability } from "../../services/hooks/useSalas";
import RoomAvailabilityClock from "./RoomAvailabilityClock";
import {
  isNotPastDate,
  isValidDateFormat,
  isValidDateRange,
} from "../../utils/ValidatorsUtils";

type ReservaFormProps = {
  sala: SalaType;
  onClose: () => void;
};

export default function ReservaForm({ sala, onClose }: ReservaFormProps) {
  const { mutateAsync, isPending } = useAddReservas();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormReserva>({
    resolver: zodResolver(ReservaSchema),
    mode: "onBlur",
    defaultValues: {
      data: "",
      horarioInicio: "",
      horarioFim: "",
    },
  });
  const selectedDate = useWatch({ control, name: "data" });
  const isValidSelectedDate = Boolean(
    selectedDate &&
    isValidDateFormat(selectedDate) &&
    isValidDateRange(selectedDate) &&
    isNotPastDate(selectedDate),
  );
  const availabilityDate = isValidSelectedDate
    ? (() => {
        const [day, month, year] = selectedDate.split("/");
        return `${year}-${month}-${day}`;
      })()
    : undefined;
  const {
    data: salaNaData,
    isFetching: isLoadingAvailability,
    isError: hasAvailabilityError,
  } = useSalaAvailability(sala.id, availabilityDate);

  const onSubmit = async (data: FormReserva) => {
    try {
      const [day, month, year] = data.data.split("/");
      await mutateAsync({
        data: `${year}-${month}-${day}`,
        horarioInicio: data.horarioInicio,
        horarioFim: data.horarioFim,
        salaId: sala.id,
      });
      reset();
      toast.success(`Reserva enviada para ${sala.nome}`);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a reserva. Tente novamente.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
        <div className="flex items-center justify-between gap-3 text-cyan-400">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <p className="text-sm font-semibold">Reserva: {sala.nome}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-cyan-300"
            aria-label="Voltar para os detalhes da sala"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          Preencha os dados abaixo para solicitar a reserva desta sala.
        </p>
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <RoomAvailabilityClock
            busySlots={salaNaData?.busySlots ?? sala.busySlots}
          />
          {isLoadingAvailability && (
            <p className="mt-2 text-xs text-cyan-300">
              Atualizando disponibilidade para a data selecionada...
            </p>
          )}
          {hasAvailabilityError && (
            <p role="alert" className="mt-2 text-xs text-red-300">
              Não foi possível atualizar a disponibilidade desta data.
            </p>
          )}
          {!availabilityDate && (
            <p className="mt-2 text-xs text-zinc-500">
              Informe uma data válida para consultar a agenda desse dia.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Data"
          placeholder="DD/MM/AAAA"
          {...register("data", {
            onChange: (e) => (e.target.value = maskDate(e.target.value)),
          })}
          error={!!errors.data}
          helperText={errors.data?.message}
          className="w-full"
          slotProps={{
            inputLabel: {
              sx: { color: "#a1a1aa", "&.Mui-focused": { color: "#22d3ee" } },
            },
            input: {
              sx: {
                color: "#f4f4f5",
                backgroundColor: "#18181b",
                borderRadius: 1,
                "& fieldset": { borderColor: "#3f3f46" },
                "&:hover fieldset": { borderColor: "#52525b" },
                "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
              },
            },
          }}
        />

        <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Horário de início"
            placeholder="HH:MM"
            {...register("horarioInicio", {
              onChange: (e) => (e.target.value = maskTime(e.target.value)),
            })}
            error={!!errors.horarioInicio}
            helperText={errors.horarioInicio?.message}
            className="w-full"
            slotProps={{
              inputLabel: {
                sx: { color: "#a1a1aa", "&.Mui-focused": { color: "#22d3ee" } },
              },
              input: {
                sx: {
                  color: "#f4f4f5",
                  backgroundColor: "#18181b",
                  borderRadius: 1,
                  "& fieldset": { borderColor: "#3f3f46" },
                  "&:hover fieldset": { borderColor: "#52525b" },
                  "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                },
              },
            }}
          />

          <TextField
            label="Horário de fim"
            placeholder="HH:MM"
            {...register("horarioFim", {
              onChange: (e) => (e.target.value = maskTime(e.target.value)),
            })}
            error={!!errors.horarioFim}
            helperText={errors.horarioFim?.message}
            className="w-full"
            slotProps={{
              inputLabel: {
                sx: { color: "#a1a1aa", "&.Mui-focused": { color: "#22d3ee" } },
              },
              input: {
                sx: {
                  color: "#f4f4f5",
                  backgroundColor: "#18181b",
                  borderRadius: 1,
                  "& fieldset": { borderColor: "#3f3f46" },
                  "&:hover fieldset": { borderColor: "#52525b" },
                  "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-cyan-400" />
          <span>
            Reservas devem ser feitas com pelo menos 2 horas de antecedência.
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isPending}
        className="inline-flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting || isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando reserva...
          </>
        ) : (
          "Confirmar reserva"
        )}
      </button>
    </form>
  );
}
