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
