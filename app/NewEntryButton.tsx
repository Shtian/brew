"use client";

import { useState } from "react";
import { BrewDialog } from "./BrewDialog";

export function NewEntryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 md:static rounded bg-accent px-4 py-2 font-body text-sm font-medium text-parchment hover:bg-accent-dark"
      >
        Ny oppføring
      </button>
      <BrewDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
