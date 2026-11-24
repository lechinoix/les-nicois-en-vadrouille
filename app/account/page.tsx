import { redirect } from 'next/navigation';
import { accountAuth, accountAuthConfigured } from '@/lib/account-auth/server';
import { AccountSignOut } from '@/components/AccountSignOut';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  if (!accountAuthConfigured()) redirect('/auth/sign-in');
  const { data, error } = await accountAuth().getSession();
  if (error)
    return (
      <main className="below-header login">
        <h1>Mon compte</h1>
        <p role="alert">
          Connexion temporairement indisponible. Réessayez dans quelques
          instants.
        </p>
      </main>
    );
  if (!data?.user) redirect('/auth/sign-in');
  return (
    <main className="below-header login">
      <h1>Bonjour {data.user.name}</h1>
      <p>{data.user.email}</p>
      <AccountSignOut />
    </main>
  );
}
