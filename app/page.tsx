import { getBrews } from "@/lib/db";
import { DeleteBrewButton } from "./DeleteBrewButton";
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

function formatDateShort(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
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
          <h1 className="font-display text-4xl font-bold text-heading">Brew</h1>
          <NewEntryButton />
        </header>
        <hr className="mt-4 border-border" />
        <main className="mt-8">
          {brews.length === 0 ? (
            <p className="font-body text-ink-muted">No brews yet.</p>
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
                          Specimen No.{" "}
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
                          Grind Setting
                        </span>
                        <span className="font-body text-sm font-bold text-ink">
                          {brew.grind_setting}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/10 py-3">
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Coffee Weight
                        </span>
                        <span className="font-body text-sm font-bold text-ink">
                          {brew.grams}g
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/10 py-3">
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Brew Time
                        </span>
                        <span className="font-body text-sm font-bold text-ink">
                          {formatBrewTime(brew.brew_time)}
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-between py-3 ${brew.comments ? "border-b border-white/10" : ""}`}
                      >
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Date & Time
                        </span>
                        <span className="font-body text-sm font-bold text-ink">
                          {formatDateShort(brew.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Observations */}
                    {brew.comments && (
                      <div className="brew-observations relative m-4 rounded-md bg-white/10 p-4">
                        <p className="font-body text-xs font-bold uppercase tracking-widest text-ink opacity-50">
                          Observations
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
              <table className="hidden w-full font-body text-sm text-ink md:table">
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
                      <td className="py-2 pr-4">
                        {formatDate(brew.created_at)}
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
