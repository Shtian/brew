"use client";

import { useRef, useTransition } from "react";
import { deleteBrew } from "./actions";
import { Trash2 } from "lucide-react";

interface DeleteBrewButtonProps {
  id: string;
  buttonClassName?: string;
}

export function DeleteBrewButton({
  id,
  buttonClassName,
}: DeleteBrewButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleConfirm = () => {
    startTransition(async () => {
      await deleteBrew(id);
      closeDialog();
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeDialog();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={`rounded p-1 ${buttonClassName ?? "text-ink-muted hover:text-ink"}`}
        aria-label="Slett brygg"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeDialog();
        }}
        className="mx-auto my-auto w-[calc(100%-2rem)] max-w-sm rounded-lg bg-parchment p-0 shadow-xl backdrop:bg-black/60"
      >
        <div className="p-6">
          <h2 className="mb-2 font-display text-xl font-bold text-ink">
            Slett bryggoppføring
          </h2>
          <p className="mb-6 font-body text-sm text-ink-muted">
            Er du sikker på at du vil slette denne bryggoppføringen? Denne
            handlingen kan ikke angres.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeDialog}
              className="rounded border border-border px-4 py-2 font-body text-sm font-medium text-ink hover:bg-parchment-dark"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="rounded bg-red-700 px-4 py-2 font-body text-sm font-medium text-parchment hover:bg-red-800 disabled:opacity-50"
            >
              {isPending ? "Sletter…" : "Slett"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
