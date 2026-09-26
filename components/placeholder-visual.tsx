export function PlaceholderVisual({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${label} — image coming soon`}
      className={`flex items-center justify-center rounded-lg border border-white/10 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_14px),linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0)_45%),var(--color-deep)] ${className}`}
    >
      <span className="px-4 text-center text-sm text-fog">{label}</span>
    </div>
  );
}
