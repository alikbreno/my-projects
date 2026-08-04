"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InputAdornment, TextField } from "@mui/material";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import { FormUsuario, UsuarioSchema } from "../schemas/UsuarioSchema";
import { API } from "../services/api";
import {
  cleanMasksNumeralDocuments,
  maskCPF,
  maskPhone,
} from "../utils/MaskUtils";

export default function FormCadastro() {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [senhaVisivelConfirm, setSenhaVisivelConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { push } = useRouter();
  const setToken = useAuth((state) => state.setToken);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormUsuario>({
    resolver: zodResolver(UsuarioSchema),
    mode: "onBlur",
    defaultValues: {
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      senha: "",
      confirmaSenha: "",
    },
  });

  const enviarCadastro = async (data: FormUsuario) => {
    setIsPending(true);

    try {
      const response = await API.post<{ accessToken: string }>(
        "/auth/register",
        {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          cpf: cleanMasksNumeralDocuments(data.cpf),
          ...(data.telefone ? { telefone: data.telefone } : {}),
        },
      );

      setToken({ accessToken: response.data.accessToken });
      reset();
      toast.success("Cadastro realizado com sucesso!");
      push("/salas");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir o cadastro. Tente novamente.",
      );
    } finally {
      setIsPending(false);
    }
  };

  const inputClassName = "w-full";

  return (
    <form
      onSubmit={handleSubmit(enviarCadastro)}
      className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/20 sm:p-7"
      noValidate
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-zinc-50">Criar conta</h2>
        <p className="text-sm text-zinc-400">
          Preencha os dados abaixo para começar a reservar seus espaços.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField
            id="nome"
            label="Nome completo"
            variant="outlined"
            {...register("nome")}
            error={!!errors.nome}
            helperText={errors.nome?.message}
            className={inputClassName}
            slotProps={{
              inputLabel: {
                sx: {
                  color: "#a1a1aa",
                  "&.Mui-focused": { color: "#22d3ee" },
                },
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

        <div className="sm:col-span-2">
          <TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            className={inputClassName}
            slotProps={{
              inputLabel: {
                sx: {
                  color: "#a1a1aa",
                  "&.Mui-focused": { color: "#22d3ee" },
                },
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

        <div>
          <TextField
            id="cpf"
            label="CPF"
            variant="outlined"
            {...register("cpf", {
              onChange: (e) => (e.target.value = maskCPF(e.target.value)),
            })}
            error={!!errors.cpf}
            helperText={errors.cpf?.message}
            className={inputClassName}
            slotProps={{
              inputLabel: {
                sx: {
                  color: "#a1a1aa",
                  "&.Mui-focused": { color: "#22d3ee" },
                },
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

        <div>
          <TextField
            id="telefone"
            label="Telefone"
            variant="outlined"
            {...register("telefone", {
              onChange: (e) => (e.target.value = maskPhone(e.target.value)),
            })}
            error={!!errors.telefone}
            helperText={errors.telefone?.message}
            className={inputClassName}
            slotProps={{
              inputLabel: {
                sx: {
                  color: "#a1a1aa",
                  "&.Mui-focused": { color: "#22d3ee" },
                },
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

        <div>
          <TextField
            id="senha"
            label="Senha"
            type={senhaVisivel ? "text" : "password"}
            variant="outlined"
            {...register("senha")}
            error={!!errors.senha}
            helperText={errors.senha?.message}
            className={inputClassName}
            slotProps={{
              inputLabel: {
                sx: {
                  color: "#a1a1aa",
                  "&.Mui-focused": { color: "#22d3ee" },
                },
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
                endAdornment: (
                  <InputAdornment position="end">
                    {senhaVisivel ? (
                      <EyeOff
                        onClick={() => setSenhaVisivel(!senhaVisivel)}
                        className="cursor-pointer text-zinc-400 transition hover:text-cyan-400"
                      />
                    ) : (
                      <Eye
                        onClick={() => setSenhaVisivel(!senhaVisivel)}
                        className="cursor-pointer text-zinc-400 transition hover:text-cyan-400"
                      />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div>
          <TextField
            id="confirmaSenha"
            label="Confirmar senha"
            type={senhaVisivelConfirm ? "text" : "password"}
            variant="outlined"
            {...register("confirmaSenha")}
            error={!!errors.confirmaSenha}
            helperText={errors.confirmaSenha?.message}
            className={inputClassName}
            slotProps={{
              inputLabel: {
                sx: {
                  color: "#a1a1aa",
                  "&.Mui-focused": { color: "#22d3ee" },
                },
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
                endAdornment: (
                  <InputAdornment position="end">
                    {senhaVisivelConfirm ? (
                      <EyeOff
                        onClick={() =>
                          setSenhaVisivelConfirm(!senhaVisivelConfirm)
                        }
                        className="cursor-pointer text-zinc-400 transition hover:text-cyan-400"
                      />
                    ) : (
                      <Eye
                        onClick={() =>
                          setSenhaVisivelConfirm(!senhaVisivelConfirm)
                        }
                        className="cursor-pointer text-zinc-400 transition hover:text-cyan-400"
                      />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 cursor-pointer font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar conta"
        )}
      </button>
    </form>
  );
}
