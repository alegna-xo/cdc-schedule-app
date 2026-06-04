/**
 * Mock Schedule Data — Phase 1
 *
 * Represents one employee's schedule for the current week.
 * Shape intentionally mirrors what a Firestore document will return in Phase 2
 * so the component needs zero restructuring when real data comes in.
 *
 * Phase 2 replacement:
 *   const schedule = await getDoc(doc(db, 'schedules', weekId, 'employees', uid));
 *
 * note values:
 *   null            — standard shift, no special note
 *   'Breaker Shift' — employee is a flex/breaker that day
 *   'See Manager'   — employee should check with supervisor
 *   'CLOSED'        — CDC is closed, no shift
 *   'OFF'           — employee day off
 *   'N/A'           — not applicable (flex employee not scheduled)
 */

const mockSchedule = {
  weekId:     'week-2025-06-16',
  weekLabel:  'Week of June 16 - 20, 2025',
  weekNumber: 4,

  // Phase 1: toggle to false to preview Screen 4 (No Schedule Yet)
  // Phase 2: this field comes from Firestore, or the document will be null entirely
  isPublished: true,

  employee: {
    id:       'angela-l',
    name:     'Angela L.',
    initials: 'AL',
    group:    'Flex Blue',
  },

  days: [
    {
      id:     'mon',
      short:  'MON',
      label:  'Monday',
      date:   '16',
      full:   'Mon - June 16, 2025',
      room:   '302 Scarlett',
      start:  '07:15',
      end:    '17:15',
      note:   null,
      closed: false,
    },
    {
      id:     'tue',
      short:  'TUE',
      label:  'Tuesday',
      date:   '17',
      full:   'Tue - June 17, 2025',
      room:   '302 Scarlett',
      start:  '07:15',
      end:    '17:15',
      note:   null,
      closed: false,
    },
    {
      id:     'wed',
      short:  'WED',
      label:  'Wednesday',
      date:   '18',
      full:   'Wed - June 18, 2025',
      room:   '402 & 403',
      start:  '09:00',
      end:    '17:15',
      note:   'Breaker Shift',
      closed: false,
    },
    {
      id:     'thu',
      short:  'THU',
      label:  'Thursday',
      date:   '19',
      full:   'Thu - June 19, 2025',
      room:   null,
      start:  null,
      end:    null,
      note:   'CLOSED',
      closed: true,
    },
    {
      id:     'fri',
      short:  'FRI',
      label:  'Friday',
      date:   '20',
      full:   'Fri - June 20, 2025',
      room:   '210 Lockett',
      start:  '07:30',
      end:    '16:30',
      note:   null,
      closed: false,
    },
  ],
};

export default mockSchedule;