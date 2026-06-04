/**
 * Mock Admin Data — Phase 1
 *
 * Simulates data the admin dashboard reads from Firestore in Phase 2.
 *
 * Phase 2 replacements:
 *   stats         → aggregate queries on the users and schedules collections
 *   uploadHistory → query schedules collection ordered by uploadedAt desc
 *   currentWeek   → derived from current date + schedule document
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
};

export default mockAdminData;