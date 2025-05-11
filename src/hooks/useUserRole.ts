import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useUserRole(user: { uid: string } | null) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setRole(null);
      return;
    }

    const fetchRole = async () => {
      console.log('📣 Fetching role for UID:', user.uid);

      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          console.log('🔥 Firestore doc data:', data);
          console.log('✅ Extracted role from Firestore:', data.role);
          setRole(data.role || null);
        } else {
          console.warn('⚠️ No Firestore document found for:', user.uid);
          setRole(null);
        }
      } catch (error) {
        console.error('🔥 Error fetching role:', error);
        setRole(null);
      }

      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return { role, loading };
}

