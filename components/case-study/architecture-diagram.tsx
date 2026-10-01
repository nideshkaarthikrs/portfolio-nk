import { PlaceholderVisual } from "@/components/placeholder-visual";

function AgentNegotiateDiagram() {
  return (
    <svg
      viewBox="0 0 720 340"
      role="img"
      aria-label="Architecture diagram: a buyer agent and seller agent exchange offers through a deterministic policy engine that enforces budget, floor price and round limits. An LLM only parses the request and writes explanations. A closed deal produces a test-mode Razorpay payment link, and every event is written to a SHA-256 hash-chained audit trail."
      className="h-auto w-full font-mono text-xs"
    >
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-signal)" />
        </marker>
      </defs>

      <rect x="20" y="40" width="160" height="72" rx="10" fill="var(--color-deep)" stroke="var(--color-signal)" strokeOpacity="0.5" />
      <text x="100" y="82" textAnchor="middle" fill="var(--color-bone)">Buyer agent</text>

      <rect x="540" y="40" width="160" height="72" rx="10" fill="var(--color-deep)" stroke="var(--color-signal)" strokeOpacity="0.5" />
      <text x="620" y="82" textAnchor="middle" fill="var(--color-bone)">Seller agent</text>

      <rect x="270" y="20" width="180" height="112" rx="10" fill="var(--color-deep)" stroke="var(--color-brass)" />
      <text x="360" y="56" textAnchor="middle" fill="var(--color-bone)">Policy engine</text>
      <text x="360" y="74" textAnchor="middle" fill="var(--color-fog)" fontSize="10">
        deterministic
      </text>
      <text x="360" y="98" textAnchor="middle" fill="var(--color-fog)" fontSize="10">
        budget · floor · rounds
      </text>
      <text x="360" y="114" textAnchor="middle" fill="var(--color-fog)" fontSize="10">
        concession schedule
      </text>

      <line x1="180" y1="70" x2="268" y2="70" stroke="var(--color-signal)" markerEnd="url(#arrow)" />
      <line x1="452" y1="70" x2="538" y2="70" stroke="var(--color-signal)" markerEnd="url(#arrow)" />
      <line x1="538" y1="90" x2="452" y2="90" stroke="var(--color-signal)" markerEnd="url(#arrow)" />
      <line x1="268" y1="90" x2="180" y2="90" stroke="var(--color-signal)" markerEnd="url(#arrow)" />

      <rect x="20" y="230" width="190" height="72" rx="10" fill="var(--color-deep)" stroke="var(--color-fog)" strokeOpacity="0.6" strokeDasharray="4 4" />
      <text x="115" y="260" textAnchor="middle" fill="var(--color-bone)">LLM (Gemini → Groq)</text>
      <text x="115" y="280" textAnchor="middle" fill="var(--color-fog)" fontSize="10">
        parses request · explains moves
      </text>

      <rect x="265" y="230" width="190" height="72" rx="10" fill="var(--color-deep)" stroke="var(--color-status-live)" strokeOpacity="0.6" />
      <text x="360" y="260" textAnchor="middle" fill="var(--color-bone)">Payment link</text>
      <text x="360" y="280" textAnchor="middle" fill="var(--color-fog)" fontSize="10">
        Razorpay · test mode
      </text>

      <rect x="510" y="230" width="190" height="72" rx="10" fill="var(--color-deep)" stroke="var(--color-fog)" strokeOpacity="0.6" />
      <text x="605" y="260" textAnchor="middle" fill="var(--color-bone)">Audit trail</text>
      <text x="605" y="280" textAnchor="middle" fill="var(--color-fog)" fontSize="10">
        SHA-256 hash chain
      </text>

      <line x1="100" y1="228" x2="100" y2="114" stroke="var(--color-fog)" strokeDasharray="3 3" markerEnd="url(#arrow)" />
      <line x1="360" y1="132" x2="360" y2="228" stroke="var(--color-fog)" markerEnd="url(#arrow)" />
      <line x1="440" y1="132" x2="600" y2="228" stroke="var(--color-fog)" markerEnd="url(#arrow)" />
    </svg>
  );
}

const diagrams: Record<string, () => React.ReactElement> = {
  agentnegotiate: AgentNegotiateDiagram,
};

export function ArchitectureDiagram({ slug }: { slug: string }) {
  const Diagram = diagrams[slug];

  if (!Diagram) {
    return <PlaceholderVisual label="Architecture diagram coming soon" className="aspect-video w-full" />;
  }

  return (
    <div className="glass-panel rounded-lg border border-white/10 p-6">
      <Diagram />
    </div>
  );
}
