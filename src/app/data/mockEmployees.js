/**
 * Mock Employee Data — Phase 1
 *
 * This list simulates the names extracted from the uploaded Excel schedule.
 * In Phase 2, this will be replaced by a Firestore query that reads employee
 * names parsed from the most recently uploaded schedule file.
 *
 * Names are sorted alphabetically to match the wireframe list order.
 * The "(Flex)" suffix matches how names appear on the physical printed schedule.
 */

const mockEmployees = [
  { id: 'alexis-b',   name: 'Alexis B.'          },
  { id: 'angela-h',   name: 'Angela H. (Flex)'    },
  { id: 'angela-l',   name: 'Angela L. (Flex)'    },
  { id: 'brianna-w',  name: 'Brianna W.'          },
  { id: 'catlyn-l',   name: 'Catlyn L. (Flex)'    },
  { id: 'gisela-m',   name: 'Gisela M. (Flex)'    },
  { id: 'hannah-r',   name: 'Hannah R. (Flex)'    },
  { id: 'kayle-d',    name: 'Kayle D.'            },
  { id: 'lockett-s',  name: 'Lockett S.'          },
  { id: 'marcus-t',   name: 'Marcus T.'           },
  { id: 'stephanie-r',name: 'Stephanie R.'        },
  { id: 'tanya-m',    name: 'Tanya M.'            },
];

export default mockEmployees;