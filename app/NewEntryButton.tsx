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
        className="rounded bg-accent px-4 py-2 font-body text-sm font-medium text-parchment hover:bg-accent-dark"
      >
        New Entry
      </button>
      <BrewDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
