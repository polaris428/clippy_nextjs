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

    // Firebase 토큰을 디코드하고, Prisma로 유저 생성 or 조회
    const result = await loginUser(token);

    // ✅ 쿠키 설정 (Next.js 15 기준)
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    // 클라이언트에서 폴더로 redirect할 수 있도록 folderId 포함
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
