"use client";

import { useState } from "react";
import { BrewDialog } from "./BrewDialog";
import { Plus } from "lucide-react";

export function NewEntryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 md:static inline-flex items-center gap-2 rounded bg-accent px-4 py-2 font-body text-sm font-medium text-parchment hover:bg-accent-dark"
      >
        <Plus size={16} aria-hidden="true" />
        Ny oppføring
      </button>
      <BrewDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
