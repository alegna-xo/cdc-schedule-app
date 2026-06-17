'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import EmployeePageHeader from '@/features/employee/EmployeePageHeader';
import BottomNav from '@/features/employee/BottomNav';
import { LockIcon, InboxIcon } from '@/components/ui/Icon';
import colors from '@/styles/colors';
import { auth, db } from '@/lib/firebase';
import { getCurrentWeekId, nameToScheduleKey } from '@/lib/scheduleUtils';

/**
 * SchedulePage - Screens 3 and 4
 * Route: /schedule
 *
 * Screen 3: Full weekly schedule with day tabs (isPublished: true)
 * Screen 4: No Schedule Yet empty state  (isPublished: false / no doc)
 *
 * Firestore query structure:
 *   users/{uid}                          → name, role (employee profile)
 *   schedules/{weekId}/employees/{uid}   → isPublished, weekLabel, weekNumber,
 *                                          weekId, group, days[]
 *
 * weekId is derived from the Monday of the current week: "week-YYYY-MM-DD"
 */
export default function SchedulePage() {
  const router = useRouter();
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchData() {
      try {
        const weekId   = getCurrentWeekId();

        // Fetch user profile first to derive the scheduleKey
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        const userData = userSnap.exists() ? userSnap.data() : null;
        setUserData(userData);

        // scheduleKey must match the key written by the admin upload flow
        const scheduleKey = userData?.name ? nameToScheduleKey(userData.name) : '';
        if (scheduleKey) {
          const schedSnap = await getDoc(
            doc(db, 'schedules', weekId, 'employees', scheduleKey)
          );
          setScheduleData(schedSnap.exists() ? schedSnap.data() : null);
        }
      } catch (err) {
        console.error('[schedule] fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const employee = {
    name:     userData?.name ?? '',
    initials: userData?.name ? getInitials(userData.name) : '?',
    group:    scheduleData?.group ?? '',
  };

  const weekLabel  = scheduleData?.weekLabel  ?? '';
  const weekNumber = scheduleData?.weekNumber ?? '';
  const days       = scheduleData?.days       ?? [];
  const isPublished = scheduleData?.isPublished ?? false;

  const activeDay = days[activeDayIndex];

  // Loading state
  if (loading) {
    return (
      <main style={styles.main}>
        <div style={loadingStyles.container}>
          <div style={loadingStyles.spinner} />
          <p style={loadingStyles.text}>Loading your schedule…</p>
        </div>
      </main>
    );
  }

  // Screen 4 - No Schedule Yet
  if (!isPublished) {
    return (
      <main style={styles.main}>
        <EmployeePageHeader
          name={employee.name}
          initials={employee.initials}
          weekLabel={weekLabel}
          group={employee.group}
          onAvatarClick={() => router.push('/profile')}
        />
        <NoScheduleContent />
        <BottomNav active="schedule" />
      </main>
    );
  }

  // Screen 3 - Full schedule
  return (
    <main style={styles.main}>
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

      <div style={styles.content}>
        {activeDay.closed
          ? <ClosedDayContent day={activeDay} />
          : <ActiveDayContent day={activeDay} weekNumber={weekNumber} />
        }
      </div>

      <BottomNav active="schedule" />
    </main>
  );
}

// -----------------------------------------------------------------------------
// DayTabBar
// Horizontal MON-FRI tab selector. Local to this screen only.
// -----------------------------------------------------------------------------
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
            onClick={() => onSelect(i)}
            style={tabStyles.tab}
          >
            <span style={{
              ...tabStyles.shortLabel,
              color: isActive ? colors.red : 'rgba(255,255,255,0.45)',
            }}>
              {day.short}
            </span>
            <span style={{
              ...tabStyles.dateNumber,
              color: isActive ? colors.white : 'rgba(255,255,255,0.45)',
            }}>
              {day.date}
            </span>
            {day.closed && (
              <div style={tabStyles.closedDot} aria-hidden="true" />
            )}
            {isActive && (
              <div style={tabStyles.activeBar} aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
// ClosedDayContent
// Shown when the selected day is closed (CDC closed or day off).
// -----------------------------------------------------------------------------
function ClosedDayContent({ day }) {
  return (
    <div style={closedStyles.container}>
      <div style={closedStyles.iconWrapper}>
        <LockIcon color={colors.red} size={28} />
      </div>
      <h2 style={closedStyles.heading}>CDC Closed</h2>
      <p style={closedStyles.subtext}>
        No shift scheduled for {day.label}.
      </p>
      <span style={closedStyles.badge}>
        CLOSED - {day.short} Jun {day.date}
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// ActiveDayContent
// Shown for a normal working day. Purple variant for Breaker Shift.
// -----------------------------------------------------------------------------
function ActiveDayContent({ day, weekNumber }) {
  const isBreaker = day.note === 'Breaker Shift';
  const shiftMinutes = calcShiftMinutes(day.start, day.end);
  const progressPercent = Math.min(100, (shiftMinutes / 600) * 100);
  const shiftDurationLabel = formatShiftDuration(shiftMinutes);

  return (
    <div style={activeStyles.container}>
      <div style={{
        ...activeStyles.classroomCard,
        background: isBreaker ? colors.purpleLight : colors.white,
        borderColor: isBreaker ? colors.purpleBorder : colors.border,
      }}>
        <p style={activeStyles.cardLabel}>Classroom</p>
        <p style={activeStyles.classroomName}>{day.room}</p>
        {isBreaker && (
          <span style={activeStyles.breakerBadge}>Breaker Shift</span>
        )}
      </div>

      <div style={activeStyles.hoursCard}>
        <p style={activeStyles.hoursLabel}>Shift Hours</p>
        <p style={activeStyles.hoursTime}>
          {day.start}
          <span style={activeStyles.hoursDash}> - </span>
          {day.end}
        </p>
        <div style={activeStyles.progressTrack} aria-hidden="true">
          <div style={{
            ...activeStyles.progressFill,
            width: progressPercent + '%',
          }} />
        </div>
        <p style={activeStyles.shiftDuration}>{shiftDurationLabel}</p>
      </div>

      <div style={activeStyles.dateChip}>
        <p style={activeStyles.dateChipLabel}>Date</p>
        <p style={activeStyles.dateChipValue}>{day.full}</p>
        <span style={activeStyles.weekBadge}>Week {weekNumber}</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// NoScheduleContent - Screen 4
// Shown when isPublished is false or no Firestore doc exists for this week.
// -----------------------------------------------------------------------------
function NoScheduleContent() {
  return (
    <div style={noSchedStyles.container}>
      <div style={noSchedStyles.iconWrapper}>
        <InboxIcon color={colors.textLight} size={40} />
      </div>
      <div style={noSchedStyles.textBlock}>
        <h2 style={noSchedStyles.heading}>No Schedule Yet</h2>
        <p style={noSchedStyles.subtext}>
          Your schedule for this week has not been posted yet. Check back soon.
        </p>
      </div>
      <div style={noSchedStyles.refreshPrompt}>
        <p style={noSchedStyles.refreshText}>Pull down to refresh</p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function calcShiftMinutes(start, end) {
  if (!start || !end) return 0;
  const toMins = (t) => {
    const parts = t.split(':').map(Number);
    return parts[0] * 60 + parts[1];
  };
  return toMins(end) - toMins(start);
}

function formatShiftDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (mins > 0) return hours + 'h ' + mins + 'm shift';
  return hours + 'h shift';
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const loadingStyles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    minHeight: '100dvh',
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid ' + colors.border,
    borderTopColor: colors.blue,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  text: {
    fontSize: 13,
    color: colors.textMuted,
  },
};

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

const noSchedStyles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 28px',
    gap: 18,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    background: colors.white,
    border: '2px solid ' + colors.border,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 800,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 1.7,
  },
  refreshPrompt: {
    background: colors.purpleLight,
    border: '1.5px solid ' + colors.purpleBorder,
    borderRadius: 10,
    padding: '11px 18px',
    width: '100%',
    maxWidth: 320,
    textAlign: 'center',
  },
  refreshText: {
    fontSize: 12,
    color: colors.purpleDark,
    fontWeight: 600,
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
    border: '2px solid ' + colors.border,
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
    border: '2px solid ' + colors.redBorder,
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
    border: '2px solid ' + colors.redBorder,
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
  hoursCard: {
    background: 'linear-gradient(135deg, ' + colors.blue + ' 0%, ' + colors.blueDark + ' 100%)',
    borderRadius: 16,
    padding: '18px 20px',
    boxShadow: '0 6px 20px rgba(37,99,235,0.30)',
  },
  hoursLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.5)',
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
    background: 'rgba(255,255,255,0.15)',
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
    color: 'rgba(255,255,255,0.5)',
  },
  dateChip: {
    background: colors.white,
    border: '2px solid ' + colors.border,
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
