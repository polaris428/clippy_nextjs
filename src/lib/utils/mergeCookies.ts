import { NextResponse } from 'next/server';

export function mergeCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(cookie => {
    to.cookies.set(cookie);
  });
}
