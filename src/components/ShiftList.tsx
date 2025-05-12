'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ShiftList() {
  const [shifts, setShifts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'shifts'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShifts(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid gap-6">
      {shifts.length === 0 ? (
        <p className="text-gray-500 text-center">No shifts added yet.</p>
      ) : (
        shifts.map((shift) => (
          <div
            key={shift.id}
            className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 transition hover:shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-800">{shift.employee}</h3>
              <span className="text-sm text-gray-500">{shift.date}</span>
            </div>
            <div className="text-sm text-gray-700">
              <p><strong>Start:</strong> {shift.start || '—'}</p>
              <p><strong>End:</strong> {shift.end || '—'}</p>
              {shift.notes && (
                <p className="mt-2 text-gray-500 italic">Notes: {shift.notes}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
