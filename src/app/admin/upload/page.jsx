'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WarnIcon } from '@/components/ui/Icon';
import mockAdminData from '@/data/mockAdminData';
import colors from '@/styles/colors';

/**
 * UploadPreviewPage - Screen 7
 * Route: /admin/upload
 *
 * Admin reviews the parsed schedule before publishing.
 * Duplicate week warning shown if a schedule for this week exists.
 * Confirm checkbox must be checked before publish button activates.
 *
 * Phase 1: All data is mock. Publish routes to /admin/schedule.
 * Phase 2:
 *   - File is parsed client-side using SheetJS (xlsx library)
 *   - Preview data comes from the parsed Excel result
 *   - Publish writes schedule data to Firestore, sets isPublished: true
 *   - All employees see updated schedule immediately
 */
export default function UploadPreviewPage() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);

  const { uploadPreview } = mockAdminData;
  const { weekDetected, employeesFound, rowsParsed, isDuplicate, previewRows } = uploadPreview;

  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  function handlePublish() {
    if (!confirmed) return;
    // Phase 2: write to Firestore here, then navigate
    router.push('/admin/schedule');
  }

  function getCellStyle(value) {
    const isBreaker  = value.includes('Breaker');
    const isClosed   = value === 'CLOSED' || value === 'OFF' || value === 'N/A';
    return {
      ...tableStyles.td,
      color:      isClosed  ? colors.textLight : isBreaker ? colors.purpleDark : colors.textPrimary,
      background: isBreaker ? colors.purpleLight : 'transparent',
    };
  }

  return (
    <div style={styles.page}>

      {/* ── Page header ── */}
      <div style={styles.pageHeader}>
        <button
          onClick={() => router.push('/admin')}
          style={styles.backButton}
        >
          ← Back
        </button>
        <h1 style={styles.pageTitle}>Review Before Publishing</h1>
      </div>

      {/* ── Duplicate week warning ── */}
      {isDuplicate && (
        <div style={styles.warningBox}>
          <div style={styles.warningIcon}>
            <WarnIcon color={colors.warn} size={18} />
          </div>
          <div>
            <p style={styles.warningTitle}>Duplicate Week Detected</p>
            <p style={styles.warningBody}>
              A schedule for {weekDetected} already exists. Publishing will
              replace it. Make sure this is the correct updated file.
            </p>
          </div>
        </div>
      )}

      {/* ── Summary stats ── */}
      <div style={styles.statsRow}>
        <StatCard label="Week Detected"    value={weekDetected}            />
        <StatCard label="Employees Found"  value={employeesFound}          />
        <StatCard label="Rows Parsed"      value={rowsParsed.toLocaleString()} />
      </div>

      {/* ── Schedule preview table ── */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <p style={styles.tableTitle}>Schedule Preview</p>
          <p style={styles.tableHint}>Showing {previewRows.length} of {employeesFound} employees</p>
        </div>
        <div style={styles.tableScroll}>
          <table style={tableStyles.table}>
            <thead>
              <tr style={tableStyles.headerRow}>
                <th style={tableStyles.th}>Employee</th>
                {DAYS.map(day => (
                  <th key={day} style={{ ...tableStyles.th, textAlign: 'center' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, i) => (
                <tr
                  key={row.name}
                  style={{ background: i % 2 === 0 ? colors.white : colors.offWhite }}
                >
                  <td style={{ ...tableStyles.td, fontWeight: 600 }}>{row.name}</td>
                  {row.days.map((cell, j) => (
                    <td key={j} style={getCellStyle(cell)}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Confirm checkbox ── */}
      <div style={styles.confirmBox}>
        <input
          type="checkbox"
          id="confirm-check"
          checked={confirmed}
          onChange={e => setConfirmed(e.target.checked)}
          style={styles.checkbox}
        />
        <label htmlFor="confirm-check" style={styles.confirmLabel}>
          I have reviewed the schedule and confirm it is correct.
          Publishing will make it live to all employees immediately.
        </label>
      </div>

      {/* ── Action buttons ── */}
      <div style={styles.actions}>
        <button
          onClick={() => router.push('/admin')}
          style={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          onClick={handlePublish}
          disabled={!confirmed}
          style={{
            ...styles.publishButton,
            background:  confirmed ? colors.blue   : colors.border,
            color:       confirmed ? colors.white  : colors.textLight,
            cursor:      confirmed ? 'pointer'     : 'not-allowed',
            boxShadow:   confirmed
              ? '0 2px 8px rgba(37,99,235,0.25)'
              : 'none',
          }}
        >
          Publish Schedule
        </button>
      </div>

    </div>
  );
}

// -----------------------------------------------------------------------------
// StatCard
// -----------------------------------------------------------------------------
function StatCard({ label, value }) {
  return (
    <div style={statStyles.card}>
      <p style={statStyles.value}>{value}</p>
      <p style={statStyles.label}>{label}</p>
    </div>
  );
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
    maxWidth: 900,
  },

  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: colors.textMuted,
    fontSize: 13,
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },

  // Duplicate warning
  warningBox: {
    background: colors.warnBg,
    border: '1.5px solid ' + colors.warnBd,
    borderRadius: 10,
    padding: '13px 16px',
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  warningIcon: {
    flexShrink: 0,
    marginTop: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.warn,
    marginBottom: 3,
  },
  warningBody: {
    fontSize: 12,
    color: colors.warn,
    lineHeight: 1.55,
  },

  // Stats
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 14,
  },

  // Preview table
  tableCard: {
    background: colors.white,
    border: '1.5px solid ' + colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    padding: '12px 18px',
    borderBottom: '1px solid ' + colors.offWhite,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  tableHint: {
    fontSize: 11,
    color: colors.textLight,
  },
  tableScroll: {
    overflowX: 'auto',
  },

  // Confirm checkbox
  confirmBox: {
    background: colors.white,
    border: '1.5px solid ' + colors.border,
    borderRadius: 10,
    padding: '14px 18px',
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: colors.blue,
    cursor: 'pointer',
    flexShrink: 0,
    marginTop: 1,
  },
  confirmLabel: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 1.6,
    cursor: 'pointer',
  },

  // Action buttons
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    padding: '9px 20px',
    border: '1.5px solid ' + colors.border,
    borderRadius: 8,
    background: colors.white,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  publishButton: {
    padding: '9px 26px',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    transition: 'background 0.15s ease, box-shadow 0.15s ease',
  },
};

const statStyles = {
  card: {
    background: colors.white,
    border: '1.5px solid ' + colors.border,
    borderRadius: 12,
    padding: '16px 18px',
  },
  value: {
    fontSize: 26,
    fontWeight: 900,
    color: colors.textPrimary,
    lineHeight: 1,
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
  },
};

const tableStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
  },
  headerRow: {
    background: colors.offWhite,
    borderBottom: '2px solid ' + colors.border,
  },
  th: {
    padding: '8px 14px',
    textAlign: 'left',
    color: colors.textMuted,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '8px 14px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid ' + colors.offWhite,
  },
};
