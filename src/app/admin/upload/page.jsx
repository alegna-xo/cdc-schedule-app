'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { WarnIcon } from '@/components/ui/Icon';
import colors from '@/styles/colors';
import { db } from '@/lib/firebase';
import { buildWeekDays, getWeekNumber } from '@/lib/scheduleUtils';

/**
 * UploadPreviewPage - Screen 7
 * Route: /admin/upload
 *
 * Reads parsed schedule from sessionStorage("pendingSchedule").
 * Checks Firestore for a duplicate week before allowing publish.
 * Confirm checkbox + batch Firestore write on publish.
 *
 * Firestore write structure:
 *   schedules/{weekId}                         → week metadata doc (for duplicate detection)
 *   schedules/{weekId}/employees/{scheduleKey} → per-employee schedule
 *
 * Batch limit: 500 ops. At ~88 employees + 1 parent = 89 ops. Safe.
 */
export default function UploadPreviewPage() {
  const router = useRouter();
  const [confirmed,     setConfirmed]     = useState(false);
  const [pending,       setPending]       = useState(null);
  const [isDuplicate,   setIsDuplicate]   = useState(false);
  const [isPublishing,  setIsPublishing]  = useState(false);
  const [publishError,  setPublishError]  = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('pendingSchedule');
    if (!stored) {
      router.push('/admin');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(stored);
    } catch {
      router.push('/admin');
      return;
    }

    setPending(parsed);

    // Check for duplicate week in Firestore
    async function checkDuplicate() {
      try {
        const weekSnap = await getDoc(doc(db, 'schedules', parsed.weekId));
        if (weekSnap.exists()) setIsDuplicate(true);
      } catch (err) {
        console.error('[upload] duplicate check failed:', err);
      }
    }

    checkDuplicate();
  }, [router]);

  async function handlePublish() {
    if (!confirmed || isPublishing || !pending) return;

    setIsPublishing(true);
    setPublishError('');

    try {
      const batch = writeBatch(db);
      const weekNum = getWeekNumber(pending.weekId);

      // Parent week doc — used for duplicate detection on future uploads
      batch.set(doc(db, 'schedules', pending.weekId), {
        weekLabel:     pending.weekLabel,
        weekId:        pending.weekId,
        employeeCount: pending.employeeCount,
        publishedAt:   serverTimestamp(),
      });

      // One doc per employee
      pending.employees.forEach(emp => {
        const empRef = doc(db, 'schedules', pending.weekId, 'employees', emp.scheduleKey);
        batch.set(empRef, {
          name:        emp.name,
          weekLabel:   pending.weekLabel,
          weekId:      pending.weekId,
          weekNumber:  weekNum,
          group:       '',
          days:        buildWeekDays(pending.weekId, emp.days),
          isPublished: true,
          uploadedAt:  serverTimestamp(),
        });
      });

      await batch.commit();
      sessionStorage.removeItem('pendingSchedule');
      router.push('/admin/schedule');
    } catch (err) {
      console.error('[upload] publish failed:', err);
      setPublishError('Publish failed. Check your connection and try again.');
      setIsPublishing(false);
    }
  }

  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  // Derive display values from parsed data
  const weekDetected   = pending?.weekLabel ?? '—';
  const employeesFound = pending?.employeeCount ?? 0;
  const rowsParsed     = (pending?.employeeCount ?? 0) * 5;
  const previewRows    = (pending?.employees ?? []).slice(0, 8).map(emp => ({
    name: emp.name,
    days: emp.days.map(d => d.value),
  }));

  // Loading state while sessionStorage is being read
  if (!pending) {
    return (
      <div style={styles.page}>
        <div style={loadingStyles.container}>
          <div style={loadingStyles.spinner} />
          <p style={loadingStyles.text}>Loading preview…</p>
        </div>
      </div>
    );
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

      {/* ── Duplicate week warning — shown if schedules/{weekId} already exists ── */}
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
          disabled={isPublishing}
        >
          Cancel
        </button>
        <button
          onClick={handlePublish}
          disabled={!confirmed || isPublishing}
          style={{
            ...styles.publishButton,
            background: (confirmed && !isPublishing) ? colors.blue   : colors.border,
            color:      (confirmed && !isPublishing) ? colors.white  : colors.textLight,
            cursor:     (confirmed && !isPublishing) ? 'pointer'     : 'not-allowed',
            boxShadow:  (confirmed && !isPublishing)
              ? '0 2px 8px rgba(37,99,235,0.25)'
              : 'none',
            opacity: isPublishing ? 0.7 : 1,
          }}
        >
          {isPublishing
            ? `Publishing ${employeesFound} employees…`
            : 'Publish Schedule'}
        </button>
      </div>

      {publishError && (
        <p style={styles.publishError}>{publishError}</p>
      )}

    </div>
  );
}

// -----------------------------------------------------------------------------
// Loading state
// -----------------------------------------------------------------------------
const loadingStyles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: '80px 28px',
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid #E5EAFF',
    borderTopColor: '#2563EB',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  text: {
    fontSize: 13,
    color: '#64748B',
  },
};

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
    transition: 'background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s',
  },
  publishError: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'right',
    marginTop: -12,
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
