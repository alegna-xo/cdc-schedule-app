import colors from '@/styles/colors';

/**
 * EmployeePageHeader
 * Shared blue gradient header used across all employee-facing screens.
 *
 * Used on:
 *   Screen 3 — My Schedule
 *   Screen 4 — No Schedule Yet
 *   Screen 5 — My Profile (with slight avatar extension)
 *
 * @param {string}   name       - Employee display name, e.g. "Angela L."
 * @param {string}   initials   - Avatar initials, e.g. "AL"
 * @param {string}   weekLabel  - Week label, e.g. "Week of June 16 – 20, 2025"
 * @param {string}   group      - Schedule group, e.g. "Flex Blue"
 * @param {function} onAvatarClick - Called when the initials avatar is tapped
 * @param {React.ReactNode} [children] - Optional slot for day tabs (Screen 3 only)
 */
export default function EmployeePageHeader({
  name,
  initials,
  weekLabel,
  group,
  onAvatarClick,
  children,
}) {
  return (
    <div style={styles.header}>

      {/* Top row — name, group badge, avatar */}
      <div style={styles.topRow}>
        <div style={styles.nameBlock}>
          <p style={styles.weekLabel}>{weekLabel}</p>
          <h1 style={styles.name}>{name}</h1>
          <div style={styles.badgeRow}>
            <span style={styles.groupBadge}>{group}</span>
            <span style={styles.location}>Eglin AFB CDC</span>
          </div>
        </div>

        {/* Initials avatar — tapping navigates to /profile */}
        <button
          onClick={onAvatarClick}
          style={styles.avatar}
          aria-label="Go to my profile"
        >
          {initials}
        </button>
      </div>

      {/* Optional slot — Screen 3 passes day tabs here */}
      {children && (
        <div style={styles.tabSlot}>
          {children}
        </div>
      )}

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  header: {
    background: `linear-gradient(160deg, ${colors.blue} 0%, ${colors.blueDark} 100%)`,
  },

  topRow: {
    padding: '18px 20px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },

  weekLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  name: {
    fontSize: 24,
    fontWeight: 900,
    color: colors.white,
    letterSpacing: -0.5,
    lineHeight: 1.1,
  },

  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginTop: 6,
  },

  groupBadge: {
    background: colors.purple,
    borderRadius: 20,
    padding: '3px 11px',
    fontSize: 10,
    fontWeight: 800,
    color: colors.white,
    letterSpacing: 0.5,
  },

  location: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.45)',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.35)',
    color: colors.white,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.5,
    cursor: 'pointer',
    flexShrink: 0,
    // Reset button defaults
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabSlot: {
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
  },
};
