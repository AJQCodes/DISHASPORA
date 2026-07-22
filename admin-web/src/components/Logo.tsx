// Dishaspora logo mark — steaming bowl on a cyan gradient disc with an orange accent.
export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-label="Dishaspora"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="dsp-disc" x1="6" y1="4" x2="42" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#33CFFF" />
          <stop offset="1" stopColor="#0FB8C4" />
        </linearGradient>
        <linearGradient id="dsp-bowl" x1="12" y1="26" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E9FBFD" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#dsp-disc)" />
      {/* bowl */}
      <path d="M11.5 26.5h25a12.5 12.5 0 0 1-25 0Z" fill="url(#dsp-bowl)" />
      {/* bowl foot */}
      <path d="M19 39.5h10" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
      {/* steam curls */}
      <path
        d="M18.5 21.5c-1.8-2.4 1.8-3.4 0-6.3"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24.2 22.3c-1.8-2.6 1.8-3.8 0-7.5"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M29.9 21.5c-1.8-2.4 1.8-3.4 0-6.3"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* orange accent — sun over the bowl rim */}
      <circle cx="35.5" cy="13.5" r="4.2" fill="#FF9F43" />
    </svg>
  );
}
