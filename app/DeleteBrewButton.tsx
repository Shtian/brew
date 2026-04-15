"use client";

import { useRef, useTransition } from "react";
import { deleteBrew } from "./actions";

interface DeleteBrewButtonProps {
  id: string;
}

export function DeleteBrewButton({ id }: DeleteBrewButtonProps) {
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
        className="rounded p-1 text-ink-muted hover:text-ink"
        aria-label="Delete brew"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeDialog();
        }}
        className="m-auto w-full max-w-sm rounded-lg bg-parchment p-0 shadow-xl backdrop:bg-ink/40"
      >
        <div className="p-6">
          <h2 className="mb-2 font-display text-xl font-bold text-ink">
            Delete Brew Entry
          </h2>
          <p className="mb-6 font-body text-sm text-ink-muted">
            Are you sure you want to delete this brew entry? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeDialog}
              className="rounded border border-border px-4 py-2 font-body text-sm font-medium text-ink hover:bg-parchment-dark"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="rounded bg-red-700 px-4 py-2 font-body text-sm font-medium text-parchment hover:bg-red-800 disabled:opacity-50"
            >
              {isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
