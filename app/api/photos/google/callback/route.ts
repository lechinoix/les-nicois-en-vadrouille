import { cookies } from 'next/headers';
import { requireSession, cookieOptions, seal } from '@/lib/auth';
import { endpoint } from '@/lib/http';
import { finishGoogleAuthorization } from '@/lib/photo-imports';
export const maxDuration = 60;
export const GET = endpoint(async (req) => {
  const owner = await requireSession();
  const url = new URL(req.url);
  const { job, token } = await finishGoogleAuthorization(
    url.searchParams.get('state') || '',
    owner,
    url.searchParams.get('code'),
    url.searchParams.has('error'),
  );
  if (token)
    (await cookies()).set('google-token', seal(token), {
      ...cookieOptions,
      maxAge: Math.max(0, Math.floor((token.expiresAt - Date.now()) / 1000)),
    });
  // The callback always continues the same import. On cancellation, return to
  // that exact article; the original editor tab retains its in-memory changes.
  const destination =
    token && job.status === 'selecting' && job.pickerUrl
      ? job.pickerUrl
      : `${process.env.APP_ORIGIN}/editor/${encodeURIComponent(job.articleId)}?photos=resume`;
  return new Response(null, {
    status: 303,
    headers: {
      Location: destination,
      'Cache-Control': 'private, no-store',
      'Referrer-Policy': 'no-referrer',
    },
  });
});
