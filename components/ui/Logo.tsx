export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-grotesk font-bold tracking-[-0.02em] ${className}`} style={{ fontFamily: "var(--font-grotesk)" }}>
      EYE<span className="text-danger">//</span>SHIFT
    </span>
  );
}
