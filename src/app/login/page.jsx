'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import CDCShield from '@/components/ui/CDCShield';
import { GoogleIcon } from '@/components/ui/Icon';
import colors from '@/styles/colors';
import { db } from '@/lib/firebase';
import { signInWithGoogle } from '@/lib/auth';

/**
 * LoginPage - Screen 1
 * Route: /login
 *
 * Single entry point for all users.
 * Signs in with Google OAuth, then reads Firestore users/{uid} to route:
 *   - role === 'admin'      → /admin
 *   - nameClaimed === true  → /schedule
 *   - no document           → /onboarding
 *
 * DEV MODE block stays until Firebase user collection is fully seeded.
 */
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogleSignIn() {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithGoogle();
      const uid = result.user.uid;

      const userSnap = await getDoc(doc(db, 'users', uid));

      if (!userSnap.exists()) {
        router.push('/onboarding');
        return;
      }

      const userData = userSnap.data();
      if (userData.role === 'admin') {
        router.push('/admin');
      } else if (userData.nameClaimed === true) {
        router.push('/schedule');
      } else {
        router.push('/onboarding');
      }
    } catch (err) {
      // User closed popup or auth failed — don't treat as fatal
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  }

  function handleEmployeeLogin() {
    router.push('/onboarding');
  }

  function handleAdminLogin() {
    router.push('/admin');
  }

  return (
    <main style={styles.main}>

      {/* ── Header ── */}
      <div style={styles.header}>
        <CDCShield size={72} />
        <div style={styles.headerText}>
          <h1 style={styles.appTitle}>CDC Schedule</h1>
          <p style={styles.appSubtitle}>Eglin AFB · Child Development Center</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={styles.body}>

        <div style={styles.welcomeBlock}>
          <h2 style={styles.welcomeHeading}>Welcome!</h2>
          <p style={styles.welcomeSubtext}>
            Sign in with your CDC work Gmail to view your schedule.
          </p>
        </div>

        {/* Google SSO button */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            ...styles.googleButton,
            ...(loading ? styles.googleButtonLoading : {}),
          }}
          aria-label="Sign in with Google"
          disabled={loading}
        >
          {loading ? (
            <span style={styles.spinner} />
          ) : (
            <GoogleIcon size={20} />
          )}
          <span>{loading ? 'Signing in…' : 'Sign in with Google'}</span>
        </button>

        {error ? (
          <p style={styles.errorText}>{error}</p>
        ) : (
          <p style={styles.helperText}>Use your CDC work Gmail account</p>
        )}

        <div style={styles.divider} />

        {/* First-time callout */}
        <div style={styles.firstTimeBox}>
          <p style={styles.firstTimeHeading}>First time logging in?</p>
          <p style={styles.firstTimeBody}>
            One-time simple sign in process for first-time users.
          </p>
        </div>

        {/* ── DEV MODE — remove before go-live ── */}
        <div style={styles.devBlock}>
          <p style={styles.devLabel}>DEV MODE · Bypass Auth</p>
          <p style={styles.devSubtext}>
            Skip Google sign-in and navigate directly. Remove before go-live.
          </p>
          <div style={styles.devButtons}>
            <button
              onClick={handleEmployeeLogin}
              style={styles.devButtonEmployee}
            >
              Continue as Employee
            </button>
            <button
              onClick={handleAdminLogin}
              style={styles.devButtonAdmin}
            >
              Continue as Admin
            </button>
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>CDC · Eglin AFB · Dept. of the Air Force</p>
      </footer>

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
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
  },

  // Header
  header: {
    background: 'linear-gradient(150deg, ' + colors.blue + ' 0%, ' + colors.blueDark + ' 100%)',
    padding: '44px 28px 36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    textAlign: 'center',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 900,
    color: colors.white,
    letterSpacing: -0.5,
    lineHeight: 1.1,
  },
  appSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 5,
    letterSpacing: 0.3,
  },

  // Body
  body: {
    flex: 1,
    padding: '32px 26px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  welcomeBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  welcomeHeading: {
    fontSize: 22,
    fontWeight: 800,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  welcomeSubtext: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 1.65,
  },

  // Google button
  googleButton: {
    width: '100%',
    padding: '15px 16px',
    border: '2px solid ' + colors.border,
    borderRadius: 14,
    background: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    fontSize: 15,
    fontWeight: 700,
    color: colors.textPrimary,
    boxShadow: '0 2px 12px rgba(37,99,235,0.1)',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  googleButtonLoading: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  spinner: {
    width: 20,
    height: 20,
    border: '2.5px solid ' + colors.border,
    borderTopColor: colors.blue,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  },
  helperText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textLight,
    marginTop: -8,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.red,
    marginTop: -8,
  },
  divider: {
    borderTop: '1.5px solid ' + colors.border,
  },

  // First-time callout
  firstTimeBox: {
    background: colors.purpleLight,
    border: '2px solid ' + colors.purpleBorder,
    borderRadius: 14,
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  firstTimeHeading: {
    fontSize: 13,
    fontWeight: 800,
    color: colors.purpleDark,
  },
  firstTimeBody: {
    fontSize: 12,
    color: '#6B21A8',
    lineHeight: 1.65,
  },

  // Dev mode block
  devBlock: {
    border: '2px dashed ' + colors.borderDark,
    borderRadius: 14,
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    background: colors.offWhite,
  },
  devLabel: {
    fontSize: 10,
    fontWeight: 800,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  devSubtext: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 1.5,
    marginTop: -4,
  },
  devButtons: {
    display: 'flex',
    gap: 10,
  },
  devButtonEmployee: {
    flex: 1,
    padding: '10px 8px',
    borderRadius: 10,
    border: '1.5px solid ' + colors.blueBorder,
    background: colors.blueLight,
    color: colors.blue,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },
  devButtonAdmin: {
    flex: 1,
    padding: '10px 8px',
    borderRadius: 10,
    border: '1.5px solid ' + colors.purpleBorder,
    background: colors.purpleLight,
    color: colors.purpleDark,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },

  // Footer
  footer: {
    padding: '10px 26px 20px',
    textAlign: 'center',
    borderTop: '1px solid ' + colors.border,
  },
  footerText: {
    fontSize: 10,
    color: colors.textLight,
  },
};
