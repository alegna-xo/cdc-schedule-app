import Link from 'next/link';
import { CalendarIcon, PersonIcon } from '@/components/ui/Icon';
import colors from '@/styles/colors';

/**
 * BottomNav
 * Shared bottom navigation bar for all employee-facing screens.
 *
 * Used on:
 *   Screen 3 — My Schedule    (active: 'schedule')
 *   Screen 4 — No Schedule    (active: 'schedule')
 *   Screen 5 — My Profile     (active: 'profile')
 *
 * @param {'schedule' | 'profile'} active - Which tab is currently active
 */
export default function BottomNav({ active }) {
  const tabs = [
    {
      id:    'schedule',
      label: 'Schedule',
      href:  '/schedule',
      icon:  (isActive) => (
        <CalendarIcon
          color={isActive ? colors.blue : colors.textLight}
          size={22}
        />
      ),
    },
    {
      id:    'profile',
      label: 'Profile',
      href:  '/profile',
      icon:  (isActive) => (
        <PersonIcon
          color={isActive ? colors.blue : colors.textLight}
          size={22}
        />
      ),
    },
  ];

  return (
    <nav style={styles.nav} aria-label="Main navigation">
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            style={styles.tab}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.icon(isActive)}
            <span
              style={{
                ...styles.label,
                color: isActive ? colors.blue : colors.textLight,
              }}
            >
              {tab.label}
            </span>
            {/* Active indicator bar */}
            {isActive && <div style={styles.activeBar} />}
          </Link>
        );
      })}
    </nav>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  nav: {
    background: colors.white,
    borderTop: `2px solid ${colors.border}`,
    padding: '12px 0',
    display: 'flex',
    justifyContent: 'space-around',
    // Ensures nav stays at bottom on short content screens
    flexShrink: 0,
  },

  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    textDecoration: 'none',
    // Touch target — minimum 44px for accessibility
    minWidth: 64,
    padding: '2px 0',
    position: 'relative',
  },

  label: {
    fontSize: 10,
    fontWeight: 700,
  },

  activeBar: {
    width: 20,
    height: 3,
    background: colors.blue,
    borderRadius: 2,
    marginTop: 1,
  },
};
