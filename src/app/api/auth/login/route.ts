import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/controllers/authController';

export async function POST(req: NextRequest) {
  try {
   
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const result = await loginUser( token);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Login failed', detail: `${err}` }, { status: 500 });
  }
}