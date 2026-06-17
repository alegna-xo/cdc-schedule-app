'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/features/employee/BottomNav';
import { PhotoIcon } from '@/components/ui/Icon';
import mockSchedule from '@/data/mockSchedule';
import colors from '@/styles/colors';

/**
 * ProfilePage - Screen 5: My Profile
 * Route: /profile
 *
 * Displays the employee's account information.
 * Allows profile photo upload from device gallery.
 * Provides logout and wrong-account reset actions.
 *
 * Phase 1: Photo preview is local state only (does not persist on refresh).
 *          Logout redirects to /login.
 *          Wrong account redirects to /onboarding.
 *
 * Phase 2:
 *   - Photo uploads to Firebase Storage, URL saved to Firestore user doc.
 *   - Logout calls Firebase signOut() then redirects to /login.
 *   - Employee data pulled from authenticated Firestore user doc.
 */
export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [photoURL, setPhotoURL] = useState(null);

  const { employee } = mockSchedule;

  // Mock profile data - Phase 2: pull from Firestore user document
  const profile = {
    name:         employee.name,
    initials:     employee.initials,
    email:        'angela.l@gmail.com',
    role:         'Flex Employee',
    group:        employee.group,
    accountSince: 'June 14, 2025',
  };

  // Phase 1: preview selected photo locally using object URL
  // Phase 2: upload to Firebase Storage, save URL to Firestore
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoURL(url);
  }

  // Phase 1: redirect to /login
  // Phase 2: await signOut(auth); router.push('/login');
  function handleLogout() {
    router.push('/login');
  }

  // Resets name claim - routes back to /onboarding
  function handleReclaim() {
    router.push('/onboarding');
  }

  return (
    <main style={styles.main}>

      {/* ── Profile Header ── */}
      <div style={styles.header}>
        <p style={styles.headerEyebrow}>MY PROFILE</p>

        <div style={styles.headerBody}>
          {/* Avatar with photo upload */}
          <div style={styles.avatarWrapper}>
            <div style={styles.avatar}>
              {photoURL
                ? <img src={photoURL} alt="Profile" style={styles.avatarImage} />
                : <span style={styles.avatarInitials}>{profile.initials}</span>
              }
            </div>

            {/* Photo upload trigger */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={styles.photoButton}
              aria-label="Upload profile photo"
            >
              <PhotoIcon color={colors.blue} size={12} />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={styles.hiddenInput}
              aria-hidden="true"
            />
          </div>

          {/* Name and email */}
          <div style={styles.nameBlock}>
            <h1 style={styles.headerName}>{profile.name}</h1>
            <p style={styles.headerEmail}>{profile.email}</p>
            <p style={styles.headerHint}>Tap the icon to update photo</p>
          </div>
        </div>
      </div>

      {/* ── Info Cards ── */}
      <div style={styles.body}>
        {[
          { label: 'Name on Schedule', value: profile.name    },
          { label: 'Gmail Account',    value: profile.email   },
          { label: 'Role',             value: profile.role    },
          { label: 'Schedule Group',   value: profile.group   },
          { label: 'Account Created',  value: profile.accountSince },
        ].map(row => (
          <div key={row.label} style={styles.infoCard}>
            <p style={styles.infoLabel}>{row.label}</p>
            <p style={styles.infoValue}>{row.value}</p>
          </div>
        ))}

        {/* ── Wrong account reset ── */}
        <div style={styles.reclaimBox}>
          <p style={styles.reclaimTitle}>Wrong account?</p>
          <p style={styles.reclaimBody}>
            If you claimed the wrong name by mistake, you can reset and pick again.
          </p>
          <button onClick={handleReclaim} style={styles.reclaimButton}>
            Not me — re-claim name
          </button>
        </div>

        {/* ── Logout ── */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          Log Out
        </button>

      </div>

      {/* ── Bottom Nav ── */}
      <BottomNav active="profile" />

    </main>
  );
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------
const styles = {
  main: {
    minHeight: '100dvh',
    maxWidth: 480,
    margin: '0 auto',
    background: colors.offWhite,
    display: 'flex',
    flexDirection: 'column',
  },

  // Header
  header: {
    background: 'linear-gradient(150deg, ' + colors.blue + ' 0%, ' + colors.blueDark + ' 100%)',
    padding: '20px 20px 24px',
  },
  headerEyebrow: {
    fontSize: 9,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  headerBody: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },

  // Avatar
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    background: 'rgba(255,255,255,0.2)',
    border: '3px solid rgba(255,255,255,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: 800,
    color: colors.white,
    letterSpacing: 0.5,
  },
  photoButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    background: colors.white,
    border: '2px solid ' + colors.blue,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  hiddenInput: {
    display: 'none',
  },

  // Name block
  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  headerName: {
    fontSize: 20,
    fontWeight: 900,
    color: colors.white,
    lineHeight: 1.1,
  },
  headerEmail: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  headerHint: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 4,
  },

  // Body
  body: {
    flex: 1,
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    overflowY: 'auto',
  },

  // Info cards
  infoCard: {
    background: colors.white,
    border: '1.5px solid ' + colors.border,
    borderRadius: 12,
    padding: '13px 16px',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.textPrimary,
  },

  // Wrong account reset
  reclaimBox: {
    background: colors.redLight,
    border: '2px solid ' + colors.redBorder,
    borderRadius: 12,
    padding: '14px 16px',
    marginTop: 4,
  },
  reclaimTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.redDark,
    marginBottom: 4,
  },
  reclaimBody: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 1.6,
    marginBottom: 10,
  },
  reclaimButton: {
    width: '100%',
    padding: '10px',
    borderRadius: 8,
    background: colors.red,
    color: colors.white,
    border: 'none',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // Logout
  logoutButton: {
    width: '100%',
    padding: '13px',
    borderRadius: 12,
    background: colors.white,
    color: colors.textMuted,
    border: '1.5px solid ' + colors.border,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 4,
  },
};
