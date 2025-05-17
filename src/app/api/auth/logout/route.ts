import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies(); 
    cookieStore.delete('session');

  return new Response(JSON.stringify({ success: true }));
}
