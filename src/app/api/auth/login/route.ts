import { NextRequest, NextResponse } from 'next/server';

import { handleLoginRequest } from '@/lib/usecases/loginFlow';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token)
      return NextResponse.json({ error: 'No token' }, { status: 400 });

    const { user, folders } = await handleLoginRequest(token);

    const res = NextResponse.json({
      user,
      folders,
      folderId: folders?.[0]?.id ?? null,
    });

    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error('🔥 Login error:', err);
    return NextResponse.json(
      { error: 'Login failed', detail: `${err}` },
      { status: 500 }
    );
  }
}
