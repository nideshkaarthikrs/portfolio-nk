import { InteractiveCard } from "@/components/interactive-card";
import { ScrambleHeading } from "@/components/scramble-heading";

const staticItems = [
  {
    title: "Cricket",
    description: "Opening batsman. Played in the college league, reached the playoffs.",
  },
  {
    title: "Drums",
    description: "Played drums for a few years before code took over.",
  },
];

export function BeyondCode() {
  return (
    <section id="beyond-code" className="mx-auto max-w-6xl px-6 py-24">
      <ScrambleHeading index="06" text="Beyond code" />
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="group h-40 [perspective:1000px]">
          <div className="relative h-full w-full rounded-lg transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            <div className="absolute inset-0 flex flex-col justify-between rounded-lg border border-white/10 p-6 [backface-visibility:hidden]">
              <h3 className="font-display text-lg text-bone">Card magic</h3>
              <p className="text-sm text-fog">Hover the card.</p>
            </div>
            <div className="glass-panel absolute inset-0 flex flex-col justify-between rounded-lg border border-brass/40 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <h3 className="font-display text-lg text-bone">The reveal</h3>
              <p className="text-sm text-fog">Ask me to show you a trick sometime.</p>
            </div>
          </div>
        </div>
        {staticItems.map((item) => (
          <InteractiveCard
            key={item.title}
            className="flex h-40 flex-col justify-between rounded-lg border border-white/10 bg-deep/60 p-6"
          >
            <h3 className="font-display text-lg text-bone">{item.title}</h3>
            <p className="text-sm text-fog">{item.description}</p>
          </InteractiveCard>
        ))}
      </div>
    </section>
  );
}
