"use client";

import { CalendarCheck2, DoorOpen, LayoutDashboard, Menu, ShieldCheck, Users, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useUsuario } from "../services/hooks/useUsuarios";
import { DecodeToken } from "../utils/DecodeToken";
import LogoutButton from "./LogoutButton";
import Avatar from "./UserAvatar";

const userLinks = [{ label: "Salas", href: "/salas", icon: DoorOpen }, { label: "Minhas reservas", href: "/minhas-reservas", icon: CalendarCheck2 }];
const adminLinks = [{ label: "Dashboard", href: "/administrador", icon: LayoutDashboard }, { label: "Salas", href: "/administrador/gestao-salas", icon: ShieldCheck }, { label: "Usuários", href: "/administrador/gestao-usuarios", icon: Users }];

function NavigationLinks({ links, mobile, onNavigate }: { links: typeof userLinks; mobile?: boolean; onNavigate?: () => void }) {
  return <>{links.map(({ label, href, icon: Icon }) => <Link key={href} href={href} onClick={onNavigate} className={mobile ? "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50" : "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:text-zinc-50"}><Icon size={mobile ? 18 : 17} className="text-cyan-400" /><span>{label}</span>{!mobile && <span className="absolute bottom-1 left-3 right-3 h-px scale-x-0 bg-cyan-400 transition-transform group-hover:scale-x-100" />}</Link>)}</>;
}

export default function CoworkingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = useAuth((state) => state.auth?.accessToken);
  const payload = useMemo(() => token ? DecodeToken(token) : null, [token]);
  const { data: usuario } = useUsuario(payload?.sub ?? null);
  const isAdmin = payload?.eAdmin ?? false;
  const userName = usuario?.nome ?? "Usuário";

  return <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href="/salas" className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-100"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" /></span>COWORKING<span className="text-cyan-400">app</span></Link><nav className="hidden items-center gap-1 xl:flex"><div className="flex items-center gap-1"><span className="mr-1 hidden text-[10px] font-semibold uppercase tracking-widest text-zinc-600 2xl:inline">Área do usuário</span><NavigationLinks links={userLinks} /></div>{isAdmin && <><div className="mx-2 h-6 w-px bg-zinc-700" /><div className="flex items-center gap-1 rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-1"><span className="hidden px-2 text-[10px] font-semibold uppercase tracking-widest text-cyan-400 2xl:inline">Admin</span><NavigationLinks links={adminLinks} /></div></>}<div className="mx-2 h-6 w-px bg-zinc-700" /><Link href="/minha-conta" className="rounded-full"><Avatar name={userName} /></Link><LogoutButton /></nav><button className="cursor-pointer rounded-lg p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50 xl:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Abrir menu" aria-expanded={mobileOpen}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button></div><div className={`overflow-hidden border-t border-zinc-800 bg-zinc-900/95 transition-all duration-300 xl:hidden ${mobileOpen ? "max-h-112 opacity-100" : "max-h-0 opacity-0"}`}><nav className="space-y-3 px-4 py-3"><div><p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Área do usuário</p><NavigationLinks links={userLinks} mobile onNavigate={() => setMobileOpen(false)} /></div>{isAdmin && <div className="border-t border-zinc-800 pt-3"><p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-400">Administração</p><NavigationLinks links={adminLinks} mobile onNavigate={() => setMobileOpen(false)} /></div>}<div className="border-t border-zinc-800 pt-3"><Link href="/minha-conta" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50" onClick={() => setMobileOpen(false)}><Avatar name={userName} size={24} />Meu perfil</Link><LogoutButton mobile /></div></nav></div></header>;
}
