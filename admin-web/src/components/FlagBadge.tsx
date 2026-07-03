/** Inline SVG country flag badges per DESIGN.md ICONS rule (no emoji flags). */

export default function FlagBadge({ country, size = 18 }: { country: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 20 20",
    style: {
      borderRadius: 5,
      flexShrink: 0,
      boxShadow: "0 0 0 1px rgba(23,37,42,0.08)",
      display: "block",
    } as const,
    "aria-hidden": true,
  };

  if (country === "GH") {
    // Ghana: red/gold/green horizontal bands + black star
    return (
      <svg {...common}>
        <rect width="20" height="20" fill="#CE1126" />
        <rect y="6.667" width="20" height="6.667" fill="#FCD116" />
        <rect y="13.333" width="20" height="6.667" fill="#006B3F" />
        <path
          d="M10 6.9 L10.93 9.55 L13.7 9.6 L11.5 11.27 L12.3 13.9 L10 12.3 L7.7 13.9 L8.5 11.27 L6.3 9.6 L9.07 9.55 Z"
          fill="#17252A"
        />
      </svg>
    );
  }

  if (country === "NG") {
    // Nigeria: green/white/green vertical bands
    return (
      <svg {...common}>
        <rect width="20" height="20" fill="#FFFFFF" />
        <rect width="6.667" height="20" fill="#008751" />
        <rect x="13.333" width="6.667" height="20" fill="#008751" />
      </svg>
    );
  }

  // Fallback: plain text pill
  return (
    <span
      className="pill gray"
      style={{ fontSize: 10, padding: "2px 7px" }}
      aria-hidden
    >
      {country.slice(0, 2).toUpperCase()}
    </span>
  );
}
