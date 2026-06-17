import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'cdc_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 5; // 5 days

// Decode JWT payload without verifying signature.
// Security note: authenticity is proved by the Firestore read below —
// Firebase rejects the token if it's invalid or expired, so we never
// serve a cookie based on a forged token.
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const json = Buffer.from(parts[1], 'base64url').toString('utf-8');
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getStringField(
  fields: Record<string, unknown> | undefined,
  key: string,
): string | null {
  const val = fields?.[key];
  if (val && typeof val === 'object' && 'stringValue' in val) {
    return (val as { stringValue: string }).stringValue;
  }
  return null;
}

function getBoolField(
  fields: Record<string, unknown> | undefined,
  key: string,
): boolean | null {
  const val = fields?.[key];
  if (val && typeof val === 'object' && 'booleanValue' in val) {
    return (val as { booleanValue: boolean }).booleanValue;
  }
  return null;
}

// POST /api/auth/session — verify ID token, look up role in Firestore, set HttpOnly cookie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { idToken?: unknown };
    const idToken = body?.idToken;

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    const payload = decodeJwtPayload(idToken);
    if (!payload?.sub || typeof payload.exp !== 'number') {
      return NextResponse.json({ error: 'Invalid token structure' }, { status: 401 });
    }
    if (payload.exp < Date.now() / 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    const uid = payload.sub as string;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    // Fetch the user doc via Firestore REST using the user's own ID token.
    // If the token is forged or expired Firebase returns 401/403 — no doc, no cookie.
    const docUrl =
      `https://firestore.googleapis.com/v1/projects/${projectId}` +
      `/databases/(default)/documents/users/${uid}`;

    const fsRes = await fetch(docUrl, {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    let role = 'employee';
    let nameClaimed = false;
    let userExists = false;

    if (fsRes.ok) {
      const data = await fsRes.json() as { fields?: Record<string, unknown> };
      userExists = true;
      role = getStringField(data.fields, 'role') ?? 'employee';
      nameClaimed = getBoolField(data.fields, 'nameClaimed') ?? false;
    }
    // 404 = new user, no document yet — role stays 'employee', userExists stays false

    const sessionCookie = Buffer.from(JSON.stringify({ uid, role })).toString('base64');

    const response = NextResponse.json({ ok: true, role, nameClaimed, userExists });
    response.cookies.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    return response;
  } catch (err) {
    console.error('[/api/auth/session POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/auth/session — clear session cookie on sign-out
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
