'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import colors from '@/styles/colors';

/**
 * AdminSidebar
 * Shared left navigation for all admin screens.
 *
 * Used on:
 *   Screen 6  — /admin
 *   Screen 7  — /admin/upload
 *   Screen 8  — /admin/schedule
 *   Screen 9  — /admin/schedule/[id]
 *   Screen 10 — /admin/employees
 *
 * Reads current pathname via usePathname() to determine active nav item.
 * No active prop needed — sidebar is self-aware.
 *
 * Phase 2: Add logout button at bottom calling Firebase signOut().
 */
export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard',     href: '/admin'             },
    { label: 'Full Schedule', href: '/admin/schedule'    },
    { label: 'Employees',     href: '/admin/employees'   },
  ];

  // Exact match for /admin dashboard, startsWith for nested routes
  function isActive(href) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <aside style={styles.sidebar} aria-label="Admin navigation">

      {/* Logo */}
      <div style={styles.logoArea}>
        <div style={styles.logoBadge}>C</div>
        <div>
          <p style={styles.logoTitle}>CDC Schedule</p>
          <p style={styles.logoSub}>ADMIN PANEL</p>
        </div>
      </div>

      {/* Nav items */}
      <nav style={styles.nav}>
        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.navItem,
                background:   active ? colors.blueLight : 'transparent',
                borderLeft:   active
                  ? '3px solid ' + colors.blue
                  : '3px solid transparent',
                color:        active ? colors.blue : colors.textMuted,
                fontWeight:   active ? 700 : 400,
              }}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerEmail}>supervisor@cdceglin.edu</p>
      </div>

    </aside>
  );
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const styles = {
  sidebar: {
    width: 210,
    background: colors.white,
    borderRight: '2px solid ' + colors.border,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '100%',
  },

  logoArea: {
    padding: '20px 18px 16px',
    borderBottom: '1px solid ' + colors.border,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: colors.blue,
    color: colors.white,
    fontSize: 13,
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoTitle: {
    fontSize: 12,
    fontWeight: 800,
    color: colors.textPrimary,
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: 9,
    color: colors.textLight,
    letterSpacing: 0.6,
    marginTop: 1,
  },

  nav: {
    flex: 1,
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  navItem: {
    display: 'block',
    padding: '11px 18px',
    fontSize: 13,
    textDecoration: 'none',
    transition: 'background 0.12s ease',
  },

  footer: {
    padding: '14px 18px',
    borderTop: '1px solid ' + colors.border,
  },
  footerEmail: {
    fontSize: 10,
    color: colors.textLight,
  },
};
