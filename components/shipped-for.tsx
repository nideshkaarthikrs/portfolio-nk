import { shippedFor } from "@/lib/projects";

export function ShippedFor() {
  return (
    <section className="border-y border-white/5 bg-deep/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-4 px-6 py-8">
        <p className="text-sm text-fog">Shipped for</p>
        <ul className="flex flex-wrap gap-x-10 gap-y-3">
          {shippedFor.map((name) => (
            <li key={name} className="font-display text-base text-fog">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
