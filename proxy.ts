import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
// A migration deployment stays private even when the Vercel project is unpaused for checks.
export function proxy(req: NextRequest) {
  if (process.env.MIGRATION_MAINTENANCE !== 'true') return NextResponse.next();
  const expected = process.env.MIGRATION_MAINTENANCE_TOKEN || '',
    provided = req.headers.get('x-migration-token') || '';
  if (
    expected.length >= 32 &&
    Buffer.byteLength(provided) === Buffer.byteLength(expected) &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(provided))
  )
    return NextResponse.next();
  return new NextResponse(
    'Site en maintenance. À bientôt dans les montagnes !',
    {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': '3600',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
}
export const config = { matcher: ['/:path*'] };
