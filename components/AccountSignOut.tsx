'use client';
import { useState } from 'react';
import { accountAuthClient } from '@/lib/account-auth/client';

export function AccountSignOut() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return (
    <>
      <button
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError('');
          try {
            const result = await accountAuthClient.signOut();
            if (result.error) setError('Déconnexion impossible. Réessayez.');
            else window.location.assign('/auth/sign-in');
          } catch {
            setError('Déconnexion impossible. Vérifiez votre connexion.');
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? 'Déconnexion…' : 'Se déconnecter'}
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
