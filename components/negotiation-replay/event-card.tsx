import { NegotiationEvent } from "@/components/negotiation-replay/types";

const typeAccent: Record<NegotiationEvent["type"], string> = {
  offer: "border-white/10",
  counter: "border-white/10",
  check: "border-signal/30",
  revised: "border-signal/40",
  blocked: "border-brass/60",
  agreement: "border-status-live/50",
  settlement: "border-status-live/50",
  audit: "border-fog/30",
};

const typeLabelColor: Record<NegotiationEvent["type"], string> = {
  offer: "text-fog",
  counter: "text-fog",
  check: "text-signal",
  revised: "text-signal",
  blocked: "text-brass",
  agreement: "text-status-live",
  settlement: "text-status-live",
  audit: "text-fog",
};

export function EventCard({ event, animate }: { event: NegotiationEvent; animate: boolean }) {
  return (
    <div
      className={`glass-panel rounded-lg border ${typeAccent[event.type]} p-4 ${animate ? "replay-item" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs ${typeLabelColor[event.type]}`}>{event.actorLabel}</span>
        {event.amount && <span className="font-mono text-xs text-bone">{event.amount}</span>}
      </div>
      <p className="mt-2 text-sm text-bone">{event.message}</p>
    </div>
  );
}
