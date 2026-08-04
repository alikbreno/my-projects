"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { Loader2, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { salaSchema, type FormSala } from "../../schemas/SalaSchema";
import { useAddSalas, useUpdateSalas } from "../../services/hooks/useSalas";
import { SalaType } from "../../types/SalaType";
import ConfirmationModal from "../ui/ConfirmationModal";
import ModalBase from "../ui/ModalBase";

type SalaFormModalProps = {
  sala: SalaType | null;
  open: boolean;
  onClose: () => void;
};
const slots = {
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

export default function SalaFormModal({
  sala,
  open,
  onClose,
}: SalaFormModalProps) {
  const isEditing = sala !== null;
  const [pendingUpdate, setPendingUpdate] = useState<FormSala | null>(null);
  const { mutateAsync: addSala, isPending: isCreating } = useAddSalas();
  const { mutateAsync: updateSala, isPending: isUpdating } = useUpdateSalas();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSala>({ resolver: zodResolver(salaSchema), mode: "onBlur" });

  useEffect(() => {
    reset(
      sala
        ? {
            nome: sala.nome,
            capacidade: sala.capacidade,
            descricao: sala.descricao ?? "",
            precoLocacao: sala.precoLocacao,
          }
        : { nome: "", capacidade: 1, descricao: "", precoLocacao: 0 },
    );
  }, [reset, sala, open]);

  async function createSala(data: FormSala) {
    try {
      await addSala(data);
      toast.success("Sala criada com sucesso.");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a sala.",
      );
    }
  }
  function requestSave(data: FormSala) {
    if (isEditing) setPendingUpdate(data);
    else void createSala(data);
  }
  async function confirmUpdate() {
    if (!sala || !pendingUpdate) return;
    await updateSala({ id: sala.id, data: pendingUpdate });
    toast.success("Sala atualizada com sucesso.");
    setPendingUpdate(null);
    onClose();
  }

  return (
    <ModalBase
      openModal={open}
      setOpenModal={(isOpen) => !isOpen && onClose()}
      titleTooltip="Fechar formulário"
      className="max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-0"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-300">
            {isEditing ? (
              <Save className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">
              {isEditing ? "Editar sala" : "Nova sala"}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Defina as informações que estarão disponíveis para os usuários.
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(requestSave)}
          noValidate
          className="mt-6 flex flex-col gap-5"
        >
          <TextField
            label="Nome da sala"
            {...register("nome")}
            error={Boolean(errors.nome)}
            helperText={errors.nome?.message}
            className="w-full"
            slotProps={slots}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Capacidade"
              type="number"
              {...register("capacidade")}
              error={Boolean(errors.capacidade)}
              helperText={errors.capacidade?.message}
              className="w-full"
              slotProps={slots}
            />
            <TextField
              label="Preço por hora (R$)"
              type="number"
              {...register("precoLocacao")}
              error={Boolean(errors.precoLocacao)}
              helperText={errors.precoLocacao?.message}
              className="w-full"
              slotProps={slots}
            />
          </div>
          <TextField
            label="Descrição"
            multiline
            minRows={4}
            {...register("descricao")}
            error={Boolean(errors.descricao)}
            helperText={errors.descricao?.message}
            className="w-full"
            slotProps={slots}
          />
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:opacity-60"
          >
            {isCreating || isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              <Save className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isEditing ? "Salvar alterações" : "Criar sala"}
          </button>
        </form>
      </div>
      <ConfirmationModal
        open={pendingUpdate !== null}
        onOpenChange={(isOpen) => !isOpen && setPendingUpdate(null)}
        action="update"
        entityName={sala?.nome ?? "sala"}
        onConfirm={confirmUpdate}
      />
    </ModalBase>
  );
}
