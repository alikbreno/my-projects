"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InputAdornment, TextField } from "@mui/material";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  MinhaContaSchema,
  type MinhaContaForm as MinhaContaFormData,
} from "../../schemas/MinhaContaSchema";
import { useUpdateUsuarioAtual } from "../../services/hooks/useUsuarios";
import { PublicUsuarioType } from "../../types/PublicUsuarioType";
import {
  cleanMasksNumeralDocuments,
  maskCPF,
  maskPhone,
} from "../../utils/MaskUtils";

type MinhaContaFormProps = {
  usuario: PublicUsuarioType;
};

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

export default function MinhaContaForm({ usuario }: MinhaContaFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: updateUsuario, isPending } = useUpdateUsuarioAtual();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MinhaContaFormData>({
    resolver: zodResolver(MinhaContaSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    reset({
      nome: usuario.nome,
      email: usuario.email,
      cpf: maskCPF(usuario.cpf),
      telefone: usuario.telefone ? maskPhone(usuario.telefone) : "",
      senha: "",
      confirmaSenha: "",
    });
  }, [reset, usuario]);

  async function submitForm(data: MinhaContaFormData) {
    try {
      await updateUsuario({
        id: usuario.id,
        data: {
          nome: data.nome,
          email: data.email,
          cpf: cleanMasksNumeralDocuments(data.cpf),
          telefone: data.telefone || undefined,
          ...(data.senha ? { senha: data.senha } : {}),
        },
      });
      reset({ ...data, senha: "", confirmaSenha: "" });
      toast.success("Dados atualizados com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar seus dados.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} noValidate className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Dados pessoais</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Mantenha suas informações de contato atualizadas.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Nome completo"
          {...register("nome")}
          error={Boolean(errors.nome)}
          helperText={errors.nome?.message}
          className="sm:col-span-2"
          slotProps={{
            ...slotProps,
            input: {
              ...slotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <UserRound className="h-4 w-4 text-zinc-500" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="E-mail"
          type="email"
          {...register("email")}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          slotProps={{
            ...slotProps,
            input: {
              ...slotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <Mail className="h-4 w-4 text-zinc-500" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Telefone"
          {...register("telefone", {
            onChange: (event) =>
              (event.target.value = maskPhone(event.target.value)),
          })}
          error={Boolean(errors.telefone)}
          helperText={errors.telefone?.message}
          slotProps={{
            ...slotProps,
            input: {
              ...slotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <Phone className="h-4 w-4 text-zinc-500" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="CPF"
          {...register("cpf", {
            onChange: (event) =>
              (event.target.value = maskCPF(event.target.value)),
          })}
          error={Boolean(errors.cpf)}
          helperText={errors.cpf?.message}
          className="sm:col-span-2"
          slotProps={slotProps}
        />
      </div>
      <div className="border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-semibold text-zinc-100">Segurança</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Deixe os campos vazios se não quiser alterar sua senha.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Nova senha"
            type={showPassword ? "text" : "password"}
            {...register("senha")}
            error={Boolean(errors.senha)}
            helperText={errors.senha?.message}
            slotProps={{
              ...slotProps,
              input: {
                ...slotProps.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <LockKeyhole className="h-4 w-4 text-zinc-500" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-zinc-500 hover:text-cyan-300"
                      aria-label="Mostrar ou ocultar senha"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Confirmar nova senha"
            type={showPassword ? "text" : "password"}
            {...register("confirmaSenha")}
            error={Boolean(errors.confirmaSenha)}
            helperText={errors.confirmaSenha?.message}
            slotProps={slotProps}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        <>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Salvando..." : "Salvar alterações"}
        </>
      </button>
    </form>
  );
}
