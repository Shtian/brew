import { getBrews } from "@/lib/db";
import { EditBrewButton } from "./EditBrewButton";
import { NewEntryButton } from "./NewEntryButton";

export const dynamic = "force-dynamic";

function formatBrewTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default async function Home() {
  const brews = await getBrews();

  return (
    <div className="min-h-screen bg-parchment">
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-bold text-ink">Brew</h1>
          <NewEntryButton />
        </header>
        <hr className="mt-4 border-border" />
        <main className="mt-8">
          {brews.length === 0 ? (
            <p className="font-body text-ink-muted">No brews yet.</p>
          ) : (
            <table className="w-full font-body text-sm text-ink">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 font-semibold">Bean Name</th>
                  <th className="pb-2 pr-4 font-semibold">Dose (g)</th>
                  <th className="pb-2 pr-4 font-semibold">Time</th>
                  <th className="pb-2 pr-4 font-semibold">Grind</th>
                  <th className="pb-2 pr-4 font-semibold">Comments</th>
                  <th className="pb-2 pr-4 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brews.map((brew) => (
                  <tr key={brew.id} className="border-b border-border">
                    <td className="py-2 pr-4">{brew.bean_name}</td>
                    <td className="py-2 pr-4">{brew.grams}</td>
                    <td className="py-2 pr-4">
                      {formatBrewTime(brew.brew_time)}
                    </td>
                    <td className="py-2 pr-4">{brew.grind_setting}</td>
                    <td className="py-2 pr-4">{brew.comments ?? ""}</td>
                    <td className="py-2 pr-4">{formatDate(brew.created_at)}</td>
                    <td className="py-2">
                      <EditBrewButton brew={brew} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
