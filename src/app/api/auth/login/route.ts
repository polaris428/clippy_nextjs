import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/controllers/authController';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    const result = await loginUser(token);

   
    const res = NextResponse.json({ folders: result.folders });
    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: 'Login failed', detail: `${err}` },
      { status: 500 }
    );
  }
}
