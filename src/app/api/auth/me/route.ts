import { NextResponse } from 'next/server';
import { getVerifiedUser } from '@/lib/utils/getVerifiedUser';
import { getFoldersByUserId } from '@/lib/services/folderService';

export async function GET() {
  try {
    // 1️⃣ 토큰 검증 및 유저 조회
    const user = await getVerifiedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2️⃣ 폴더 조회 (서비스 분리)
    const folders = await getFoldersByUserId(user.id);

    return NextResponse.json({ user, folders });
  } catch (err) {
    console.error('🔥 /api/me error:', err);
    return NextResponse.json(
      { error: 'Server error', detail: `${err}` },
      { status: 500 }
    );
  }
}
