'use client';

import { useRouter } from 'next/navigation';
import { UploadIcon } from '@/components/ui/Icon';
import mockAdminData from '@/data/mockAdminData';
import colors from '@/styles/colors';

/**
 * AdminDashboardPage - Screen 6
 * Route: /admin
 *
 * Supervisor home screen. Primary action is uploading the weekly schedule.
 * Upload history shows previous weeks at a glance.
 *
 * Phase 2:
 *   - Stats pulled from Firestore aggregate queries
 *   - Upload history queried from schedules collection
 *   - Upload zone triggers real file picker + parsing flow
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentWeek, stats, uploadHistory } = mockAdminData;

  function handleUploadClick() {
    router.push('/admin/upload');
  }

  return (
    <div style={styles.page}>

      {/* ── Page header ── */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Admin Dashboard</h1>
        <p style={styles.pageSubtitle}>{currentWeek}</p>
      </div>

      {/* ── Stats row ── */}
      <div style={styles.statsRow}>
        <StatCard
          value={stats.totalEmployees}
          label="Total Employees"
        />
        <StatCard
          value={stats.accountsClaimed}
          label="Accounts Claimed"
          sub={stats.unclaimed + ' still unclaimed'}
          subColor={colors.warn}
        />
        <StatCard
          value={stats.lastUploadDate}
          label="Last Upload"
          sub={stats.lastUploadTime}
          subColor={colors.textLight}
          smallValue
        />
      </div>

      {/* ── Upload zone ── */}
      <div
        style={styles.uploadZone}
        onClick={handleUploadClick}
        role="button"
        tabIndex={0}
        aria-label="Upload schedule"
        onKeyDown={e => e.key === 'Enter' && handleUploadClick()}
      >
        <div style={styles.uploadIcon}>
          <UploadIcon color={colors.blue} size={40} />
        </div>
        <p style={styles.uploadTitle}>Drag and Drop Schedule Here</p>
        <p style={styles.uploadSubtext}>
          Click to preview before publishing · .xlsx or .xls only
        </p>
        <button
          onClick={e => { e.stopPropagation(); handleUploadClick(); }}
          style={styles.uploadButton}
        >
          Browse Files
        </button>
      </div>

      {/* ── Upload history ── */}
      <div style={styles.historyCard}>
        <div style={styles.historyHeader}>
          <p style={styles.historyTitle}>Upload History</p>
          <p style={styles.historyHint}>Prevents duplicate uploads</p>
        </div>

        {uploadHistory.map((entry, i) => (
          <div
            key={entry.id}
            style={{
              ...styles.historyRow,
              borderBottom: i < uploadHistory.length - 1
                ? '1px solid ' + colors.offWhite
                : 'none',
            }}
          >
            <div>
              <p style={styles.historyWeek}>Week of {entry.weekLabel}</p>
              <p style={styles.historyDate}>Uploaded {entry.uploadedAt}</p>
            </div>
            <StatusBadge status={entry.status} />
          </div>
        ))}
      </div>

    </div>
  );
}

// -----------------------------------------------------------------------------
// StatCard
// -----------------------------------------------------------------------------
function StatCard({ value, label, sub, subColor, smallValue }) {
  return (
    <div style={statStyles.card}>
      <p style={{
        ...statStyles.value,
        fontSize: smallValue ? 20 : 28,
        marginTop: smallValue ? 10 : 8,
      }}>
        {value}
      </p>
      <p style={statStyles.label}>{label}</p>
      {sub && (
        <p style={{ ...statStyles.sub, color: subColor }}>{sub}</p>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// StatusBadge
// -----------------------------------------------------------------------------
function StatusBadge({ status }) {
  const isActive = status === 'active';
  return (
    <span style={{
      ...badgeStyles.base,
      background: isActive ? colors.successBg  : colors.offWhite,
      color:      isActive ? colors.success    : colors.textMuted,
      border:     '1px solid ' + (isActive ? colors.successBd : colors.border),
    }}>
      {isActive ? 'Active' : 'Past'}
    </span>
  );
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const styles = {
  page: {
    padding: '28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    maxWidth: 900,
  },

  pageHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
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
  },

  // Stats
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 14,
  },

  // Upload zone
  uploadZone: {
    background: colors.white,
    border: '2.5px dashed ' + colors.blueBorder,
    borderRadius: 14,
    padding: '36px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  uploadIcon: {
    marginBottom: 4,
  },
  uploadTitle: {
    fontSize: 17,
    fontWeight: 800,
    color: colors.blue,
  },
  uploadSubtext: {
    fontSize: 12,
    color: colors.textMuted,
  },
  uploadButton: {
    marginTop: 8,
    padding: '9px 26px',
    background: colors.blue,
    color: colors.white,
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
  },

  // Upload history
  historyCard: {
    background: colors.white,
    border: '1.5px solid ' + colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  historyHeader: {
    padding: '13px 18px',
    borderBottom: '1px solid ' + colors.offWhite,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  historyHint: {
    fontSize: 11,
    color: colors.textLight,
  },
  historyRow: {
    padding: '12px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyWeek: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.textPrimary,
  },
  historyDate: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
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
    fontWeight: 900,
    color: colors.textPrimary,
    lineHeight: 1,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
  },
  sub: {
    fontSize: 10,
    fontWeight: 600,
    marginTop: 3,
  },
};

const badgeStyles = {
  base: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.2,
    flexShrink: 0,
  },
};
