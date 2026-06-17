import * as XLSX from 'xlsx';
import { getCurrentWeekId, nameToScheduleKey, deriveWeekLabel } from './scheduleUtils.js';

const DAY_KEYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

/**
 * Parses a CDC schedule Excel file and returns structured data for preview and Firestore write.
 *
 * Expected layout:
 *   Row 0:  Optional header — e.g. "Name | MON | TUE | WED | THU | FRI"
 *           OR a week label row — e.g. "Week of June 16-20" (any cell)
 *   Row 1+: Employee rows — Column A = name, Columns B-F = day cell values
 *
 * @param {File} file - .xlsx or .xls File object from input or drop event
 * @returns {{ weekLabel, weekId, employees, employeeCount, isDuplicate }}
 */
export async function parseScheduleFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });

  if (!workbook.SheetNames.length) {
    throw new Error('File contains no sheets.');
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // header: 1 → every row is a plain array; defval: '' → empty cells become ''
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (!rows.length) throw new Error('File appears to be empty.');

  // Determine if row 0 is a header or the first data row
  const firstCell = String(rows[0]?.[0] ?? '').toLowerCase().trim();
  const isHeader  = ['name', 'employee', 'employees', 'names', ''].includes(firstCell);
  const dataStart = isHeader ? 1 : 0;

  // Try to pull a human-readable week label from the header row
  let weekLabel = '';
  if (isHeader && rows[0].length) {
    const cells = rows[0].map(c => String(c ?? '').trim()).filter(Boolean);
    weekLabel = cells.find(c => /week|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(c)) ?? '';
  }
  if (!weekLabel) {
    weekLabel = deriveWeekLabel(getCurrentWeekId());
  }

  // Parse employee rows
  const employees = [];
  for (let i = dataStart; i < rows.length; i++) {
    const row  = rows[i];
    const name = String(row[0] ?? '').trim();
    if (!name) continue; // skip blank rows

    const days = DAY_KEYS.map((day, idx) => ({
      day,
      value: String(row[idx + 1] ?? '').trim() || 'N/A',
    }));

    employees.push({
      name,
      scheduleKey: nameToScheduleKey(name),
      days,
    });
  }

  if (!employees.length) {
    throw new Error('No employee rows found. Check that Column A contains employee names.');
  }

  return {
    weekLabel,
    weekId:        getCurrentWeekId(),
    employees,
    employeeCount: employees.length,
    isDuplicate:   false, // checked separately in the upload preview page
  };
}
