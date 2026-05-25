'use client';

import { useRouter } from 'next/navigation';
import CDCShield from '@/components/ui/CDCShield';
import { GoogleIcon } from '@/components/ui/Icon';
import colors from '@/styles/colors';

/**
 * LoginPage — Screen 1
 *
 * Single entry point for all users.
 * In Phase 1: "Sign in with Google" is a mock — routes to /onboarding.
 * In Phase 2: Google OAuth will determine role and route accordingly:
 *   - Admin email  → /admin
 *   - First-time   → /onboarding
 *   - Returning    → /schedule
 */
export default function LoginPage() {
  const router = useRouter();

  // Phase 1 mock — no real auth yet
  // Phase 2: replace with Firebase Google OAuth
  function handleSignIn() {
    router.push('/onboarding');
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
          onClick={handleSignIn}
          style={styles.googleButton}
          aria-label="Sign in with Google"
        >
          <GoogleIcon size={20} />
          <span>Sign in with Google</span>
        </button>

        <p style={styles.helperText}>Use your CDC work Gmail account</p>

        <div style={styles.divider} />

        {/* First-time callout */}
        <div style={styles.firstTimeBox}>
          <p style={styles.firstTimeHeading}>First time logging in?</p>
          <p style={styles.firstTimeBody}>
            One-time simple sign in process for first-time users.
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>CDC · Eglin AFB · Dept. of the Air Force</p>
      </footer>
    </main>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// Kept co-located with the component for now.
// When the design system grows, these move to a shared stylesheet.

const styles = {
  main: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    background: colors.white,
    maxWidth: 480,
    margin: '0 auto',
  },

  // Header — royal blue gradient, shield + title
  header: {
    background: `linear-gradient(150deg, ${colors.blue} 0%, ${colors.blueDark} 100%)`,
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
    color: 'rgba(255, 255, 255, 0.65)',
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
    border: `2px solid ${colors.border}`,
    borderRadius: 14,
    background: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    fontSize: 15,
    fontWeight: 700,
    color: colors.textPrimary,
    boxShadow: '0 2px 12px rgba(37, 99, 235, 0.1)',
    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
  },

  helperText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textLight,
    marginTop: -8,
  },

  divider: {
    borderTop: `1.5px solid ${colors.border}`,
  },

  // First-time callout — purple
  firstTimeBox: {
    background: colors.purpleLight,
    border: `2px solid ${colors.purpleBorder}`,
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

  // Footer
  footer: {
    padding: '10px 26px 20px',
    textAlign: 'center',
    borderTop: `1px solid ${colors.border}`,
  },
  footerText: {
    fontSize: 10,
    color: colors.textLight,
  },
};
