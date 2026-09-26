import Image from "next/image";
import Link from "next/link";
import { PlaceholderVisual } from "@/components/placeholder-visual";
import { clientProjects } from "@/lib/projects";

export function ClientWork() {
  return (
    <section id="client-work" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-3xl text-bone">Client work</h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {clientProjects.map((client) => (
          <div key={client.slug} className="flex flex-col gap-4">
            {client.screenshot ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={client.screenshot}
                  alt={`Screenshot of the ${client.name} homepage`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            ) : (
              <PlaceholderVisual
                label={`${client.name} — screenshot coming soon`}
                className="aspect-[4/3] w-full"
              />
            )}
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-xl text-bone">{client.name}</h3>
              <p className="text-sm text-fog">{client.summary}</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <Link
                href={client.siteUrl}
                className="text-sm text-signal transition-opacity hover:opacity-80"
              >
                Visit {client.siteLabel ?? "site"} →
              </Link>
              {client.additionalSites?.map((site) => (
                <Link
                  key={site.url}
                  href={site.url}
                  className="text-sm text-signal transition-opacity hover:opacity-80"
                >
                  Visit {site.label} →
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
