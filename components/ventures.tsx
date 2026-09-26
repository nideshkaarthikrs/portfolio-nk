import { ventures } from "@/lib/projects";

export function Ventures() {
  return (
    <section id="ventures" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-3xl text-bone">Ventures</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {ventures.map((venture) => (
          <div
            key={venture.slug}
            className="rounded-xl border border-brass/30 p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-xl text-bone">{venture.name}</h3>
              <span className="text-sm text-brass">{venture.tag}</span>
            </div>
            <p className="mt-2 text-sm text-fog">{venture.role}</p>
            <p className="mt-3 max-w-[60ch] text-fog">{venture.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
