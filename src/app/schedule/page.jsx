'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EmployeePageHeader from '@/features/employee/EmployeePageHeader';
import BottomNav from '@/features/employee/BottomNav';
import { LockIcon } from '@/components/ui/Icon';
import mockSchedule from '@/data/mockSchedule';
import colors from '@/styles/colors';

/**
 * SchedulePage — Screen 3: My Schedule
 * Route: /schedule
 *
 * Employee's primary screen. Shows the current week schedule with a
 * tabbed day selector. Tapping a day reveals that day's room, hours,
 * and any special notes (Breaker Shift, CLOSED, etc.).
 *
 * Phase 1: Renders mock data from mockSchedule.js
 * Phase 2: Fetch from Firestore using the authenticated user's uid
 *          and the current week's document id.
 */
export default function SchedulePage() {
  const router = useRouter();

  // Default to Monday (index 0) on load
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const { employee, weekLabel, weekNumber, days } = mockSchedule;
  const activeDay = days[activeDayIndex];

  return (
    <main style={styles.main}>

      {/* ── Shared header with day tabs passed as children ── */}
      <EmployeePageHeader
        name={employee.name}
        initials={employee.initials}
        weekLabel={weekLabel}
        group={employee.group}
        onAvatarClick={() => router.push('/profile')}
      >
        <DayTabBar
          days={days}
          activeDayIndex={activeDayIndex}
          onSelect={setActiveDayIndex}
        />
      </EmployeePageHeader>

      {/* ── Day content ── */}
      <div style={styles.content}>
        {activeDay.closed
          ? <ClosedDayContent day={activeDay} />
          : <ActiveDayContent day={activeDay} weekNumber={weekNumber} />
        }
      </div>

      {/* ── Shared bottom nav ── */}
      <BottomNav active="schedule" />

    </main>
  );
}

// ─── DayTabBar ────────────────────────────────────────────────────────────────
/**
 * Horizontal tab row showing MON–FRI with date numbers.
 * Active tab: white text + red underline indicator.
 * Closed days: small red dot below the date number.
 * Local to this screen — only Schedule uses day tabs.
 */
