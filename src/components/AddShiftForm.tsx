'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddShiftForm() {
  const [employee, setEmployee] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await addDoc(collection(db, 'shifts'), {
        employee,
        date,
        start,
        end,
        notes,
      });

      setEmployee('');
      setDate('');
      setStart('');
      setEnd('');
      setNotes('');
    } catch (err) {
      console.error('Error adding shift:', err);
    }

    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        type="text"
        placeholder="Employee Name"
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
        required
        className="border rounded-lg p-2 text-sm focus:outline-blue-500"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border rounded-lg p-2 text-sm focus:outline-blue-500"
      />
      <div className="flex gap-2">
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Start Time"
          className="flex-1 border rounded-lg p-2 text-sm focus:outline-blue-500"
        />
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="End Time"
          className="flex-1 border rounded-lg p-2 text-sm focus:outline-blue-500"
        />
      </div>
      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border rounded-lg p-2 text-sm focus:outline-blue-500"
      />

      <button
        type="submit"
        disabled={saving}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {saving ? 'Saving...' : 'Add Shift'}
      </button>
    </form>
  );
}
