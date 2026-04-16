"use client";

import { useState } from "react";
import type { Brew } from "@/lib/db";
import { BrewDialog } from "./BrewDialog";
import { Pencil } from "lucide-react";

interface EditBrewButtonProps {
  brew: Brew;
  buttonClassName?: string;
}

export function EditBrewButton({ brew, buttonClassName }: EditBrewButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`rounded p-1 ${buttonClassName ?? "text-ink-muted hover:text-ink"}`}
        aria-label="Rediger brygg"
      >
        <Pencil size={16} aria-hidden="true" />
      </button>
      <BrewDialog open={open} onClose={() => setOpen(false)} brew={brew} />
    </>
  );
}
