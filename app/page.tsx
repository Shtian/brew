import { getBrews } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const brews = await getBrews();

  return (
    <div className="min-h-screen bg-parchment">
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-bold text-ink">Brew</h1>
          <button
            type="button"
            className="rounded bg-accent px-4 py-2 font-body text-sm font-medium text-parchment hover:bg-accent-dark"
          >
            New Entry
          </button>
        </header>
        <hr className="mt-4 border-border" />
        <main className="mt-8">
          {brews.length === 0 ? (
            <p className="font-body text-ink-muted">No brews yet.</p>
          ) : (
            <table className="w-full font-body text-sm text-ink">
              <tbody>
                {brews.map((brew) => (
                  <tr key={brew.id}>
                    <td>{brew.bean_name}</td>
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
