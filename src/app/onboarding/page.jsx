'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon } from '@/components/ui/Icon';
import mockEmployees from '@/data/mockEmployees';
import colors from '@/styles/colors';

/**
 * OnboardingPage — Screen 2: Name Claim
 * Route: /onboarding
 *
 * Shown to first-time users only, immediately after Google sign-in.
 * The employee selects their name from the schedule list.
 * That selection links their Gmail account to their schedule row.
 *
 * Phase 1: Names come from mockEmployees.js, selection stored in state.
 * Phase 2: Names pulled from Firestore (parsed from uploaded Excel).
 *           Selection writes { uid → employeeName } to Firestore.
 *           Middleware checks `nameClaimed: true` to skip this page on future logins.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // Filter employee list based on search input
  // useMemo prevents re-filtering on every keystroke unless query or list changes
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return mockEmployees;
    return mockEmployees.filter(emp =>
      emp.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedEmployee = mockEmployees.find(emp => emp.id === selectedId);
  const hasSelection = selectedId !== null;

  // Phase 1 mock — no real auth yet
  // Phase 2: write claim to Firestore, then redirect
  function handleClaim() {
    if (!hasSelection) return;
    router.push('/schedule');
  }

  return (
    <main style={styles.main}>

      {/* ── Header ── */}
      <div style={styles.header}>
        <p style={styles.eyebrow}>One-time setup</p>
        <h1 style={styles.heading}>Who are you?</h1>
        <p style={styles.subtext}>
          Select your name as it appears on the schedule.
        </p>
      </div>

      {/* ── Body ── */}
      <div style={styles.body}>

        {/* Search input */}
        <input
          type="search"
          placeholder="Search your name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={styles.searchInput}
          aria-label="Search employee names"
        />

        {/* Name list */}
        <ul style={styles.nameList} role="listbox" aria-label="Employee names">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(emp => {
              const isSelected = selectedId === emp.id;
              return (
                <li
                  key={emp.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(emp.id)}
                  style={{
                    ...styles.nameItem,
                    border: `2px solid ${isSelected ? colors.blue : colors.border}`,
                    background: isSelected ? colors.blueLight : colors.white,
                  }}
                >
                  <span style={styles.nameText}>{emp.name}</span>
                  {isSelected && (
                    <span style={styles.checkWrapper} aria-hidden="true">
                      <CheckIcon color={colors.blue} size={18} />
                    </span>
                  )}
                </li>
              );
            })
          ) : (
            <li style={styles.emptyState}>
              No names match &ldquo;{searchQuery}&rdquo;
            </li>
          )}
        </ul>
      </div>

      {/* ── Footer / CTA ── */}
      <div style={styles.footer}>
        <button
          onClick={handleClaim}
          disabled={!hasSelection}
          aria-disabled={!hasSelection}
          style={{
            ...styles.continueButton,
            background: hasSelection ? colors.blue : colors.border,
            color: hasSelection ? colors.white : colors.textLight,
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            boxShadow: hasSelection
              ? '0 2px 10px rgba(37, 99, 235, 0.25)'
              : 'none',
          }}
        >
          {hasSelection
            ? `That's me — continue`
            : 'Select your name above'}
        </button>

        <p style={styles.helperText}>
          Name not listed? Contact your supervisor.
        </p>
      </div>

    </main>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  main: {
    minHeight: '100dvh',
    maxWidth: 480,
    margin: '0 auto',
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
  },

  // Header — royal blue gradient, no shield (content-focused)
  header: {
    background: `linear-gradient(150deg, ${colors.blue} 0%, ${colors.blueDark} 100%)`,
    padding: '20px 20px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: 900,
    color: colors.white,
    lineHeight: 1.1,
  },
  subtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 1.6,
    marginTop: 4,
  },

  // Body — search + scrollable list
  body: {
    flex: 1,
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    overflowY: 'auto',
  },

  searchInput: {
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${colors.border}`,
    borderRadius: 10,
    fontSize: 13,
    color: colors.textPrimary,
    background: colors.offWhite,
    outline: 'none',
    // Appearance reset for search inputs on Safari
    WebkitAppearance: 'none',
  },

  // Scrollable name list
  nameList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    overflowY: 'auto',
    // Max height ensures the list scrolls rather than pushing the CTA off-screen
    maxHeight: 'calc(100dvh - 280px)',
  },

  nameItem: {
    padding: '12px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'border-color 0.12s ease, background 0.12s ease',
    // Prevent text selection on rapid taps
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  nameText: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.textPrimary,
  },
  checkWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },

  emptyState: {
    padding: '20px 14px',
    textAlign: 'center',
    fontSize: 13,
    color: colors.textLight,
    fontStyle: 'italic',
  },

  // Sticky footer — confirm button + helper text
  footer: {
    padding: '14px 20px 24px',
    borderTop: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: colors.white,
  },
  continueButton: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    border: 'none',
    fontSize: 15,
    fontWeight: 700,
    transition: 'background 0.15s ease, box-shadow 0.15s ease',
  },
  helperText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textLight,
  },
};
