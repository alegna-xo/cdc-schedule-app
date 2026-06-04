/**
 * Mock Employee Roster — Phase 1
 *
 * Represents the full employee account list.
 * Shows claim status, linked Gmail, and last login per employee.
 *
 * Phase 2: Query Firestore users collection.
 *   claimed   → user document exists with nameClaimed: true
 *   unclaimed → name appears in schedule but no matching user document
 *   lastLogin → Firestore user document lastLoginAt timestamp
 */

const mockRoster = {
  totalEmployees:  88,
  claimed:         71,
  unclaimed:       17,

  employees: [
    { id: 'angela-l',   name: 'Angela L.',   email: 'angela.l@gmail.com',    status: 'claimed',   lastLogin: 'Jun 15, 3:42 PM'  },
    { id: 'angela-h',   name: 'Angela H.',   email: 'angela.h@cdceglin.edu', status: 'claimed',   lastLogin: 'Jun 14, 8:20 AM'  },
    { id: 'catlyn-l',   name: 'Catlyn L.',   email: 'catlyn.l@gmail.com',    status: 'claimed',   lastLogin: 'Jun 15, 7:55 AM'  },
    { id: 'gisela-m',   name: 'Gisela M.',   email: null,                    status: 'unclaimed', lastLogin: 'Never'            },
    { id: 'hannah-r',   name: 'Hannah R.',   email: null,                    status: 'unclaimed', lastLogin: 'Never'            },
    { id: 'alexis-b',   name: 'Alexis B.',   email: 'alexis.b@gmail.com',    status: 'claimed',   lastLogin: 'Jun 13, 9:00 AM'  },
    { id: 'kayle-d',    name: 'Kayle D.',    email: null,                    status: 'unclaimed', lastLogin: 'Never'            },
    { id: 'marcus-t',   name: 'Marcus T.',   email: 'marcus.t@gmail.com',    status: 'claimed',   lastLogin: 'Jun 15, 12:01 PM' },
    { id: 'lockett-s',  name: 'Lockett S.',  email: null,                    status: 'unclaimed', lastLogin: 'Never'            },
    { id: 'stephanie-r',name: 'Stephanie R.',email: 'stephanie.r@gmail.com', status: 'claimed',   lastLogin: 'Jun 12, 2:15 PM'  },
  ],
};

export default mockRoster;