function DayTabBar({ days, activeDayIndex, onSelect }) {
  return (
    <div style={tabStyles.bar} role="tablist" aria-label="Day selector">
      {days.map((day, i) => {
        const isActive = activeDayIndex === i;
        return (
          <button
            key={day.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`day-panel-${day.id}`}
            onClick={() => onSelect(i)}
            style={tabStyles.tab}
          >
            <span style={{
              ...tabStyles.shortLabel,
              color: isActive ? colors.red : 'rgba(255, 255, 255, 0.45)',
            }}>
              {day.short}
            </span>

            <span style={{
              ...tabStyles.dateNumber,
              color: isActive ? colors.white : 'rgba(255, 255, 255, 0.45)',
            }}>
              {day.date}
            </span>

            {/* Closed day indicator dot */}
            {day.closed && (
              <div style={tabStyles.closedDot} aria-hidden="true" />
            )}

            {/* Active underline */}
            {isActive && (
              <div style={tabStyles.activeBar} aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── ClosedDayContent ─────────────────────────────────────────────────────────
/**
 * Shown when the selected day is closed (CDC closed or employee day off).
 * Centered layout with lock icon and closed badge.
 */
function ClosedDayContent({ day }) {
  return (
    <div
      style={closedStyles.container}
      role="tabpanel"
      id={`day-panel-${day.id}`}
      aria-label={`${day.label} — closed`}
    >
      <div style={closedStyles.iconWrapper}>
        <LockIcon color={colors.red} size={28} />
      </div>

      <h2 style={closedStyles.heading}>CDC Closed</h2>

      <p style={closedStyles.subtext}>
        No shift scheduled for {day.label}.
      </p>

      <span style={closedStyles.badge}>
        CLOSED · {day.short} Jun {day.date}
      </span>
    </div>
  );
}

// ─── ActiveDayContent ─────────────────────────────────────────────────────────
/**
 * Shown for a normal working day.
 * Displays classroom, shift hours with progress bar, and date.
 * Breaker Shift days get a purple classroom card variant.
 */
function ActiveDayContent({ day, weekNumber }) {
  const isBreaker = day.note === 'Breaker Shift';

  // Calculate shift length in minutes for the progress bar
  const shiftMinutes = calcShiftMinutes(day.start, day.end);
  // Progress bar fills relative to a 10-hour (600 min) max shift
  const progressPercent = Math.min(100, (shiftMinutes / 600) * 100);
  const shiftDurationLabel = formatShiftDuration(shiftMinutes);

  return (
    <div
      role="tabpanel"
      id={`day-panel-${day.id}`}
      aria-label={`${day.label} schedule`}
      style={activeStyles.container}
    >

      {/* Classroom card — purple variant for Breaker Shift */}
      <div style={{
        ...activeStyles.classroomCard,
        background:   isBreaker ? colors.purpleLight : colors.white,
        borderColor:  isBreaker ? colors.purpleBorder : colors.border,
      }}>
        <p style={activeStyles.cardLabel}>Classroom</p>
        <p style={activeStyles.classroomName}>{day.room}</p>
        {isBreaker && (
          <span style={activeStyles.breakerBadge}>Breaker Shift</span>
        )}
      </div>

      {/* Shift hours card — royal blue with red progress bar */}
      <div style={activeStyles.hoursCard}>
        <p style={activeStyles.hoursLabel}>Shift Hours</p>
        <p style={activeStyles.hoursTime}>
          {day.start}
          <span style={activeStyles.hoursDash}> – </span>
          {day.end}
        </p>

        {/* Progress bar */}
        <div style={activeStyles.progressTrack} aria-hidden="true">
          <div style={{
            ...activeStyles.progressFill,
            width: `${progressPercent}%`,
          }} />
        </div>

        <p style={activeStyles.shiftDuration}>{shiftDurationLabel}</p>
      </div>

      {/* Date chip */}
      <div style={activeStyles.dateChip}>
        <p style={activeStyles.dateChipLabel}>Date</p>
        <p style={activeStyles.dateChipValue}>{day.full}</p>
        <span style={activeStyles.weekBadge}>Week {weekNumber}</span>
      </div>

    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns shift length in minutes from "HH:MM" start/end strings. */
function calcShiftMinutes(start, end) {
  if (!start || !end) return 0;
  const toMins = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  return toMins(end) - toMins(start);
}

/** Returns a human-readable duration string, e.g. "10h shift" or "9h 30m shift" */
function formatShiftDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const mins  = totalMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m shift` : `${hours}h shift`;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  main: {
    minHeight: '100dvh',
    maxWidth: 480,
    margin: '0 auto',
    background: colors.offWhite,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 13,
    overflowY: 'auto',
  },
};

const tabStyles = {
  bar: {
    display: 'flex',
  },
  tab: {
    flex: 1,
    padding: '10px 4px 12px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
  },
  shortLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 900,
    lineHeight: 1.1,
  },
  closedDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: colors.red,
    marginTop: 3,
  },
  activeBar: {
    position: 'absolute',
    bottom: 0,
    left: '12%',
    right: '12%',
    height: 3,
    background: colors.red,
    borderRadius: '3px 3px 0 0',
  },
};

const closedStyles = {
  container: {
    flex: 1,
    background: colors.white,
    borderRadius: 18,
    border: `2px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '44px 20px',
    gap: 14,
    minHeight: 260,
  },
  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    background: colors.redLight,
    border: `2px solid ${colors.redBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 800,
    color: colors.textPrimary,
  },
  subtext: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 1.7,
  },
  badge: {
    background: colors.redLight,
    color: colors.red,
    border: `2px solid ${colors.redBorder}`,
    padding: '5px 16px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
};

const activeStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 13,
  },

  // Classroom card
  classroomCard: {
    borderRadius: 16,
    border: '2px solid',
    padding: '18px 20px',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 7,
  },
  classroomName: {
    fontSize: 28,
    fontWeight: 900,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  breakerBadge: {
    display: 'inline-block',
    marginTop: 11,
    background: colors.purple,
    borderRadius: 20,
    padding: '4px 14px',
    fontSize: 11,
    fontWeight: 800,
    color: colors.white,
    letterSpacing: 0.3,
  },

  // Hours card
  hoursCard: {
    background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.blueDark} 100%)`,
    borderRadius: 16,
    padding: '18px 20px',
    boxShadow: `0 6px 20px rgba(37, 99, 235, 0.30)`,
  },
  hoursLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 7,
  },
  hoursTime: {
    fontSize: 32,
    fontWeight: 900,
    color: colors.white,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: -1,
  },
  hoursDash: {
    fontSize: 20,
    opacity: 0.4,
    fontWeight: 300,
  },
  progressTrack: {
    marginTop: 12,
    height: 5,
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: colors.red,
    borderRadius: 3,
  },
  shiftDuration: {
    marginTop: 6,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Date chip
  dateChip: {
    background: colors.white,
    border: `2px solid ${colors.border}`,
    borderRadius: 12,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateChipLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    width: '100%',
    marginBottom: 2,
  },
  dateChipValue: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.textPrimary,
  },
  weekBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.blue,
  },
};