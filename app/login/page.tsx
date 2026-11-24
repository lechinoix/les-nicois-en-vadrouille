'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
        <Label htmlFor="editor-password" className="mb-2">
          Mot de passe
        </Label>
        <Input
          id="editor-password"
          autoComplete="current-password"
          name="password"
          type="password"
          required
        />
        <p>
          <Button type="submit">Se connecter</Button>
        </p>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </main>
  );
}
