'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import colors from '@/styles/colors';
import mockFullSchedule from '@/data/mockFullSchedule';
import mockSchedule from '@/data/mockSchedule';

/**
 * EmployeeEditorPage - Screen 9
 * Route: /admin/schedule/[id]
 *
 * Admin edits one employee's schedule for the current week.
 * Each day has editable room, start time, end time, and special note fields.
 * CLOSED / OFF / N/A days dim and disable input fields.
 *
 * Phase 1:
 *   - Employee looked up by id from mockFullSchedule
 *   - Day data loaded from mockSchedule.days (structured mock)
 *   - Save shows a confirmation toast, no persistence
 *
 * Phase 2:
 *   - Fetch employee schedule from Firestore by id + weekId
 *   - Save writes updated day data back to Firestore
 *   - Employee sees changes immediately on their /schedule page
 */
export default function EmployeeEditorPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id;

  // Look up employee name from mock data
  const employee = mockFullSchedule.employees.find(e => e.id === employeeId);
  const employeeName = employee ? employee.name : 'Employee';

  // Phase 1: use structured mockSchedule days for all employees
  // Phase 2: fetch from Firestore using employeeId + current weekId
  const initialDays = mockSchedule.days.map(day => ({
    id:     day.id,
    short:  day.short,
    full:   day.label,
    date:   day.date,
    room:   day.room   || '',
    start:  day.start  || '',
    end:    day.end    || '',
    note:   day.note   || '',
    closed: day.closed,
  }));

  const [days, setDays]     = useState(initialDays);
  const [saved, setSaved]   = useState(false);

  function updateDay(index, field, value) {
    setDays(prev => prev.map((day, i) =>
      i === index ? { ...day, [field]: value } : day
    ));
  }

  // When note changes to a closed type, clear room/time fields
  function handleNoteChange(index, value) {
    const isClosed = ['CLOSED', 'OFF', 'N/A'].includes(value);
    setDays(prev => prev.map((day, i) => {
      if (i !== index) return day;
      return {
        ...day,
        note:   value,
        closed: isClosed,
        room:   isClosed ? '' : day.room,
        start:  isClosed ? '' : day.start,
        end:    isClosed ? '' : day.end,
      };
    }));
  }

  function handleSave() {
    // Phase 2: await updateDoc(Firestore ref, { days })
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDiscard() {
    router.push('/admin/schedule');
  }

  const NOTE_OPTIONS = ['', 'Breaker Shift', 'See Manager', 'CLOSED', 'OFF', 'N/A'];

  return (
    <div style={styles.page}>

      {/* ── Top bar ── */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <button onClick={handleDiscard} style={styles.backButton}>
            ← Full Schedule
          </button>
          <div style={styles.divider} />
          <h1 style={styles.pageTitle}>
            Edit Schedule —{' '}
            <span style={{ color: colors.blue }}>{employeeName}</span>
          </h1>
        </div>

        <div style={styles.topBarRight}>
          {saved && (
            <span style={styles.savedToast}>Changes saved</span>
          )}
          <button onClick={handleDiscard} style={styles.discardButton}>
            Discard
          </button>
          <button onClick={handleSave} style={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Employee info strip ── */}
      <div style={styles.infoStrip}>
        <div style={styles.infoAvatar}>
          {employeeName.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div>
          <p style={styles.infoName}>{employeeName}</p>
          <p style={styles.infoEmail}>{employeeId}@cdceglin.edu</p>
        </div>
        <div style={styles.infoSpacer} />
        {[
          { label: 'Week',  value: 'Jun 16–20, 2025' },
          { label: 'Role',  value: 'Flex' },
        ].map(item => (
          <div key={item.label} style={styles.infoItem}>
            <p style={styles.infoItemLabel}>{item.label}</p>
            <p style={styles.infoItemValue}>{item.value}</p>
          </div>
        ))}
        <div style={styles.liveWarning}>
          Edits go live immediately after saving
        </div>
      </div>

      {/* ── Helper text ── */}
      <p style={styles.helperText}>
        Edit any field below. Changes go live only after you hit{' '}
        <strong>Save Changes</strong>.
      </p>

      {/* ── Day cards ── */}
      <div style={styles.dayList}>
        {days.map((day, i) => {
          const isBreaker = day.note === 'Breaker Shift';
          const isMgr     = day.note === 'See Manager';
          const isClosed  = day.closed;

          const cardBg = isBreaker ? colors.purpleLight
                       : colors.white;

          const cardBorder = isBreaker ? colors.purpleBorder
                           : isMgr     ? colors.redBorder
                           : colors.border;

          return (
            <div
              key={day.id}
              style={{
                ...cardStyles.card,
                background:   cardBg,
                borderColor:  cardBorder,
                opacity:      isClosed ? 0.65 : 1,
              }}
            >
              {/* Card header */}
              <div style={cardStyles.header}>
                <div style={cardStyles.headerLeft}>
                  <div style={{
                    ...cardStyles.dayBadge,
                    background: isClosed  ? colors.offWhite
                              : isBreaker ? colors.purpleLight
                              : colors.blue,
                  }}>
                    <span style={{
                      ...cardStyles.dayBadgeShort,
                      color: isClosed  ? colors.textMuted
                           : isBreaker ? colors.purple
                           : 'rgba(255,255,255,0.7)',
                    }}>
                      {day.short}
                    </span>
                    <span style={{
                      ...cardStyles.dayBadgeDate,
                      color: isClosed  ? colors.textMuted
                           : isBreaker ? colors.purple
                           : colors.white,
                    }}>
                      {day.date}
                    </span>
                  </div>
                  <div>
                    <p style={cardStyles.dayFull}>{day.full}</p>
                    <p style={cardStyles.dayDate}>June {day.date}, 2025</p>
                  </div>
                </div>

                {/* Status badge */}
                {isClosed  && <StatusBadge type="muted"   label={day.note} />}
                {isBreaker && <StatusBadge type="purple"  label="Breaker Shift" />}
                {isMgr     && <StatusBadge type="red"     label="See Manager" />}
              </div>

              {/* Fields */}
              <div style={cardStyles.fields}>

                <div style={cardStyles.fieldGroup}>
                  <label style={cardStyles.fieldLabel}>Room / Location</label>
                  <input
                    value={day.room}
                    onChange={e => updateDay(i, 'room', e.target.value)}
                    disabled={isClosed}
                    placeholder="e.g. 302 Scarlett"
                    style={{
                      ...cardStyles.input,
                      background: isClosed ? colors.offWhite : colors.white,
                      borderColor: day.room && !isClosed ? colors.blue : colors.border,
                    }}
                  />
                </div>

                <div style={cardStyles.fieldGroupSmall}>
                  <label style={cardStyles.fieldLabel}>Start</label>
                  <input
                    value={day.start}
                    onChange={e => updateDay(i, 'start', e.target.value)}
                    disabled={isClosed}
                    placeholder="07:15"
                    style={{
                      ...cardStyles.input,
                      background: isClosed ? colors.offWhite : colors.white,
                    }}
                  />
                </div>

                <div style={cardStyles.fieldGroupSmall}>
                  <label style={cardStyles.fieldLabel}>End</label>
                  <input
                    value={day.end}
                    onChange={e => updateDay(i, 'end', e.target.value)}
                    disabled={isClosed}
                    placeholder="17:15"
                    style={{
                      ...cardStyles.input,
                      background: isClosed ? colors.offWhite : colors.white,
                    }}
                  />
                </div>

                <div style={cardStyles.fieldGroup}>
                  <label style={cardStyles.fieldLabel}>Special Note</label>
                  <select
                    value={day.note}
                    onChange={e => handleNoteChange(i, e.target.value)}
                    style={{
                      ...cardStyles.select,
                      background: isBreaker ? colors.purpleLight
                                : isMgr     ? colors.redLight
                                : colors.white,
                      borderColor: isBreaker ? colors.purpleBorder
                                 : isMgr     ? colors.redBorder
                                 : colors.border,
                    }}
                  >
                    <option value="">— None —</option>
                    {NOTE_OPTIONS.filter(o => o).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// -----------------------------------------------------------------------------
// StatusBadge
// -----------------------------------------------------------------------------
function StatusBadge({ type, label }) {
  const map = {
    purple: { bg: colors.purpleLight, color: colors.purpleDark, bd: colors.purpleBorder },
    red:    { bg: colors.redLight,    color: colors.redDark,    bd: colors.redBorder    },
    muted:  { bg: colors.offWhite,    color: colors.textMuted,  bd: colors.border       },
  };
  const s = map[type] || map.muted;
  return (
    <span style={{
      background:  s.bg,
      color:       s.color,
      border:      '1px solid ' + s.bd,
      padding:     '3px 10px',
      borderRadius: 20,
      fontSize:    10,
      fontWeight:  700,
      letterSpacing: 0.3,
    }}>
      {label}
    </span>
  );
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    height: '100%',
  },

  // Top bar
  topBar: {
    background: colors.white,
    borderBottom: '1.5px solid ' + colors.border,
    padding: '13px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    flexShrink: 0,
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
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
  divider: {
    width: 1,
    height: 16,
    background: colors.border,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: colors.textPrimary,
  },
  savedToast: {
    background: colors.successBg,
    color: colors.success,
    border: '1px solid ' + colors.successBd,
    fontSize: 12,
    fontWeight: 700,
    padding: '6px 14px',
    borderRadius: 8,
  },
  discardButton: {
    padding: '8px 16px',
    border: '1.5px solid ' + colors.border,
    borderRadius: 8,
    background: colors.white,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveButton: {
    padding: '8px 20px',
    border: 'none',
    borderRadius: 8,
    background: colors.blue,
    color: colors.white,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
  },

  // Info strip
  infoStrip: {
    background: colors.blue,
    padding: '11px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
    flexShrink: 0,
  },
  infoAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    background: 'rgba(255,255,255,0.2)',
    border: '1.5px solid rgba(255,255,255,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 800,
    color: colors.white,
    flexShrink: 0,
    letterSpacing: 0.5,
  },
  infoName: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.white,
    lineHeight: 1.2,
  },
  infoEmail: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 1,
  },
  infoSpacer: {
    width: 1,
    height: 26,
    background: 'rgba(255,255,255,0.15)',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  infoItemLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 0.8,
  },
  infoItemValue: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 600,
  },
  liveWarning: {
    marginLeft: 'auto',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 7,
    padding: '5px 12px',
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 600,
  },

  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    padding: '16px 24px 4px',
  },

  dayList: {
    flex: 1,
    overflowY: 'auto',
    padding: '4px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
};

const cardStyles = {
  card: {
    border: '1.5px solid',
    borderRadius: 12,
    padding: '15px 18px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 9,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dayBadgeShort: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 1,
  },
  dayBadgeDate: {
    fontSize: 14,
    fontWeight: 900,
    lineHeight: 1,
    marginTop: 1,
  },
  dayFull: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  dayDate: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  fields: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  fieldGroup: {
    flex: '2 1 130px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  fieldGroupSmall: {
    flex: '1 1 72px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    width: '100%',
    padding: '8px 11px',
    border: '1.5px solid',
    borderRadius: 7,
    fontSize: 13,
    color: colors.textPrimary,
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '8px 11px',
    border: '1.5px solid',
    borderRadius: 7,
    fontSize: 13,
    color: colors.textPrimary,
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
};
