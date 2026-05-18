'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user]);

  useEffect(() => {
    const fetchName = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const savedName = userData.name || '';
          setName(savedName);
          if (savedName) {
            fetchSchedule(savedName);
          }
        }
      }
    };
    fetchName();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      await updateDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
      });
      alert('✅ Name saved! This will match your schedule.');
      fetchSchedule(name.trim());
    } finally {
      setSaving(false);
    }
  };

  const fetchSchedule = async (searchName) => {
    try {
      setLoadingSchedule(true);
      setError('');
      setSchedule([]);

      const userSnapshot = await getDocs(collection(db, 'users'));
      const users = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const matchedUser = users.find(
        (u) => u.name?.toLowerCase().trim() === searchName.toLowerCase().trim()
      );

      if (!matchedUser) {
        setError('⚠️ No schedule found for that name.');
        return;
      }

      const scheduleSnapshot = await getDocs(
        collection(db, `users/${matchedUser.id}/schedules`)
      );

      const fetchedSchedule = scheduleSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSchedule(fetchedSchedule);
    } catch (err) {
      console.error(err);
      setError('Error fetching schedule.');
    } finally {
      setLoadingSchedule(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-xl mx-auto space-y-6 bg-white p-6 shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-blue-800">Set Your Name</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Full Name (as it appears on the schedule):</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {saving ? 'Saving...' : 'Save Name'}
          </button>
        </form>

        {loadingSchedule && <p className="text-gray-500">Loading schedule...</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {schedule.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">This Week</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-700">
              {schedule
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((entry) => (
                  <li key={entry.id} className="flex justify-between border-b pb-2">
                    <span className="font-medium">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                    <span className="whitespace-pre-wrap text-right">{entry.raw}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
