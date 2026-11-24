import { accountAuth, accountAuthConfigured } from '@/lib/account-auth/server';

export async function GET() {
  const headers = { 'Cache-Control': 'private, no-store' };
  if (!accountAuthConfigured())
    return Response.json(
      { error: 'Connexion indisponible' },
      { status: 503, headers },
    );
  const { data, error } = await accountAuth().getSession();
  if (error)
    return Response.json(
      { error: 'Connexion indisponible' },
      { status: 503, headers },
    );
  if (!data?.user)
    return Response.json(
      { error: 'Connexion requise' },
      { status: 401, headers },
    );
  const { id, name, email, emailVerified } = data.user;
  return Response.json(
    { user: { id, name, email, emailVerified } },
    { headers },
  );
}
