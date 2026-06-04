'use client';

import { useState, useMemo } from 'react';
import mockRoster from '@/data/mockRoster';
import colors from '@/styles/colors';

/**
 * EmployeeRosterPage - Screen 10
 * Route: /admin/employees
 *
 * Admin views all employees, their account claim status, and manages roster.
 * Includes Add Employee modal for manually onboarding new hires.
 *
 * Phase 1:
 *   - Data from mockRoster.js
 *   - Add/Remove updates local state only (no persistence)
 *   - Invite link and QR code are placeholder buttons
 *
 * Phase 2:
 *   - Read from Firestore users collection
 *   - Add Employee writes new user doc to Firestore
 *   - Remove deletes user doc from Firestore
 *   - Invite link is a real shareable URL with auth token
 *   - QR code generated from invite link
 */
export default function EmployeeRosterPage() {
  const [employees, setEmployees]     = useState(mockRoster.employees);
  const [search, setSearch]           = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Derived counts from current state
  const claimedCount   = employees.filter(e => e.status === 'claimed').length;
  const unclaimedCount = employees.filter(e => e.status === 'unclaimed').length;

  // Client-side search filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(e =>
      e.name.toLowerCase().includes(q) ||
      (e.email && e.email.toLowerCase().includes(q))
    );
  }, [search, employees]);

  // Phase 1: remove from local state
  // Phase 2: delete Firestore user doc, then refetch
  function handleRemove(id) {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }

  // Phase 1: add to local state
  // Phase 2: create Firestore user doc with nameClaimed: true, then refetch
  function handleAddEmployee(name, email) {
    const newEmployee = {
      id:        name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name,
      email,
      status:    'claimed',
      lastLogin: 'Just added',
    };
    setEmployees(prev => [newEmployee, ...prev]);
    setShowAddModal(false);
  }

  return (
    <div style={styles.page}>

      {/* ── Page header ── */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Employee Roster</h1>
          <p style={styles.pageSubtitle}>
            {claimedCount} claimed · {unclaimedCount} unclaimed · {employees.length} total
          </p>
        </div>
        <div style={styles.headerActions}>
          <input
            type="search"
            placeholder="Search name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
            aria-label="Search employees"
          />
          <button
            onClick={() => setShowAddModal(true)}
            style={styles.addButton}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* ── Unclaimed warning banner ── */}
      {unclaimedCount > 0 && (
        <div style={styles.warningBanner}>
          <p style={styles.warningText}>
            <strong>{unclaimedCount} employees</strong> have not claimed their account yet.
          </p>
          <div style={styles.warningActions}>
            <button style={styles.inviteButton}>Copy Invite Link</button>
            <button style={styles.inviteButton}>Show QR Code</button>
          </div>
        </div>
      )}

      {/* ── Roster table ── */}
      <div style={styles.tableCard}>
        <div style={styles.tableScroll}>
          <table style={tableStyles.table}>
            <thead>
              <tr style={tableStyles.headerRow}>
                <th style={{ ...tableStyles.th, textAlign: 'left' }}>Name (on Schedule)</th>
                <th style={{ ...tableStyles.th, textAlign: 'left' }}>Gmail Account</th>
                <th style={tableStyles.th}>Status</th>
                <th style={tableStyles.th}>Last Login</th>
                <th style={tableStyles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                <>
                  {filtered.map((emp, i) => (
                    <tr
                      key={emp.id}
                      style={{ background: i % 2 === 0 ? colors.white : colors.offWhite }}
                    >
                      <td style={{ ...tableStyles.td, fontWeight: 600, textAlign: 'left' }}>
                        {emp.name}
                      </td>
                      <td style={{ ...tableStyles.td, textAlign: 'left', color: emp.email ? colors.textPrimary : colors.textLight, fontSize: 12 }}>
                        {emp.email || '— Not claimed yet —'}
                      </td>
                      <td style={{ ...tableStyles.td }}>
                        <StatusBadge status={emp.status} />
                      </td>
                      <td style={{ ...tableStyles.td, color: colors.textLight, fontSize: 12 }}>
                        {emp.lastLogin}
                      </td>
                      <td style={{ ...tableStyles.td }}>
                        {emp.status === 'claimed' && (
                          <button
                            onClick={() => handleRemove(emp.id)}
                            style={styles.removeButton}
                            aria-label={'Remove ' + emp.name}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!search && (
                    <tr>
                      <td colSpan={5} style={tableStyles.moreRow}>
                        … {mockRoster.totalEmployees - employees.length} more employees not shown in mock data
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                <tr>
                  <td colSpan={5} style={tableStyles.emptyRow}>
                    No employees match &ldquo;{search}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Employee Modal ── */}
      {showAddModal && (
        <AddEmployeeModal
          onAdd={handleAddEmployee}
          onClose={() => setShowAddModal(false)}
        />
      )}

    </div>
  );
}

// -----------------------------------------------------------------------------
// StatusBadge
// -----------------------------------------------------------------------------
function StatusBadge({ status }) {
  const isClaimed = status === 'claimed';
  return (
    <span style={{
      background:   isClaimed ? colors.successBg  : colors.warnBg,
      color:        isClaimed ? colors.success     : colors.warn,
      border:       '1px solid ' + (isClaimed ? colors.successBd : colors.warnBd),
      padding:      '3px 10px',
      borderRadius: 20,
      fontSize:     10,
      fontWeight:   700,
      whiteSpace:   'nowrap',
    }}>
      {isClaimed ? 'Claimed' : 'Unclaimed'}
    </span>
  );
}

// -----------------------------------------------------------------------------
// AddEmployeeModal — Sprint 2 addition
// -----------------------------------------------------------------------------
function AddEmployeeModal({ onAdd, onClose }) {
  const [name,  setName]  = useState('');
  const [email, setEmail] = useState('');

  const isValid = name.trim().length > 0 && email.trim().length > 0;

  function handleSubmit() {
    if (!isValid) return;
    onAdd(name.trim(), email.trim());
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={modalStyles.backdrop}
        aria-hidden="true"
      />

      {/* Modal */}
      <div style={modalStyles.modal} role="dialog" aria-modal="true" aria-label="Add Employee">
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>Add Employee</h2>
          <button onClick={onClose} style={modalStyles.closeButton} aria-label="Close">
            ✕
          </button>
        </div>

        <p style={modalStyles.description}>
          Manually add a new employee. They will be able to log in immediately
          without going through the Name Claim step.
        </p>

        <div style={modalStyles.fields}>
          <div style={modalStyles.fieldGroup}>
            <label style={modalStyles.fieldLabel}>
              Name (as it appears on the schedule)
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Jordan T."
              style={modalStyles.input}
              autoFocus
            />
          </div>

          <div style={modalStyles.fieldGroup}>
            <label style={modalStyles.fieldLabel}>Gmail Address</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. jordan.t@gmail.com"
              type="email"
              style={modalStyles.input}
            />
          </div>
        </div>

        <div style={modalStyles.actions}>
          <button onClick={onClose} style={modalStyles.cancelButton}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            style={{
              ...modalStyles.addButton,
              background:  isValid ? colors.blue    : colors.border,
              color:       isValid ? colors.white   : colors.textLight,
              cursor:      isValid ? 'pointer'      : 'not-allowed',
              boxShadow:   isValid ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
            }}
          >
            Add Employee
          </button>
        </div>
      </div>
    </>
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
  headerActions: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
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
  addButton: {
    padding: '8px 18px',
    background: colors.blue,
    color: colors.white,
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(37,99,235,0.22)',
    whiteSpace: 'nowrap',
  },

  // Warning banner
  warningBanner: {
    background: colors.warnBg,
    border: '1px solid ' + colors.warnBd,
    borderRadius: 10,
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  warningText: {
    fontSize: 12,
    color: colors.warn,
  },
  warningActions: {
    display: 'flex',
    gap: 10,
  },
  inviteButton: {
    fontSize: 11,
    color: colors.blue,
    background: colors.blueLight,
    border: '1px solid ' + colors.blueBorder,
    borderRadius: 6,
    cursor: 'pointer',
    padding: '5px 12px',
    fontWeight: 700,
  },

  // Table
  tableCard: {
    background: colors.white,
    border: '1.5px solid ' + colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableScroll: {
    overflowX: 'auto',
  },

  removeButton: {
    fontSize: 11,
    color: colors.red,
    background: colors.redLight,
    border: '1px solid ' + colors.redBorder,
    borderRadius: 5,
    cursor: 'pointer',
    padding: '3px 10px',
    fontWeight: 600,
  },
};

const tableStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
    minWidth: 640,
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
    padding: '11px 14px',
    textAlign: 'center',
    borderBottom: '1px solid ' + colors.offWhite,
  },
  moreRow: {
    padding: '12px 14px',
    textAlign: 'center',
    color: colors.textLight,
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyRow: {
    padding: '24px 14px',
    textAlign: 'center',
    color: colors.textLight,
    fontSize: 13,
    fontStyle: 'italic',
  },
};

const modalStyles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(17,29,74,0.4)',
    zIndex: 100,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: colors.white,
    borderRadius: 16,
    padding: '28px',
    width: 440,
    maxWidth: 'calc(100vw - 40px)',
    zIndex: 101,
    boxShadow: '0 20px 60px rgba(17,29,74,0.25)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: colors.textPrimary,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    color: colors.textMuted,
    cursor: 'pointer',
    padding: '2px 6px',
    lineHeight: 1,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 24,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid ' + colors.border,
    borderRadius: 8,
    fontSize: 14,
    color: colors.textPrimary,
    outline: 'none',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    padding: '9px 18px',
    border: '1.5px solid ' + colors.border,
    borderRadius: 8,
    background: colors.white,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  addButton: {
    padding: '9px 22px',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    transition: 'background 0.15s ease',
  },
};
