# Brew — Product Requirements Document

## Overview

**Brew** is a single-user web app for tracking pour over coffee brews. It records key parameters for each brew session and stores them in a sortable table, making it easy to look back at what worked and what didn't.

No authentication. No multi-user. Just a clean, fast tracker with a vintage botanical aesthetic.

---

## Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | First-class Vercel support, built-in API layer |
| Mutations | Server Actions | No separate API routes needed |
| Database | Vercel Postgres (Neon) | Provisioned from Vercel dashboard, env vars auto-injected, free tier sufficient |
| Styling | Tailwind CSS v4 | Utility-first, pairs well with Next.js |
| Hosting | Vercel | GitHub → auto-deploy on push to main |
| Fonts | Playfair Display (headings) + Inter (body) via `next/font/google` | Botanical editorial feel |

---

## Data Model

Table: `brews`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | |
| `bean_name` | TEXT | NOT NULL | Name of the coffee beans |
| `grams` | DECIMAL(5,1) | NOT NULL | Coffee dose in grams |
| `brew_time` | INTEGER | NOT NULL | Total brew duration in seconds |
| `grind_setting` | INTEGER | NOT NULL, 0–50 | Grinder setting |
| `comments` | TEXT | nullable | Free-text notes |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Auto-set on insert |

`brew_time` is stored as seconds and displayed as `mm:ss` in the UI.

---

## Features

### Table view
- All brews displayed in a table, sorted by `created_at` DESC (newest first)
- No pagination, filtering, or client-side sorting for v1
- Columns: Bean Name, Dose (g), Time, Grind, Comments, Date, Actions

### Create entry
- "New Entry" button in the page header
- Opens a centered modal dialog
- Fields: Bean Name, Dose (g), Brew Time (mm:ss), Grind Setting (0–50), Comments
- `created_at` is set automatically on insert — not user-editable

### Edit entry
- Pencil icon button per table row
- Opens the same modal dialog pre-populated with the row's values
- Saves via server action with the row's ID

### Delete entry
- Trash icon button per table row
- Shows an inline confirmation dialog before deleting
- No undo

---

## UI / Design

### Aesthetic
Vintage botanical / apothecary. Like an old herbalism manuscript — but readable. Light parchment background, dark forest green text and accents, aged paper texture.

### Color palette
| Token | Hex | Usage |
|---|---|---|
| Parchment | `#F2EBD3` | Page background |
| Parchment Dark | `#E5D9BC` | Table header, dialog background |
| Border | `#C2B089` | Dividers, input borders |
| Text | `#1C2B19` | Primary text (dark forest green) |
| Text Muted | `#4E6347` | Secondary text, labels |
| Accent | `#3D5C37` | Buttons, interactive elements |
| Accent Dark | `#2C4428` | Hover states |
| Danger | `#7D2828` | Delete button |

### Texture
Subtle grain overlay via CSS `::before` pseudo-element using an SVG `feTurbulence` noise filter at low opacity (~3–4%). Fixed position, pointer-events: none, z-index above content.

### Typography
- Page title: Playfair Display, large
- Table headers: Playfair Display or Inter semi-bold
- Body / table data: Inter
- Subtitle / metadata: Inter, muted color

### Layout
- Max width ~1200px, centered
- Header: app title left, "New Entry" button right
- Horizontal rule separator below header
- Table takes remaining space
- Empty state message when no brews exist

### Dialog
- Centered modal with dark backdrop (black/40)
- Close on: ESC key, backdrop click, or explicit close button
- Focus first input on open
- Two-column layout for Dose + Time fields, full-width for others

### Table actions
- Edit: pencil icon button (accent color)
- Delete: trash icon button (danger color)
- Both icons inline SVG, no icon library dependency

---

## Server Actions

| Action | Signature | Behavior |
|---|---|---|
| `createBrew` | `(formData: FormData) => Promise<void>` | Insert row, revalidate `/` |
| `updateBrew` | `(id: string, formData: FormData) => Promise<void>` | Update row by ID, revalidate `/` |
| `deleteBrew` | `(id: string) => Promise<void>` | Delete row by ID, revalidate `/` |

Brew time is parsed from `mm:ss` string to integer seconds in each action.

---

## File Structure

```
brew/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Server component — fetches brews, renders BrewClient
│   ├── actions.ts          # Server actions: create, update, delete
│   ├── globals.css         # Tailwind imports, theme tokens, grain texture
│   └── components/
│       └── BrewClient.tsx  # Client component — table, dialog, delete confirm
├── scripts/
│   └── migrate.sql         # One-time CREATE TABLE statement
├── .env.local.example      # Required env vars template
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Setup Steps (post-deploy)

1. Push repo to GitHub — Vercel auto-deploys on connect
2. In Vercel dashboard: Storage → Create → Postgres → connect to project
3. Vercel auto-injects `POSTGRES_URL` and related env vars
4. Run migration: paste `scripts/migrate.sql` into the Vercel Postgres SQL editor
5. Done — no other config needed

---

## Out of Scope (v1)

- Authentication / multi-user
- Filtering or searching brews
- Sorting by column
- Pagination
- Brew recipe calculator
- Export (CSV, PDF)
- Charts / analytics
- Mobile app
