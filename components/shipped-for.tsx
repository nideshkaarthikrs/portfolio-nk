import { shippedFor } from "@/lib/projects";

const REPEATS = 3;

function MarqueeHalf({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden}
      className={`flex shrink-0 items-center gap-x-12 pr-12 ${hidden ? "motion-reduce:hidden" : ""}`}
    >
      {Array.from({ length: REPEATS }).flatMap((_, r) =>
        shippedFor.map((name) => (
          <li
            key={`${r}-${name}`}
            aria-hidden={r > 0 ? true : undefined}
            className={`flex items-center gap-12 whitespace-nowrap font-display text-lg text-fog transition-colors hover:text-bone ${
              r > 0 ? "motion-reduce:hidden" : ""
            }`}
          >
            {name}
            <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-signal/60" />
          </li>
        )),
      )}
    </ul>
  );
}

export function ShippedFor() {
  return (
    <section className="border-y border-white/5 bg-deep/40">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-8">
        <p className="shrink-0 font-mono text-xs tracking-[0.2em] text-signal">SHIPPED FOR</p>
        <div className="marquee-mask min-w-0 flex-1 overflow-hidden">
          <div className="marquee-track flex w-max">
            <MarqueeHalf />
            <MarqueeHalf hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
