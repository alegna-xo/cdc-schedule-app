import colors from '@/styles/colors';

/**
 * CDCShield
 * The CDC logo shield — silver outer, red inner, white fill, blue CDC text.
 * Matches the physical CDC logo exactly.
 *
 * @param {number} size - Width in px. Height scales proportionally (×1.12).
 */
export default function CDCShield({ size = 64 }) {
  const height = Math.round(size * 1.12);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 100 112"
      fill="none"
      aria-label="CDC Shield Logo"
      role="img"
    >
      {/* Outer silver shield */}
      <path
        d="M50 2 L94 18 L94 60 Q94 90 50 110 Q6 90 6 60 L6 18 Z"
        fill="#CBD5E1"
      />

      {/* Blue wing bars — left */}
      <rect x="0"  y="30" width="20" height="8" rx="2" fill={colors.blue} />
      <rect x="0"  y="42" width="15" height="7" rx="2" fill={colors.blue} />

      {/* Blue wing bars — right */}
      <rect x="80" y="30" width="20" height="8" rx="2" fill={colors.blue} />
      <rect x="85" y="42" width="15" height="7" rx="2" fill={colors.blue} />

      {/* Red inner shield */}
      <path
        d="M50 11 L87 25 L87 60 Q87 85 50 103 Q13 85 13 60 L13 25 Z"
        fill={colors.red}
      />

      {/* White fill */}
      <path
        d="M50 19 L81 31 L81 60 Q81 80 50 96 Q19 80 19 60 L19 31 Z"
        fill={colors.white}
      />

      {/* CDC wordmark */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontWeight="900"
        fontSize="27"
        fill={colors.blue}
        letterSpacing="-1"
      >
        CDC
      </text>
    </svg>
  );
}
