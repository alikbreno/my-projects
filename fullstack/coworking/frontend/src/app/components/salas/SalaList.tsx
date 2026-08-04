"use client";

import { Component, ReactNode, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import SalaFallback from "./SalaFallback";
import SalasGrid from "./SalaGrid";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean; message: string };

class SalasErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as salas.",
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-3xl border border-red-400/25 bg-red-400/5 p-8 text-center">
          <AlertCircle className="mx-auto h-7 w-7 text-red-300" />
          <h2 className="mt-3 font-semibold text-zinc-100">
            Não foi possível carregar as salas
          </h2>
          <p className="mt-2 text-sm text-zinc-400">{this.state.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-cyan-400/40"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function SalaList() {
  const [isHydrated, setIsHydrated] = useState(false);

  // A sessão é persistida pelo Zustand no navegador. A query autenticada não
  // deve rodar no SSR, onde esse estado ainda não está disponível ao Axios.
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setIsHydrated(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  if (!isHydrated) return <SalaFallback />;

  return (
    <SalasErrorBoundary>
      <SalasGrid />
    </SalasErrorBoundary>
  );
}
