/**
 * Mock Admin Data — Phase 1
 *
 * Simulates data the admin screens read from Firestore in Phase 2.
 *
 * Phase 2 replacements:
 *   stats         → aggregate Firestore queries on users + schedules collections
 *   uploadHistory → query schedules collection ordered by uploadedAt desc
 *   uploadPreview → result of parsing the uploaded Excel file
 */

const mockAdminData = {
  currentWeek: 'Week of June 16–20, 2025',

  stats: {
    totalEmployees:  88,
    accountsClaimed: 71,
    unclaimed:       17,
    lastUploadDate:  'Jun 14',
    lastUploadTime:  '10:32 AM',
  },

  uploadHistory: [
    {
      id:         'week-2025-06-16',
      weekLabel:  'June 16–20',
      uploadedAt: 'Jun 14, 10:32 AM',
      status:     'active',
    },
    {
      id:         'week-2025-06-09',
      weekLabel:  'June 9–13',
      uploadedAt: 'Jun 7, 9:15 AM',
      status:     'past',
    },
    {
      id:         'week-2025-06-02',
      weekLabel:  'June 2–6',
      uploadedAt: 'May 31, 11:02 AM',
      status:     'past',
    },
  ],

  // Simulates the result of parsing an uploaded Excel file.
  // Phase 2: this data comes from the Excel parser after file selection.
  uploadPreview: {
    weekDetected:    'Jun 16–20',
    employeesFound:  88,
    rowsParsed:      440,
    isDuplicate:     true, // true = a schedule for this week already exists

    // Preview rows — subset of all 88 employees
    previewRows: [
      {
        name: 'Angela L.',
        days: ['302 / 07:15', '302 / 07:15', '402 Breaker', 'CLOSED', '210 / 07:30'],
      },
      {
        name: 'Catlyn L.',
        days: ['See Mgr', 'See Mgr', 'See Mgr', 'CLOSED', '402 / 10:00'],
      },
      {
        name: 'Gisela M.',
        days: ['07:15–17:15', '302 / 07:15', '302 / 07:15', 'CLOSED', 'Breaker'],
      },
      {
        name: 'Kayle D.',
        days: ['07:00–11:00', '504 / 07:30', '504 / 09:00', 'N/A', 'N/A'],
      },
      {
        name: 'Hannah R.',
        days: ['402 / 09:00', '402 / 09:00', '402 / 09:00', 'CLOSED', 'OFF'],
      },
    ],
  },
};

export default mockAdminData;