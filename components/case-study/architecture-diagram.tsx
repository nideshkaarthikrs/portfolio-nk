import { PlaceholderVisual } from "@/components/placeholder-visual";

function AgentNegotiateDiagram() {
  return (
    <svg
      viewBox="0 0 720 320"
      role="img"
      aria-label="Architecture diagram: a buyer agent and seller agent exchange offers through a policy engine, which blocks any offer outside the configured spend limit, and a settled deal writes to the payment settlement service and an append-only audit log."
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

      <rect x="280" y="20" width="160" height="112" rx="10" fill="var(--color-deep)" stroke="var(--color-brass)" />
      <text x="360" y="62" textAnchor="middle" fill="var(--color-bone)">Policy engine</text>
      <text x="360" y="82" textAnchor="middle" fill="var(--color-fog)" fontSize="10">
        spend limit
      </text>
      <text x="360" y="98" textAnchor="middle" fill="var(--color-fog)" fontSize="10">
        merchant policy
      </text>

      <line x1="180" y1="70" x2="278" y2="70" stroke="var(--color-signal)" markerEnd="url(#arrow)" />
      <line x1="442" y1="70" x2="538" y2="70" stroke="var(--color-signal)" markerEnd="url(#arrow)" />
      <line x1="538" y1="90" x2="442" y2="90" stroke="var(--color-signal)" markerEnd="url(#arrow)" />
      <line x1="278" y1="90" x2="180" y2="90" stroke="var(--color-signal)" markerEnd="url(#arrow)" />

      <rect x="200" y="220" width="140" height="60" rx="10" fill="var(--color-deep)" stroke="var(--color-status-live)" strokeOpacity="0.6" />
      <text x="270" y="255" textAnchor="middle" fill="var(--color-bone)">Payment settlement</text>

      <rect x="380" y="220" width="140" height="60" rx="10" fill="var(--color-deep)" stroke="var(--color-fog)" strokeOpacity="0.6" />
      <text x="450" y="245" textAnchor="middle" fill="var(--color-bone)">Audit log</text>
      <text x="450" y="262" textAnchor="middle" fill="var(--color-fog)" fontSize="10">
        append-only
      </text>

      <line x1="360" y1="132" x2="270" y2="218" stroke="var(--color-fog)" markerEnd="url(#arrow)" />
      <line x1="360" y1="132" x2="450" y2="218" stroke="var(--color-fog)" markerEnd="url(#arrow)" />
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
