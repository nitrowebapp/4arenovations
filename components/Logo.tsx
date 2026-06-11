export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <rect width="48" height="48" rx="10" fill="#191c24" />
      <text
        x="25"
        y="33"
        textAnchor="middle"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontSize="23"
        fontWeight="900"
        fontStyle="italic"
        fill="#c8ccd4"
        stroke="#3555e8"
        strokeWidth="0.9"
      >
        4A
      </text>
    </svg>
  );
}

export function Logo({
  size = 40,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-extrabold tracking-tight ${dark ? "text-white" : "text-brand"}`}
        >
          4A <span className="text-accent">Renovation &amp; Floor</span>
        </span>
        <span
          className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${dark ? "text-white/60" : "text-ink/60"}`}
        >
          Vinyl &middot; Tile &middot; Laminate &mdash; Orlando, FL
        </span>
      </span>
    </span>
  );
}
