/**
 * Mock Full Schedule Data — Phase 1
 *
 * Represents the full employee schedule grid for the current week.
 * Shows a subset of employees for demo purposes — real data has 88.
 *
 * Phase 2: Query Firestore schedules/{weekId}/employees collection.
 *
 * day values:
 *   Standard entry  — e.g. '302 / 07:15'
 *   'Breaker'       — flex/breaker shift
 *   'See Mgr'       — check with supervisor
 *   'CLOSED'        — CDC closed
 *   'OFF'           — employee day off
 *   'N/A'           — not applicable
 */

const mockFullSchedule = {
  weekLabel: 'Week of June 16–20, 2025',
  totalEmployees: 88,

  // Each employee has an id used for the /admin/schedule/[id] edit route
  employees: [
    {
      id:   'angela-l',
      name: 'Angela L.',
      days: ['302 / 07:15', '302 / 07:15', '402 Breaker', 'CLOSED', '210 / 07:30'],
    },
    {
      id:   'angela-h',
      name: 'Angela H.',
      days: ['See Mgr', '504 / 07:30', 'See Mgr', 'N/A', 'N/A'],
    },
    {
      id:   'catlyn-l',
      name: 'Catlyn L.',
      days: ['See Mgr', 'See Mgr', 'See Mgr', 'CLOSED', '402 / 10:00'],
    },
    {
      id:   'gisela-m',
      name: 'Gisela M.',
      days: ['07:15–17:15', '302 / 07:15', '302 / 07:15', 'CLOSED', 'Breaker'],
    },
    {
      id:   'hannah-r',
      name: 'Hannah R.',
      days: ['402 / 09:00', '402 / 09:00', '402 / 09:00', 'CLOSED', 'OFF'],
    },
    {
      id:   'alexis-b',
      name: 'Alexis B.',
      days: ['Breaker', 'Breaker', 'Breaker', 'CLOSED', 'Breaker'],
    },
    {
      id:   'kayle-d',
      name: 'Kayle D.',
      days: ['07:00–11:00', '504 / 07:30', '504 / 09:00', 'N/A', 'N/A'],
    },
    {
      id:   'marcus-t',
      name: 'Marcus T.',
      days: ['302 / 07:15', '302 / 07:15', '302 / 07:15', 'CLOSED', '402 / 10:00'],
    },
    {
      id:   'lockett-s',
      name: 'Lockett S.',
      days: ['210 / 09:00', '210 / 09:00', 'OFF', 'CLOSED', '210 / 09:00'],
    },
    {
      id:   'stephanie-r',
      name: 'Stephanie R.',
      days: ['302 / 07:30', '302 / 07:30', '302 / 07:30', 'CLOSED', 'Breaker'],
    },
  ],
};

export default mockFullSchedule;