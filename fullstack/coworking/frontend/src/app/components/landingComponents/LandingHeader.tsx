"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Produto", href: "#produto" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Números", href: "#numeros" },
];

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-2 font-display font-bold text-lg text-zinc-50 tracking-tight"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          <span>
            COWORKING<span className="text-cyan-400">app</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden md:inline-flex items-center justify-center rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 hover:-translate-y-0.5 transition-all"
          >
            Começar agora
          </Link>
          <button
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden flex-col gap-1 px-6 pb-4 border-t border-zinc-800 bg-zinc-950 ${
          mobileOpen ? "flex" : "hidden"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="px-2 py-2.5 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 transition-colors"
          >
            {link.label}
          </a>
        ))}
        <Link
          href="/sign-in"
          className="px-2 py-2.5 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 transition-colors"
        >
          Entrar
        </Link>
      </div>
    </nav>
  );
}