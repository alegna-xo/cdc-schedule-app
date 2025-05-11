'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AddShiftForm from './AddShiftForm';

type Shift = {
  id: string;
  employee: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export default function ShiftList() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShifts = async () => {
    const snapshot = await getDocs(collection(db, 'shifts'));
    const shiftsData: Shift[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Shift[];

    setShifts(shiftsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  if (loading) return <p>Loading shifts...</p>;

  return (
    <div className="mt-6">
      <AddShiftForm onShiftAdded={fetchShifts} />

      <h2 className="text-xl font-bold mb-2 mt-8">Weekly Shifts</h2>
      <table className="w-full border border-gray-300 text-sm text-left table-fixed">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Notes</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.id}>
              <td className="p-2 border">{shift.employee || '-'}</td>
              <td className="p-2 border">{shift.date || '-'}</td>
              <td className="p-2 border">{shift.startTime || '-'}</td>
              <td className="p-2 border">{shift.endTime || '-'}</td>
              <td className="p-2 border">{shift.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
