"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InputAdornment, TextField } from "@mui/material";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { useAuth } from "../../context/useAuth";
import { API } from "../../services/api";

const loginSchema = z.object({
  email: z.string().trim().email("Digite um email válido"),
  senha: z.string().min(1, "Preenchimento obrigatório"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AuthForm() {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const setToken = useAuth((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      const response = await API.post<{ accessToken: string }>("/auth/login", data);
      setToken({ accessToken: response.data.accessToken });

      toast.success("Login realizado com sucesso!");
      router.push("/salas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg shadow-black/20 sm:p-7"
      noValidate
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-zinc-50">Entrar na conta</h2>
        <p className="text-sm text-zinc-400">
          Acesse seu painel de reservas e continue sua jornada.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <TextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          className="w-full"
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

        <TextField
          id="senha"
          label="Senha"
          type={senhaVisivel ? "text" : "password"}
          variant="outlined"
          {...register("senha")}
          error={!!errors.senha}
          helperText={errors.senha?.message}
          className="w-full"
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </button>

      <div className="text-center text-sm text-zinc-500">
        Ainda não tem conta?{' '}
        <Link href="/register" className="font-semibold text-cyan-400 transition hover:text-cyan-300">
          Criar conta
        </Link>
      </div>
    </form>
  );
}
