import Image from "next/image";
import { fanCards } from "@/components/hero-card-fan/fan-cards";

export function StaticFan() {
  return (
    <div
      role="img"
      aria-label={`A fanned spread of cards around a portrait: ${fanCards
        .filter((card) => card.kind === "role")
        .map((card) => card.label)
        .join(", ")}`}
      className="flex h-full w-full items-center justify-center"
    >
      {fanCards.map((card, index) => {
        const mid = (fanCards.length - 1) / 2;
        const t = index - mid;
        const isPhoto = card.kind === "photo";
        return (
          <div
            key={card.key}
            style={{
              transform: `rotate(${t * 9}deg) translateY(${Math.abs(t) * 12}px)`,
              marginLeft: index === 0 ? 0 : "-1.75rem",
              zIndex: isPhoto ? 10 : 5 - Math.abs(t),
            }}
            className={`relative flex h-48 w-32 shrink-0 flex-col overflow-hidden rounded-lg border bg-deep p-3 ${
              isPhoto ? "border-signal" : "border-signal/50"
            }`}
          >
            {isPhoto ? (
              <Image src="/images/hero-portrait.jpg" alt="" fill sizes="128px" loading="eager" className="object-cover" />
            ) : (
              <>
                <span
                  className={`font-mono text-[10px] tracking-[0.15em] text-signal ${t > 0 ? "text-right" : ""}`}
                >
                  {`// ${card.index}`}
                </span>
                {/* Neighbouring cards cover the inner edge, so the word leans outward. */}
                <span
                  className={`flex flex-1 items-center font-display text-lg leading-tight text-bone ${
                    t < 0 ? "justify-start pr-6 text-left" : "justify-end pl-6 text-right"
                  }`}
                >
                  {card.label}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
