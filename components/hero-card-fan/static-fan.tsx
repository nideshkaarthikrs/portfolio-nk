import Image from "next/image";
import { fanCards } from "@/components/hero-card-fan/fan-cards";

export function StaticFan() {
  return (
    <div
      role="img"
      aria-label="A fanned spread of project cards with a portrait card at the center"
      className="flex h-full w-full items-center justify-center"
    >
      {fanCards.map((card, index) => {
        const mid = (fanCards.length - 1) / 2;
        const t = index - mid;
        return (
          <div
            key={card.key}
            style={{
              transform: `rotate(${t * 10}deg) translateY(${Math.abs(t) * 10}px)`,
              marginLeft: index === 0 ? 0 : "-2.5rem",
              background: card.kind === "photo" ? "#0a0a0a" : undefined,
            }}
            className={`relative flex h-56 w-36 shrink-0 flex-col justify-end overflow-hidden rounded-lg border p-3 ${
              card.kind === "photo" ? "border-brass" : "glass-panel border-brass/50"
            }`}
          >
            {card.kind === "photo" && (
              <Image
                src="/images/hero-portrait.jpg"
                alt=""
                fill
                sizes="144px"
                className="object-cover"
              />
            )}
            <span className="relative text-center text-xs text-bone drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {card.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
