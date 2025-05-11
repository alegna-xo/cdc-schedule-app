'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AddShiftForm({ onShiftAdded }: { onShiftAdded?: () => void }) {
  const [employee, setEmployee] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'shifts'), {
        employee,
        date,
        startTime,
        endTime,
        notes,
      });

      setEmployee('');
      setDate('');
      setStartTime('');
      setEndTime('');
      setNotes('');

      if (onShiftAdded) onShiftAdded();
    } catch (error) {
      console.error('Error adding shift:', error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md mt-6">
      <h2 className="text-lg font-bold">Add New Shift</h2>

      <div>
        <label className="block text-sm font-medium">Employee Name</label>
        <input
          type="text"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Add Shift'}
      </button>
    </form>
  );
}
