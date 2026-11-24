'use client';
import { useState } from 'react';
export default function Login() {
  const [error, setError] = useState('');
  return (
    <main className="below-header login">
      <h1>Connexion à l’éditeur</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          try {
            const r = await fetch('/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: data.get('password') }),
            });
            if (!r.ok) throw new Error((await r.json()).error);
            location.href = '/editor';
          } catch (e) {
            setError(String(e));
          }
        }}
      >
        <label>
          Mot de passe
          <input
            autoComplete="current-password"
            name="password"
            type="password"
            required
          />
        </label>
        <p>
          <button>Se connecter</button>
        </p>
        <p role="alert">{error}</p>
      </form>
    </main>
  );
}
