"use client";

import { useEffect, useRef, useState } from "react";
import script from "@/content/negotiation-replay.json";
import { InteractiveCard } from "@/components/interactive-card";
import { EventCard } from "@/components/negotiation-replay/event-card";
import { NegotiationColumn, NegotiationScript } from "@/components/negotiation-replay/types";
import { useReducedMotion } from "@/lib/use-media-query";

const { context, events } = script as NegotiationScript;

const columns: { key: NegotiationColumn; label: string }[] = [
  { key: "buyer", label: "Buyer agent" },
  { key: "policy", label: "Policy engine & system" },
  { key: "seller", label: "Seller agent" },
];

const STEP_MS = 1600;

export function NegotiationReplay() {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing || reducedMotion) return;

    timerRef.current = setInterval(() => {
      setStep((current) => {
        if (current >= events.length) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, STEP_MS / speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, speed, reducedMotion]);

  useEffect(() => {
    if (step >= events.length && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [step]);

  if (reducedMotion) {
    return (
      <div className="glass-panel rounded-lg border border-white/10 p-6">
        <ContextLine />
        <ol className="mt-4 flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} animate={false} />
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const isDone = step >= events.length;

  return (
    <InteractiveCard maxTilt={0} className="glass-panel rounded-lg border border-white/10 p-6">
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <ContextLine />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((current) => (isDone ? current : !current))}
            className="rounded bg-signal px-4 py-1.5 text-sm font-medium text-midnight transition-opacity hover:opacity-90 disabled:opacity-40"
            disabled={isDone}
          >
            {playing && !isDone ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setPlaying(true);
            }}
            className="rounded border border-white/15 px-4 py-1.5 text-sm text-bone transition-colors hover:border-signal hover:text-signal"
          >
            Restart
          </button>
          <button
            type="button"
            onClick={() => setSpeed((current) => (current === 1 ? 2 : 1))}
            className="rounded border border-white/15 px-3 py-1.5 text-sm text-bone transition-colors hover:border-signal hover:text-signal"
            aria-label="Toggle playback speed"
          >
            {speed}×
          </button>
        </div>
      </div>

      <div className="relative mt-6 grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <div key={column.key} className="flex flex-col gap-3">
            <p className="text-sm text-fog">{column.label}</p>
            <div className="flex flex-col gap-3">
              {events
                .slice(0, step)
                .filter((event) => event.column === column.key)
                .map((event) => (
                  <EventCard key={event.id} event={event} animate />
                ))}
            </div>
          </div>
        ))}
      </div>

      {isDone && (
        <p className="mt-6 text-sm text-status-live">Negotiation complete.</p>
      )}
    </InteractiveCard>
  );
}

function ContextLine() {
  return (
    <p className="text-sm text-fog">
      {context.item} — buyer budget {formatInr(context.buyerMaxBudget)}, seller floor{" "}
      {formatInr(context.sellerFloorPerUnit)}/unit, {context.maxRounds} rounds max.
    </p>
  );
}

function formatInr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}
