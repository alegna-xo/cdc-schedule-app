'use client';

type Shift = {
  employee: string;
  date: string;
  start: string;
  end: string;
  notes?: string;
};

const mockShifts: Shift[] = [
  {
    employee: 'Aiden Smith',
    date: 'May 10',
    start: '09:00',
    end: '17:00',
    notes: '',
  },
  // Add more mock data here if needed
];

export default function ScheduleView() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 border-b pb-2">
        Weekly Schedule
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Start Time</th>
              <th className="px-6 py-4">End Time</th>
              <th className="px-6 py-4">Notes</th>
            </tr>
          </thead>
          <tbody>
            {mockShifts.map((shift, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">{shift.employee}</td>
                <td className="px-6 py-4">{shift.date}</td>
                <td className="px-6 py-4">{shift.start}</td>
                <td className="px-6 py-4">{shift.end}</td>
                <td className="px-6 py-4">{shift.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
