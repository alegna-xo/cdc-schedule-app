'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { EditIcon } from '@/components/ui/Icon';
import mockFullSchedule from '@/data/mockFullSchedule';
import colors from '@/styles/colors';

/**
 * FullSchedulePage - Screen 8
 * Route: /admin/schedule
 *
 * Admin's read-only bird's-eye view of all employee schedules.
 * Search filters by employee name client-side.
 * Edit button routes to /admin/schedule/[id] for individual editing.
 *
 * Phase 2: Query Firestore schedules/{weekId}/employees collection.
 *          Search can remain client-side or move to a Firestore query.
 */
export default function FullSchedulePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { weekLabel, totalEmployees, employees } = mockFullSchedule;

  // Client-side search filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(q)
    );
  }, [search, employees]);

  const DAYS = ['MON 6/16', 'TUE 6/17', 'WED 6/18', 'THU 6/19', 'FRI 6/20'];

  return (
    <div style={styles.page}>

      {/* ── Page header ── */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Full Schedule</h1>
          <p style={styles.pageSubtitle}>
            {weekLabel} · {totalEmployees} employees
          </p>
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search employee..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
          aria-label="Search employees"
        />
      </div>

      {/* ── Schedule table ── */}
      <div style={styles.tableCard}>
        <div style={styles.tableScroll}>
          <table style={tableStyles.table}>
            <thead>
              <tr style={tableStyles.headerRow}>
                <th style={{ ...tableStyles.th, textAlign: 'left' }}>Employee</th>
                {DAYS.map(day => (
                  <th key={day} style={tableStyles.th}>{day}</th>
                ))}
                <th style={tableStyles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                <>
                  {filtered.map((emp, i) => (
                    <tr
                      key={emp.id}
                      style={{
                        background: i % 2 === 0 ? colors.white : colors.offWhite,
                      }}
                    >
                      {/* Name */}
                      <td style={{ ...tableStyles.td, fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap' }}>
                        {emp.name}
                      </td>

                      {/* Day cells */}
                      {emp.days.map((cell, j) => (
                        <td key={j} style={getCellStyle(cell)}>
                          {cell}
                        </td>
                      ))}

                      {/* Edit action */}
                      <td style={{ ...tableStyles.td, textAlign: 'center' }}>
                        <button
                          onClick={() => router.push('/admin/schedule/' + emp.id)}
                          style={styles.editButton}
                          aria-label={'Edit schedule for ' + emp.name}
                        >
                          <EditIcon color={colors.blue} size={13} />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Remaining employees indicator */}
                  {!search && (
                    <tr>
                      <td
                        colSpan={7}
                        style={tableStyles.moreRow}
                      >
                        … {totalEmployees - employees.length} more employees not shown in mock data
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                <tr>
                  <td colSpan={7} style={tableStyles.emptyRow}>
                    No employees match &ldquo;{search}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function getCellStyle(value) {
  const isBreaker = value === 'Breaker' || value.includes('Breaker');
  const isClosed  = value === 'CLOSED' || value === 'OFF' || value === 'N/A';

  return {
    ...tableStyles.td,
    color:      isClosed  ? colors.textLight
              : isBreaker ? colors.purpleDark
              : colors.textPrimary,
    background: isBreaker ? colors.purpleLight : 'transparent',
  };
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const styles = {
  page: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },

  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 14,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
  },

  searchInput: {
    padding: '8px 14px',
    border: '1.5px solid ' + colors.border,
    borderRadius: 8,
    fontSize: 13,
    color: colors.textPrimary,
    width: 220,
    outline: 'none',
    background: colors.white,
  },

  tableCard: {
    background: colors.white,
    border: '1.5px solid ' + colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableScroll: {
    overflowX: 'auto',
  },

  editButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 12px',
    background: colors.blueLight,
    border: '1.5px solid ' + colors.blueBorder,
    borderRadius: 6,
    color: colors.blue,
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
  },
};

const tableStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
    minWidth: 700,
  },
  headerRow: {
    background: colors.offWhite,
    borderBottom: '2px solid ' + colors.border,
  },
  th: {
    padding: '10px 14px',
    textAlign: 'center',
    color: colors.textMuted,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '9px 14px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid ' + colors.offWhite,
  },
  moreRow: {
    padding: '12px 14px',
    textAlign: 'center',
    color: colors.textLight,
    fontSize: 12,
    fontStyle: 'italic',
    borderBottom: 'none',
  },
  emptyRow: {
    padding: '24px 14px',
    textAlign: 'center',
    color: colors.textLight,
    fontSize: 13,
    fontStyle: 'italic',
  },
};
