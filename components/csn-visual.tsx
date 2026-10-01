/**
 * A drawn stand-in for CSN, which can't show real product screens yet: creators
 * around a shared project, with revenue flowing back out along the split.
 */

const CENTER = { x: 320, y: 180 };
const RING_RADIUS = 52;

const CREATORS = [
  { label: "Composer", x: 120, y: 92, share: 0.3 },
  { label: "Lyricist", x: 525, y: 82, share: 0.25 },
  { label: "Singer", x: 112, y: 280, share: 0.2 },
  { label: "Director", x: 530, y: 284, share: 0.25 },
];

const RING_OPACITY = [1, 0.7, 0.45, 0.25];
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SEGMENT_GAP = 6;

// Each creator's arc on the split ring: its length and where it starts.
const SEGMENTS = CREATORS.map((creator, i) => ({
  label: creator.label,
  length: creator.share * CIRCUMFERENCE - SEGMENT_GAP,
  start: CREATORS.slice(0, i).reduce((sum, c) => sum + c.share, 0) * CIRCUMFERENCE,
  opacity: RING_OPACITY[i],
}));

// Deterministic "stars" so server and client render the same markup.
const STARS = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 157) % 640,
  y: (i * 89 + 37) % 360,
  r: i % 5 === 0 ? 1.4 : 0.8,
}));

export function CsnVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-lg border border-white/10 bg-deep ${className}`}>
      <svg
        viewBox="0 0 640 360"
        role="img"
        aria-label="Illustration: four creators connected to a shared project, with revenue flowing back to each of them along an automatic split."
        className="h-full w-full"
      >
        {STARS.map((star, i) => (
          <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="var(--color-bone)" opacity={0.18} />
        ))}

        {CREATORS.map((creator) => (
          <g key={creator.label}>
            <line
              x1={CENTER.x}
              y1={CENTER.y}
              x2={creator.x}
              y2={creator.y}
              stroke="var(--color-signal)"
              strokeOpacity={0.15}
            />
            <line
              x1={CENTER.x}
              y1={CENTER.y}
              x2={creator.x}
              y2={creator.y}
              stroke="var(--color-signal)"
              strokeWidth={1.5}
              strokeDasharray="4 20"
              strokeLinecap="round"
              className="csn-flow"
            />
            <circle cx={creator.x} cy={creator.y} r={20} fill="var(--color-deep-raised)" stroke="var(--color-signal)" strokeOpacity={0.6} />
            <circle cx={creator.x} cy={creator.y} r={4} fill="var(--color-signal)" />
            <text
              x={creator.x}
              y={creator.y + 38}
              textAnchor="middle"
              fill="var(--color-fog)"
              className="font-mono"
              fontSize={11}
              letterSpacing="0.12em"
            >
              {creator.label.toUpperCase()}
            </text>
          </g>
        ))}

        <g transform={`rotate(-90 ${CENTER.x} ${CENTER.y})`}>
          {SEGMENTS.map((segment) => (
            <circle
              key={segment.label}
              cx={CENTER.x}
              cy={CENTER.y}
              r={RING_RADIUS}
              fill="none"
              stroke="var(--color-signal)"
              strokeOpacity={segment.opacity}
              strokeWidth={8}
              strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
              strokeDashoffset={-segment.start}
            />
          ))}
        </g>
        <circle cx={CENTER.x} cy={CENTER.y} r={36} fill="var(--color-deep-raised)" />
        <text
          x={CENTER.x}
          y={CENTER.y + 4}
          textAnchor="middle"
          fill="var(--color-bone)"
          className="font-mono"
          fontSize={11}
          letterSpacing="0.12em"
        >
          PROJECT
        </text>

        <text x={24} y={340} fill="var(--color-signal)" className="font-mono" fontSize={11} letterSpacing="0.2em">
          {"// UNDER WRAPS — IN RESEARCH & BUILDING"}
        </text>
      </svg>
    </div>
  );
}
