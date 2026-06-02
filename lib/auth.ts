import { cookies } from 'next/headers';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dev-secret-key-change-in-production'
);

export interface AuthPayload extends JWTPayload {
  userId: string;
  email: string;
}

export async function createToken(payload: AuthPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as AuthPayload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function getSession(): Promise<AuthPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}
