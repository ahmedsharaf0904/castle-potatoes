import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simple hardcoded credentials for MVP (replace with actual auth)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@castlepotatoes.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: 'admin',
      email,
    });

    const response = NextResponse.json(
      { message: 'Login successful', user: { email } },
      { status: 200 }
    );

    // Set the auth cookie
    await setAuthCookie(token);

    return response;
  } catch (error) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
