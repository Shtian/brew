"use client";

import { useState } from "react";
import type { Brew } from "@/lib/db";
import { BrewDialog } from "./BrewDialog";

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
        aria-label="Edit brew"
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
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <BrewDialog open={open} onClose={() => setOpen(false)} brew={brew} />
    </>
  );
}
