"use client";

import { useActionState, useEffect, useRef } from "react";
import { createBrew } from "./actions";

interface BrewDialogProps {
  open: boolean;
  onClose: () => void;
}

export function BrewDialog({ open, onClose }: BrewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [, action, pending] = useActionState(
    async (_prevState: null, formData: FormData) => {
      await createBrew(formData);
      return null;
    },
    null,
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Close dialog and reset form after successful submission (pending goes false)
  const prevPendingRef = useRef(false);
  useEffect(() => {
    if (prevPendingRef.current && !pending) {
      formRef.current?.reset();
      onClose();
    }
    prevPendingRef.current = pending;
  }, [pending, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
      className="m-auto w-full max-w-lg rounded-lg bg-parchment p-0 shadow-xl backdrop:bg-ink/40"
    >
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">
            New Brew Entry
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 font-body text-ink-muted hover:text-ink"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form ref={formRef} action={action} className="space-y-4">
          <div>
            <label
              htmlFor="bean_name"
              className="mb-1 block font-body text-sm font-medium text-ink"
            >
              Bean Name
            </label>
            <input
              id="bean_name"
              name="bean_name"
              type="text"
              className="w-full rounded border border-border bg-parchment px-3 py-2 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="dose"
              className="mb-1 block font-body text-sm font-medium text-ink"
            >
              Dose (g)
            </label>
            <input
              id="dose"
              name="dose"
              type="number"
              className="w-full rounded border border-border bg-parchment px-3 py-2 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="brew_time"
              className="mb-1 block font-body text-sm font-medium text-ink"
            >
              Brew Time
            </label>
            <input
              id="brew_time"
              name="brew_time"
              type="text"
              placeholder="mm:ss"
              className="w-full rounded border border-border bg-parchment px-3 py-2 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="grind_setting"
              className="mb-1 block font-body text-sm font-medium text-ink"
            >
              Grind Setting
            </label>
            <input
              id="grind_setting"
              name="grind_setting"
              type="number"
              min={0}
              max={50}
              className="w-full rounded border border-border bg-parchment px-3 py-2 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label
              htmlFor="comments"
              className="mb-1 block font-body text-sm font-medium text-ink"
            >
              Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={3}
              className="w-full rounded border border-border bg-parchment px-3 py-2 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-border px-4 py-2 font-body text-sm font-medium text-ink hover:bg-parchment-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-accent px-4 py-2 font-body text-sm font-medium text-parchment hover:bg-accent-dark disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
