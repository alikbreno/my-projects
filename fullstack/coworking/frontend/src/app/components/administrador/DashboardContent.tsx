"use client";

import {
  Building2,
  CalendarDays,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/useAuth";
import { API } from "../../services/api";
import { DecodeToken } from "../../utils/DecodeToken";
import AppPageSkeleton from "../ui/AppPageSkeleton";

type DashboardData = { salas: number; usuarios: number; reservas: number };

export default function DashboardContent() {
  const [hydrated, setHydrated] = useState(false);
  const token = useAuth((state) => state.auth?.accessToken);
  const isAdmin = useMemo(
    () => Boolean(token && DecodeToken(token)?.eAdmin),
    [token],
  );
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    enabled: hydrated && isAdmin,
    queryFn: async (): Promise<DashboardData> => {
      const [salas, usuarios, reservas] = await Promise.all([
        API.get<{ total: number }>("/salas", { params: { limit: 1 } }),
        API.get<{ total: number }>("/usuarios", { params: { limit: 1 } }),
        API.get<{ total: number }>("/reservas", { params: { limit: 1 } }),
      ]);
      return {
        salas: salas.data.total,
        usuarios: usuarios.data.total,
        reservas: reservas.data.total,
      };
    },
  });
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHydrated(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  if (!hydrated || (isAdmin && isLoading))
    return <AppPageSkeleton variant="dashboard" />;
  if (!isAdmin)
    return (
      <main className="min-h-screen bg-zinc-950 p-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/25 bg-red-400/5 p-8 text-center">
          <ShieldCheck className="mx-auto h-7 w-7 text-red-300" />
          <h1 className="mt-3 text-xl font-semibold text-zinc-100">
            Acesso restrito
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Este dashboard é exclusivo para administradores.
          </p>
        </div>
      </main>
    );
  const metrics = [
    {
      label: "Salas ativas",
      value: data?.salas ?? 0,
      icon: Building2,
      href: "/administrador/gestao-salas",
    },
    {
      label: "Usuários",
      value: data?.usuarios ?? 0,
      icon: Users,
      href: "/administrador/gestao-usuarios",
    },
    {
      label: "Reservas",
      value: data?.reservas ?? 0,
      icon: CalendarDays,
      href: "/minhas-reservas",
    },
  ];
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),linear-gradient(135deg,#0f0f11_0%,#131316_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-4xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Administração
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-50 sm:text-4xl">
            Visão geral
          </h1>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            Acompanhe os principais indicadores do coworking e acesse as áreas
            de gestão.
          </p>
        </section>
        <section className="grid gap-5 md:grid-cols-3">
          {metrics.map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="group rounded-3xl border border-zinc-800 bg-zinc-900/75 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <Icon className="h-5 w-5 text-cyan-400" />
              <p className="mt-5 text-3xl font-semibold text-zinc-50">
                {value}
              </p>
              <p className="mt-1 text-sm text-zinc-400">{label}</p>
              <p className="mt-4 text-sm font-semibold text-cyan-300">
                Gerenciar{" "}
                <span className="inline-block transition group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          ))}
        </section>
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/75 p-6">
          <h2 className="text-xl font-semibold text-zinc-100">
            Atalhos rápidos
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/administrador/gestao-salas"
              className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
            >
              Gerir salas
            </Link>
            <Link
              href="/administrador/gestao-usuarios"
              className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
            >
              Gerir usuários
            </Link>
            <Link
              href="/minhas-reservas"
              className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
            >
              Ver reservas
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
