"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InputAdornment, TextField } from "@mui/material";
import { CalendarDays, Clock3, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmationModal from "../ui/ConfirmationModal";
import ModalBase from "../ui/ModalBase";
import { ReservaSchema, type FormReserva } from "../../schemas/ReservaSchema";
import { useUpdateReservas } from "../../services/hooks/useReservas";
import { ReservaType } from "../../types/ReservaType";
import { maskDate, maskTime } from "../../utils/MaskUtils";

type EditarReservaModalProps = {
  reserva: ReservaType | null;
  onClose: () => void;
};

function toDisplayDate(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}
function toApiDate(date: string) {
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
}

const slotProps = {
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
};

export default function EditarReservaModal({
  reserva,
  onClose,
}: EditarReservaModalProps) {
  const [pendingUpdate, setPendingUpdate] = useState<FormReserva | null>(null);
  const { mutateAsync: updateReserva, isPending } = useUpdateReservas();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormReserva>({
    resolver: zodResolver(ReservaSchema),
    mode: "onBlur",
  });

  if (!reserva) return null;
  const reservaId = reserva.id;

  function handleModalChange(open: boolean) {
    if (!open) {
      reset();
      onClose();
    }
  }
  function requestUpdate(data: FormReserva) {
    setPendingUpdate(data);
  }

  async function confirmUpdate() {
    if (!pendingUpdate) return;
    await updateReserva({
      id: reservaId,
      data: {
        data: toApiDate(pendingUpdate.data),
        horarioInicio: pendingUpdate.horarioInicio,
        horarioFim: pendingUpdate.horarioFim,
      },
    });
    toast.success("Reserva atualizada com sucesso.");
    setPendingUpdate(null);
    onClose();
  }

  return (
    <ModalBase
      openModal={Boolean(reserva)}
      setOpenModal={handleModalChange}
      titleTooltip="Fechar edição"
      className="max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950 p-0"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-300">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">
              Editar reserva
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {reserva.sala.nome}. Alterações exigem pelo menos 2 horas de
              antecedência.
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(requestUpdate)}
          noValidate
          className="mt-6 flex flex-col gap-6"
        >
          <TextField
            label="Data"
            placeholder="DD/MM/AAAA"
            defaultValue={toDisplayDate(reserva.data)}
            {...register("data", {
              onChange: (event) =>
                (event.target.value = maskDate(event.target.value)),
            })}
            error={Boolean(errors.data)}
            helperText={errors.data?.message}
            className="w-full"
            slotProps={{
              ...slotProps,
              input: {
                ...slotProps.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarDays className="h-4 w-4 text-zinc-500" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Horário de início"
              placeholder="HH:MM"
              defaultValue={reserva.horarioInicio}
              {...register("horarioInicio", {
                onChange: (event) =>
                  (event.target.value = maskTime(event.target.value)),
              })}
              error={Boolean(errors.horarioInicio)}
              helperText={errors.horarioInicio?.message}
              className="w-full"
              slotProps={{
                ...slotProps,
                input: {
                  ...slotProps.input,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Clock3 className="h-4 w-4 text-zinc-500" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Horário de fim"
              placeholder="HH:MM"
              defaultValue={reserva.horarioFim}
              {...register("horarioFim", {
                onChange: (event) =>
                  (event.target.value = maskTime(event.target.value)),
              })}
              error={Boolean(errors.horarioFim)}
              helperText={errors.horarioFim?.message}
              className="w-full"
              slotProps={{
                ...slotProps,
                input: {
                  ...slotProps.input,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Clock3 className="h-4 w-4 text-zinc-500" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
            Salvar alterações
          </button>
        </form>
      </div>
      <ConfirmationModal
        open={pendingUpdate !== null}
        onOpenChange={(open) => !open && setPendingUpdate(null)}
        action="update"
        entityName={`a reserva da sala ${reserva.sala.nome}`}
        onConfirm={confirmUpdate}
      />
    </ModalBase>
  );
}
