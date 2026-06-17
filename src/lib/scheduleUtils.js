const MONTH_ABBRS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const WEEK_DAY_META = [
  { id: 'mon', short: 'MON', label: 'Monday',    abbr: 'Mon' },
  { id: 'tue', short: 'TUE', label: 'Tuesday',   abbr: 'Tue' },
  { id: 'wed', short: 'WED', label: 'Wednesday', abbr: 'Wed' },
  { id: 'thu', short: 'THU', label: 'Thursday',  abbr: 'Thu' },
  { id: 'fri', short: 'FRI', label: 'Friday',    abbr: 'Fri' },
];

/**
 * Returns the ISO date string of the Monday that starts the current week,
 * formatted as the Firestore week document ID: "week-YYYY-MM-DD".
 *
 * Sunday (getDay() === 0) rolls back 6 days to the prior Monday.
 * All other days roll back (dayOfWeek - 1) days.
 */
export function getCurrentWeekId() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, …, 6 = Sat
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(today);
  monday.setDate(today.getDate() + daysToMonday);

  const yyyy = monday.getFullYear();
  const mm = String(monday.getMonth() + 1).padStart(2, '0');
  const dd = String(monday.getDate()).padStart(2, '0');

  return `week-${yyyy}-${mm}-${dd}`;
}

/**
 * Converts an employee display name to a stable Firestore document key.
 * Must be identical in the Excel parser (write) and schedule page (read).
 * "Angela L." → "angela-l"
 */
export function nameToScheduleKey(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * "week-2025-06-16" → "Jun 16–20, 2025"
 * Handles month boundaries (e.g., Jun 30 – Jul 4, 2025).
 */
export function deriveWeekLabel(weekId) {
  const [, yyyy, mm, dd] = weekId.split('-');
  const monday = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const monAbbr = MONTH_ABBRS[monday.getMonth()];
  const friAbbr = MONTH_ABBRS[friday.getMonth()];

  if (monday.getMonth() === friday.getMonth()) {
    return `${monAbbr} ${monday.getDate()}–${friday.getDate()}, ${Number(yyyy)}`;
  }
  return `${monAbbr} ${monday.getDate()} – ${friAbbr} ${friday.getDate()}, ${Number(yyyy)}`;
}

/**
 * Returns the ISO week number for the given weekId.
 * Used as the "Week N" label shown in the employee schedule view.
 */
export function getWeekNumber(weekId) {
  const [, yyyy, mm, dd] = weekId.split('-');
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(
    ((d.getTime() - yearStart.getTime()) / 86400000 - 3 + ((yearStart.getDay() + 6) % 7)) / 7
  );
}

/**
 * Parses a raw Excel cell value into structured day fields.
 * Format-dependent on the CDC schedule spreadsheet conventions.
 *
 * Supported patterns:
 *   "302 / 07:15"           → { room: "302", start: "07:15", ... }
 *   "302 / 07:15-17:15"     → { room: "302", start: "07:15", end: "17:15", ... }
 *   "402 Breaker"           → { room: "402", note: "Breaker Shift", ... }
 *   "CLOSED" / "OFF" / "N/A"→ { closed: true, note: "..." }
 *   "See Mgr"               → { note: "See Mgr", closed: false }
 *   "07:15–17:15"           → { start: "07:15", end: "17:15", room: null }
 */
function parseDayValue(raw) {
  const v = (raw ?? '').trim();

  if (!v || v.toUpperCase() === 'N/A') {
    return { room: null, start: null, end: null, note: 'N/A', closed: true };
  }
  if (v.toUpperCase() === 'CLOSED') {
    return { room: null, start: null, end: null, note: 'CLOSED', closed: true };
  }
  if (v.toUpperCase() === 'OFF') {
    return { room: null, start: null, end: null, note: 'OFF', closed: true };
  }

  // Breaker: "Breaker", "Breaker Shift", "402 Breaker", "402 / Breaker"
  if (/breaker/i.test(v)) {
    const roomMatch = v.match(/^([^/Bb]+?)\s*(?:\/\s*)?[Bb]reaker/);
    const room = roomMatch?.[1]?.trim() || null;
    return { room, start: null, end: null, note: 'Breaker Shift', closed: false };
  }

  // "See Mgr" / "See Manager"
  if (/^see\s/i.test(v)) {
    return { room: null, start: null, end: null, note: v, closed: false };
  }

  // "room / HH:MM" or "room / HH:MM-HH:MM"
  const slashMatch = v.match(/^(.+?)\s*\/\s*(\d{1,2}:\d{2})(?:\s*[-–]\s*(\d{1,2}:\d{2}))?/);
  if (slashMatch) {
    return {
      room:   slashMatch[1].trim(),
      start:  slashMatch[2],
      end:    slashMatch[3] ?? null,
      note:   null,
      closed: false,
    };
  }

  // "HH:MM" or "HH:MM-HH:MM" with no room
  const timeMatch = v.match(/^(\d{1,2}:\d{2})(?:\s*[-–]\s*(\d{1,2}:\d{2}))?$/);
  if (timeMatch) {
    return {
      room:   null,
      start:  timeMatch[1],
      end:    timeMatch[2] ?? null,
      note:   null,
      closed: false,
    };
  }

  // Unrecognized — surface the raw value as the room label so nothing is silently lost
  return { room: v, start: null, end: null, note: null, closed: false };
}

/**
 * Converts raw Excel day values into the full structured day objects that
 * schedule/page.jsx reads from Firestore.
 *
 * @param {string} weekId  - "week-YYYY-MM-DD" (the Monday)
 * @param {Array}  rawDays - [{ day: 'MON', value: '302 / 07:15' }, …]
 * @returns structured day objects with id, short, label, date, full, room, start, end, note, closed
 */
export function buildWeekDays(weekId, rawDays) {
  const [, yyyy, mm, dd] = weekId.split('-');
  const monday = new Date(Number(yyyy), Number(mm) - 1, Number(dd));

  return rawDays.map(({ value }, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const meta      = WEEK_DAY_META[i];
    const monthFull = MONTH_NAMES[d.getMonth()];
    const dateNum   = d.getDate();
    const year      = d.getFullYear();

    return {
      id:    meta.id,
      short: meta.short,
      label: meta.label,
      date:  String(dateNum),
      full:  `${meta.abbr} · ${monthFull} ${dateNum}, ${year}`,
      ...parseDayValue(value),
    };
  });
}
