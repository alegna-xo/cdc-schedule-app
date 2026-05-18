'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import ExcelUploader from '@/components/ExcelUploader';
import {
  collection,
  getDocs,
  addDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';


export default function AdminDashboard() {
  const { role, loading } = useUserRole();
  const router = useRouter();
  const [parsedData, setParsedData] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (role !== 'admin') router.push('/schedule');
  }, [role, loading, router]);

  const saveScheduleToFirebase = async (excelData) => {
  const headers = excelData[0];
  const rows = excelData.slice(1);

  const userSnapshot = await getDocs(collection(db, 'users'));
  const users = userSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // go to Monday

  for (const row of rows) {
    const name = row[0];
    if (!name || typeof name !== 'string') continue;

    const matchedUser = users.find(
      (u) => u.name?.toLowerCase().trim() === name.toLowerCase().trim()
    );

    if (!matchedUser) {
      console.warn(`No match found for: ${name}`);
      continue;
    }

    for (let i = 0; i < weekdays.length; i++) {
      const shiftInfo = row[i + 1];
      if (!shiftInfo || shiftInfo.toLowerCase().includes('off')) continue;

      const shiftDate = new Date(startOfWeek);
      shiftDate.setDate(startOfWeek.getDate() + i);

      await addDoc(collection(db, `users/${matchedUser.id}/schedules`), {
        date: shiftDate.toISOString().split('T')[0],
        raw: shiftInfo,
        uploadedAt: new Date().toISOString(),
      });

      console.log(`✅ Wrote schedule for ${matchedUser.name} on ${weekdays[i]}`);
    }
  }

  alert('✅ Schedule successfully uploaded to user profiles!');
};


  
  const handleDataParsed = async (data) => {
  setParsedData(data);
  console.log("Parsed Excel Data:", data);
  await saveScheduleToFirebase(data);
};


  return (
    <main className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-blue-800 text-center">
          Upload Weekly Flex Schedule
        </h1>

        <ExcelUploader onDataParsed={handleDataParsed} />

        {parsedData.length > 0 && (
          <div className="bg-white border rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Schedule Preview</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
                  <tr>
                    {parsedData[0]?.map((header, idx) => (
                      <th key={idx} className="px-4 py-2 border">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(1, 6).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 border whitespace-pre-wrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs mt-2 text-gray-500">
                Showing first 5 rows for preview.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
