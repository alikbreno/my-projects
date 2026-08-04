"use client";

import { AlertTriangle, Loader2, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import ModalBase from "./ModalBase";

type ConfirmationAction = "delete" | "update";

type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: ConfirmationAction;
  entityName: string;
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
};

const actionContent = {
  delete: {
    title: "Excluir",
    description: "Esta ação não poderá ser desfeita.",
    buttonLabel: "Excluir",
    icon: Trash2,
  },
  update: {
    title: "Atualizar",
    description: "Confirme para salvar as alterações realizadas.",
    buttonLabel: "Atualizar",
    icon: Save,
  },
};

export default function ConfirmationModal({
  open,
  onOpenChange,
  action,
  entityName,
  onConfirm,
  confirmLabel,
}: ConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const content = actionContent[action];
  const ActionIcon = content.icon;
  const isDelete = action === "delete";

  async function handleConfirm() {
    setIsConfirming(true);
    setErrorMessage(null);

    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir esta ação.",
      );
    } finally {
      setIsConfirming(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!isConfirming) onOpenChange(nextOpen);
  }

  return (
    <ModalBase
      openModal={open}
      setOpenModal={handleOpenChange}
      viewCloseButton={!isConfirming}
      titleTooltip="Fechar confirmação"
      className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-0 text-zinc-100"
    >
      <div className="p-6 sm:p-7">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDelete ? "bg-red-400/10 text-red-300" : "bg-cyan-400/10 text-cyan-300"}`}
        >
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">
          {content.title} {entityName}?
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {content.description}
        </p>
        {errorMessage && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-200"
          >
            {errorMessage}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isConfirming}
            onClick={() => handleOpenChange(false)}
            className="cursor-pointer rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-60"
          >
            Voltar
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={handleConfirm}
            className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${isDelete ? "bg-red-400 text-zinc-950 hover:bg-red-300" : "bg-cyan-400 text-zinc-950 hover:bg-cyan-300"}`}
          >
            {isConfirming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <ActionIcon className="h-4 w-4 cursor-pointer" />
                {confirmLabel ?? content.buttonLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
