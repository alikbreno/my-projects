"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Loader2, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  isValidCpfFormat,
  isValidPasswordFormat,
  isValidPhoneFormat,
} from "../../utils/ValidatorsUtils";
import {
  cleanMasksNumeralDocuments,
  maskCPF,
  maskPhone,
} from "../../utils/MaskUtils";
import {
  useCreateAdminUsuario,
  useUpdateAdminUsuario,
} from "../../services/hooks/useUsuarios";
import { PublicUsuarioType } from "../../types/PublicUsuarioType";
import ConfirmationModal from "../ui/ConfirmationModal";
import ModalBase from "../ui/ModalBase";

const schema = z
  .object({
    nome: z.string().trim().min(2, "Informe o nome."),
    email: z.string().trim().email("E-mail inválido."),
    cpf: z.string().refine(isValidCpfFormat, "CPF inválido."),
    telefone: z
      .string()
      .optional()
      .refine(
        (value) => !value || isValidPhoneFormat(value),
        "Telefone inválido.",
      ),
    senha: z
      .string()
      .refine(
        (value) => !value || isValidPasswordFormat(value),
        "Senha fraca.",
      ),
    confirmaSenha: z.string(),
    eAdmin: z.boolean(),
  })
  .refine((data) => !data.senha || data.senha === data.confirmaSenha, {
    path: ["confirmaSenha"],
    message: "As senhas devem ser iguais.",
  });
type FormData = z.infer<typeof schema>;
type Props = {
  usuario: PublicUsuarioType | null;
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

export default function UsuarioFormModal({ usuario, open, onClose }: Props) {
  const isEditing = usuario !== null;
  const [pendingUpdate, setPendingUpdate] = useState<FormData | null>(null);
  const { mutateAsync: createUsuario, isPending: isCreating } =
    useCreateAdminUsuario();
  const { mutateAsync: updateUsuario, isPending: isUpdating } =
    useUpdateAdminUsuario();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onBlur" });
  useEffect(() => {
    reset(
      usuario
        ? {
            nome: usuario.nome,
            email: usuario.email,
            cpf: maskCPF(usuario.cpf),
            telefone: usuario.telefone ? maskPhone(usuario.telefone) : "",
            senha: "",
            confirmaSenha: "",
            eAdmin: usuario.eAdmin,
          }
        : {
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
            senha: "",
            confirmaSenha: "",
            eAdmin: false,
          },
    );
  }, [open, reset, usuario]);
  const toPayload = (data: FormData) => ({
    nome: data.nome,
    email: data.email,
    cpf: cleanMasksNumeralDocuments(data.cpf),
    telefone: data.telefone || undefined,
    eAdmin: data.eAdmin,
    ...(data.senha ? { senha: data.senha } : {}),
  });
  async function create(data: FormData) {
    try {
      if (!data.senha) {
        toast.error("Informe uma senha para criar o usuário.");
        return;
      }
      await createUsuario(toPayload(data));
      toast.success("Usuário criado com sucesso.");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o usuário.",
      );
    }
  }
  async function confirmUpdate() {
    if (!usuario || !pendingUpdate) return;
    await updateUsuario({ id: usuario.id, data: toPayload(pendingUpdate) });
    toast.success("Usuário atualizado com sucesso.");
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
        <h2 className="text-xl font-semibold text-zinc-100">
          {isEditing ? "Editar usuário" : "Novo usuário"}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Gerencie os dados e o nível de acesso da conta.
        </p>
        <form
          onSubmit={handleSubmit((data) =>
            isEditing ? setPendingUpdate(data) : void create(data),
          )}
          noValidate
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          <TextField
            label="Nome"
            {...register("nome")}
            error={Boolean(errors.nome)}
            helperText={errors.nome?.message}
            className="sm:col-span-2"
            slotProps={slots}
          />
          <TextField
            label="E-mail"
            {...register("email")}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            slotProps={slots}
          />
          <TextField
            label="CPF"
            {...register("cpf", {
              onChange: (event) =>
                (event.target.value = maskCPF(event.target.value)),
            })}
            error={Boolean(errors.cpf)}
            helperText={errors.cpf?.message}
            slotProps={slots}
          />
          <TextField
            label="Telefone"
            {...register("telefone", {
              onChange: (event) =>
                (event.target.value = maskPhone(event.target.value)),
            })}
            error={Boolean(errors.telefone)}
            helperText={errors.telefone?.message}
            slotProps={slots}
          />
          <div className="hidden sm:block" />
          <TextField
            label={isEditing ? "Nova senha (opcional)" : "Senha"}
            type="password"
            {...register("senha")}
            error={Boolean(errors.senha)}
            helperText={errors.senha?.message}
            slotProps={slots}
          />
          <TextField
            label="Confirmar senha"
            type="password"
            {...register("confirmaSenha")}
            error={Boolean(errors.confirmaSenha)}
            helperText={errors.confirmaSenha?.message}
            slotProps={slots}
          />
          <FormControlLabel
            className="sm:col-span-2"
            control={
              <Checkbox
                {...register("eAdmin")}
                sx={{ color: "#71717a", "&.Mui-checked": { color: "#22d3ee" } }}
              />
            }
            label={
              <span className="text-sm text-zinc-300">
                Conceder acesso de administrador
              </span>
            }
          />
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 disabled:opacity-60 sm:col-span-2"
          >
            {isCreating || isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              <Save className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isEditing ? "Salvar alterações" : "Criar usuário"}
          </button>
        </form>
      </div>
      <ConfirmationModal
        open={pendingUpdate !== null}
        onOpenChange={(isOpen) => !isOpen && setPendingUpdate(null)}
        action="update"
        entityName={usuario?.nome ?? "usuário"}
        onConfirm={confirmUpdate}
      />
    </ModalBase>
  );
}
