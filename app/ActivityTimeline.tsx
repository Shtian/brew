"use client";

import type { Brew } from "@/lib/db";
import Image from "next/image";

type DayEntry = { date: Date; count: number };

const LEVELS = [
  "rgba(217,199,167,0.06)",
  "rgba(108,123,80,0.35)",
  "rgba(108,123,80,0.60)",
  "rgba(108,123,80,0.85)",
  "rgba(140,160,100,1)",
] as const;

function levelFor(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

function buildHistory(brews: Brew[]): DayEntry[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = 196;

  const map = new Map<string, number>();
  for (const brew of brews) {
    const d = new Date(brew.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    map.set(key, (map.get(key) || 0) + 1);
  }

  const out: DayEntry[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    out.push({ date: d, count: map.get(key) || 0 });
  }
  return out;
}

function fmtShort(d: Date) {
  return new Intl.DateTimeFormat("nb-no", {
    day: "numeric",
    month: "short",
  }).format(d);
}

function fmtLong(d: Date) {
  return new Intl.DateTimeFormat("nb-no", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

function computeStats(history: DayEntry[]) {
  const total = history.reduce((s, c) => s + c.count, 0);
  const days = history.filter((c) => c.count > 0).length;
  const weeks = Math.max(1, history.length / 7);
  const avg = (total / weeks).toFixed(1);
  return { total, days, avg };
}

// ——— Desktop heatmap ———

const CELL = 11;
const GAP = 3;
const COL_W = CELL + GAP;
const DAY_LABELS = ["", "tir", "", "tor", "", "lør", ""];

function HeatmapDesktop({ history }: { history: DayEntry[] }) {
  if (!history.length) return null;

  const startPad = history[0].date.getDay();
  const cells: (DayEntry | null)[] = [...Array(startPad).fill(null), ...history];
  const cols: (DayEntry | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));

  const { total, days, avg } = computeStats(history);

  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  cols.forEach((col, ci) => {
    const real = col.find((c) => c);
    if (!real) return;
    const m = real.date.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({
        col: ci,
        label: new Intl.DateTimeFormat("nb-no", { month: "short" })
          .format(real.date)
          .replace(".", ""),
      });
      lastMonth = m;
    }
  });

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Header */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-body)",
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: "rgba(108,123,80,0.95)",
              marginBottom: 4,
            }}
          >
            Brygglogg · Aktivitet
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "0.01em",
            }}
          >
            {total} brygginger på {Math.round(history.length / 7)} uker
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 13,
              color: "rgba(217,199,167,0.6)",
            }}
          >
            {fmtLong(history[0].date)} — {fmtLong(history[history.length - 1].date)}
          </p>
        </div>

        <div className="flex items-center gap-5 shrink-0">
          <div className="flex flex-col items-end">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1,
                color: "var(--ink)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {total}
            </span>
            <span
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "rgba(217,199,167,0.5)",
                marginTop: 5,
              }}
            >
              Brygginger
            </span>
          </div>
          <div style={{ width: 1, height: 30, background: "rgba(74,69,64,0.7)" }} />
          <div className="flex flex-col items-end">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1,
                color: "var(--ink)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {days}
            </span>
            <span
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "rgba(217,199,167,0.5)",
                marginTop: 5,
              }}
            >
              Aktive dager
            </span>
          </div>
          <div style={{ width: 1, height: 30, background: "rgba(74,69,64,0.7)" }} />
          <div className="flex flex-col items-end">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1,
                color: "var(--ink)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {avg}
            </span>
            <span
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "rgba(217,199,167,0.5)",
                marginTop: 5,
              }}
            >
              Snitt / uke
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ position: "relative" }}>
        {/* Month axis */}
        <div style={{ position: "relative", height: 14, marginBottom: 4, paddingLeft: 28 }}>
          {monthLabels.map((m) => (
            <span
              key={m.col}
              style={{
                position: "absolute",
                left: 28 + m.col * COL_W,
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(217,199,167,0.5)",
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: GAP, alignItems: "flex-start" }}>
          {/* Day labels */}
          <div
            style={{
              width: 28,
              display: "flex",
              flexDirection: "column",
              gap: GAP,
            }}
          >
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                style={{
                  height: CELL,
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 10,
                  lineHeight: `${CELL}px`,
                  color: "rgba(217,199,167,0.45)",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Squares */}
          <div style={{ display: "flex", gap: GAP }}>
            {cols.map((col, ci) => (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                {Array.from({ length: 7 }).map((_, ri) => {
                  const cell = col[ri] ?? null;
                  if (!cell) return <div key={ri} style={{ width: CELL, height: CELL }} />;
                  const lvl = levelFor(cell.count);
                  return (
                    <div
                      key={ri}
                      title={`${fmtLong(cell.date)} — ${cell.count} brygg`}
                      style={{
                        width: CELL,
                        height: CELL,
                        background: LEVELS[lvl],
                        border:
                          lvl === 0
                            ? "1px solid rgba(217,199,167,0.1)"
                            : "1px solid rgba(38,35,31,0.5)",
                        borderRadius: 1.5,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ——— Mobile heatmap ———

const MOBILE_WEEKS = 12;
const DOW_LABELS = ["S", "M", "T", "O", "T", "F", "L"];

function HeatmapMobile({ history }: { history: DayEntry[] }) {
  if (!history.length) return null;

  const tail = history.slice(-MOBILE_WEEKS * 7);
  const startPad = tail[0].date.getDay();
  const padded: (DayEntry | null)[] = [...Array(startPad).fill(null), ...tail];
  while (padded.length % 7 !== 0) padded.push(null);

  const rows: (DayEntry | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) rows.push(padded.slice(i, i + 7));
  rows.reverse();

  const rowLabels = rows.map((row) => {
    const real = row.find((c) => c);
    return real ? fmtShort(real.date) : "";
  });

  const { total, days, avg } = computeStats(history);

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "56px repeat(7, 1fr)",
    gap: 4,
    alignItems: "center",
  };

  return (
    <div className="flex flex-col gap-[14px]">
      {/* Header */}
      <div>
        <p
          style={{
            margin: "0 0 2px",
            fontFamily: "var(--font-body)",
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.28em",
            color: "rgba(108,123,80,0.95)",
          }}
        >
          Brygglogg · Aktivitet
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--ink)",
            letterSpacing: "0.01em",
          }}
        >
          {total} brygginger
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 11,
            color: "rgba(217,199,167,0.55)",
          }}
        >
          siste {MOBILE_WEEKS} uker · {fmtShort(tail[0]?.date ?? history[0].date)} —{" "}
          {fmtShort(history[history.length - 1].date)}
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderTop: "1px solid rgba(74,69,64,0.6)",
          borderBottom: "1px solid rgba(74,69,64,0.6)",
          padding: "10px 0",
        }}
      >
        {[
          { num: total, label: "Brygginger" },
          { num: days, label: "Aktive dager" },
          { num: avg, label: "Snitt / uke" },
        ].map(({ num, label }, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              position: "relative",
              ...(i > 0
                ? {
                    borderLeft: "1px solid rgba(74,69,64,0.7)",
                  }
                : {}),
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1,
                color: "var(--ink)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {num}
            </span>
            <span
              style={{
                fontSize: 8,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(217,199,167,0.5)",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Day axis */}
        <div style={gridStyle}>
          <span />
          {DOW_LABELS.map((d, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 9,
                textAlign: "center",
                color: "rgba(217,199,167,0.4)",
                letterSpacing: "0.08em",
              }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Week rows */}
        {rows.map((row, ri) => (
          <div key={ri} style={gridStyle}>
            <span
              style={{
                fontSize: 9,
                fontStyle: "italic",
                fontFamily: "var(--font-display)",
                color: "rgba(217,199,167,0.45)",
                textAlign: "right",
                paddingRight: 4,
              }}
            >
              {rowLabels[ri]}
            </span>
            {row.map((cell, ci) => {
              if (!cell) {
                return (
                  <div
                    key={ci}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 2,
                      background: "rgba(217,199,167,0.04)",
                      border: "1px solid rgba(217,199,167,0.08)",
                    }}
                  />
                );
              }
              const lvl = levelFor(cell.count);
              return (
                <div
                  key={ci}
                  title={`${fmtShort(cell.date)} — ${cell.count} brygg`}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 2,
                    background: LEVELS[lvl],
                    border:
                      lvl === 0
                        ? "1px solid rgba(217,199,167,0.1)"
                        : "1px solid rgba(38,35,31,0.5)",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ——— Public component ———

export function ActivityTimeline({ brews }: { brews: Brew[] }) {
  const history = buildHistory(brews);

  return (
    <div
      style={{
        background: "var(--parchment-dark)",
        border: "1px solid rgba(74,69,64,0.6)",
        borderRadius: 6,
        position: "relative",
        overflow: "hidden",
        marginBottom: 32,
      }}
    >
      {/* Ornament */}
      <Image
        src="/botanical-elements/sparkle.svg"
        alt=""
        width={70}
        height={70}
        aria-hidden
        style={{
          position: "absolute",
          right: 12,
          top: 14,
          opacity: 0.07,
          filter:
            "brightness(0) saturate(100%) invert(86%) sepia(13%) saturate(540%) hue-rotate(355deg) brightness(95%) contrast(88%)",
          pointerEvents: "none",
        }}
      />

      {/* Desktop */}
      <div
        className="hidden md:block"
        style={{ padding: "24px 28px 26px" }}
      >
        <HeatmapDesktop history={history} />
      </div>

      {/* Mobile */}
      <div
        className="block md:hidden"
        style={{ padding: "16px 14px 18px" }}
      >
        <HeatmapMobile history={history} />
      </div>
    </div>
  );
}
