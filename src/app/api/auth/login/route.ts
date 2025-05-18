import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginUser } from '@/lib/controllers/authController';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    
    const result = await loginUser(token);

   
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, 
    });


    return NextResponse.json({
      user: result.user,
      folders: result.folders,
      folderId: result.folders?.[0]?.id ?? null,
    });
  } catch (err) {
    console.error('🔥 Login error:', err);
    return NextResponse.json(
      { error: 'Login failed', detail: `${err}` },
      { status: 500 }
    );
  }
}
