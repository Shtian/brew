import { getBrews } from "@/lib/db";
import { ActivityTimeline } from "./ActivityTimeline";
import { DeleteBrewButton } from "./DeleteBrewButton";
import { EditBrewButton } from "./EditBrewButton";
import { LocalDate, LocalDateShort } from "./LocalDate";
import { NewEntryButton } from "./NewEntryButton";

export const dynamic = "force-dynamic";

function formatBrewTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default async function Home() {
  const brews = await getBrews();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-300 px-6 py-8">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-6xl font-bold text-heading tracking-wide">
            Brew
          </h1>
          <NewEntryButton />
        </header>
        <hr className="mt-4 border-border" />
        <main className="mt-8">
          <ActivityTimeline brews={brews} />
          {brews.length === 0 ? (
            <p className="font-body text-ink-muted">Ingen brygg ennå.</p>
          ) : (
            <>
              {/* Mobile card view */}
              <div className="flex flex-col gap-4 md:hidden">
                {brews.map((brew, index) => (
                  <div
                    key={brew.id}
                    className="overflow-hidden rounded-lg bg-parchment-dark"
                  >
                    {/* Card header: specimen label + bean name + actions */}
                    <div className="px-5 pb-4 pt-5">
                      <div className="flex items-start justify-between">
                        <p className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Eksemplar nr.{" "}
                          {String(brews.length - index).padStart(3, "0")}
                        </p>
                        <div className="-mr-1 ml-2 flex shrink-0 items-center gap-1">
                          <EditBrewButton
                            brew={brew}
                            buttonClassName="rounded p-1 text-ink opacity-50 hover:opacity-100"
                          />
                          <DeleteBrewButton
                            id={brew.id}
                            buttonClassName="rounded p-1 text-ink opacity-50 hover:opacity-100"
                          />
                        </div>
                      </div>
                      <h2 className="mt-1 font-display text-3xl font-bold text-ink">
                        {brew.bean_name}
                      </h2>
                    </div>

                    {/* Data rows */}
                    <div className="border-t border-white/10 px-5">
                      <div className="flex items-center justify-between border-b border-white/10 py-3">
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Malingsgrad
                        </span>
                        <span className="font-body text-sm font-bold text-ink">
                          {brew.grind_setting}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/10 py-3">
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Kaffevekt
                        </span>
                        <span className="font-body text-sm font-bold text-ink">
                          {brew.grams}g
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/10 py-3">
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Bryggingstid
                        </span>
                        <span className="font-body text-sm font-bold text-ink">
                          {formatBrewTime(brew.brew_time)}
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-between py-3 ${brew.comments ? "border-b border-white/10" : ""}`}
                      >
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Tidspunkt
                        </span>
                        <span className="font-body text-sm font-bold text-ink">
                          <LocalDateShort value={brew.created_at} />
                        </span>
                      </div>
                    </div>

                    {/* Observations */}
                    {brew.comments && (
                      <div className="brew-observations relative m-4 rounded-md bg-white/10 p-4">
                        <p className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Observasjoner
                        </p>
                        <p className="mt-2 font-display text-sm italic text-ink opacity-80">
                          &#8220;{brew.comments}&#8221;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop table view */}
              <table className="hidden w-full font-body text-sm text-ink md:table border rounded-md border-accent-dark/30">
                <thead>
                  <tr className="border-b border-border text-left bg-parchment-dark">
                    <th className="p-2 font-semibold">Bønnenavn</th>
                    <th className="p-2 font-semibold">Dose (g)</th>
                    <th className="p-2 font-semibold">Tid</th>
                    <th className="p-2 font-semibold">Malingsgrad</th>
                    <th className="p-2 font-semibold">Kommentarer</th>
                    <th className="p-2 font-semibold">Dato</th>
                    <th className="py-2 font-semibold">Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {brews.map((brew) => (
                    <tr
                      key={brew.id}
                      className="border-b border-accent-dark/30"
                    >
                      <td className="pl-2 py-2 pr-4 font-display font-bold text-ink">
                        {brew.bean_name}
                      </td>
                      <td className="pl-2 py-2 pr-4">{brew.grams}</td>
                      <td className="pl-2 py-2 pr-4">
                        {formatBrewTime(brew.brew_time)}
                      </td>
                      <td className="pl-2 py-2 pr-4">{brew.grind_setting}</td>
                      <td className="pl-2 py-2 pr-4">{brew.comments ?? ""}</td>
                      <td className="pl-2 py-2 pr-4">
                        <LocalDate value={brew.created_at} />
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-1">
                          <EditBrewButton brew={brew} />
                          <DeleteBrewButton id={brew.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
