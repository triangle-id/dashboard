import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE = 'session';
const ALG = 'HS256';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(s);
}

export type SessionPayload = { employerId: number };

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ employerId: payload.employerId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const employerId = Number(payload.employerId);
    if (!Number.isFinite(employerId)) return null;
    return { employerId };
  } catch {
    return null;
  }
}
