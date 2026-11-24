'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { accountAuthClient } from '@/lib/account-auth/client';
import { authErrorCode, authErrorMessage } from '@/lib/account-auth/errors';

export function AccountForm({ mode }: { mode: 'sign-up' | 'sign-in' }) {
  const signup = mode === 'sign-up';
  const inFlight = useRef(false);
  const submittedEmail = useRef('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [notice, setNotice] = useState('');

  function handleFailure(value: unknown) {
    if (
      ['EMAIL_NOT_VERIFIED', 'EMAIL_NOT_CONFIRMED'].includes(
        authErrorCode(value),
      ) &&
      submittedEmail.current
    ) {
      setVerificationEmail(submittedEmail.current);
      return;
    }
    setError(authErrorMessage(value));
  }

  async function run(action: () => Promise<void>) {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError('');
    setNotice('');
    try {
      await action();
    } catch (error) {
      handleFailure(error);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <main className="below-header login">
      <h1>
        {verificationEmail
          ? 'Vérifier votre adresse email'
          : signup
            ? 'Créer un compte'
            : 'Se connecter'}
      </h1>
      {verificationEmail ? (
        <>
          <p>Saisissez le code envoyé à {verificationEmail}.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void run(async () => {
                const result = await accountAuthClient.emailOtp.verifyEmail({
                  email: verificationEmail,
                  otp: String(form.get('code')).trim(),
                });
                if (result.error) {
                  handleFailure(result.error);
                  return;
                }
                window.location.assign('/account');
              });
            }}
          >
            <label>
              Code de vérification
              <input
                name="code"
                autoComplete="one-time-code"
                inputMode="numeric"
                required
                disabled={pending}
              />
            </label>
            <p>
              <button disabled={pending}>
                {pending ? 'Vérification…' : 'Vérifier mon adresse'}
              </button>
            </p>
          </form>
          <button
            disabled={pending}
            onClick={() =>
              void run(async () => {
                const result =
                  await accountAuthClient.emailOtp.sendVerificationOtp({
                    email: verificationEmail,
                    type: 'email-verification',
                  });
                if (result.error) handleFailure(result.error);
                else setNotice('Un nouveau code a été envoyé.');
              })
            }
          >
            Renvoyer le code
          </button>
        </>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void run(async () => {
              const email = String(form.get('email')).trim();
              submittedEmail.current = email;
              const password = String(form.get('password'));
              const result = signup
                ? await accountAuthClient.signUp.email({
                    name: String(form.get('name')).trim(),
                    email,
                    password,
                  })
                : await accountAuthClient.signIn.email({ email, password });
              if (result.error) {
                handleFailure(result.error);
                return;
              }
              if (signup && !result.data?.token) {
                setVerificationEmail(email);
                return;
              }
              // A full navigation reads the new server session instead of a cached signed-out page.
              window.location.assign('/account');
            });
          }}
        >
          {signup && (
            <p>
              <label>
                Nom
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  disabled={pending}
                />
              </label>
            </p>
          )}
          <p>
            <label>
              Adresse email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                disabled={pending}
              />
            </label>
          </p>
          <p>
            <label>
              Mot de passe
              <input
                name="password"
                type="password"
                autoComplete={signup ? 'new-password' : 'current-password'}
                required
                minLength={signup ? 8 : undefined}
                maxLength={128}
                disabled={pending}
              />
            </label>
          </p>
          {signup && <p>Au moins 8 caractères.</p>}
          <button disabled={pending}>
            {pending
              ? 'Un instant…'
              : signup
                ? 'Créer mon compte'
                : 'Se connecter'}
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="notice error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      <p>
        <Link href={signup ? '/auth/sign-in' : '/auth/sign-up'}>
          {signup
            ? 'Vous avez déjà un compte ? Se connecter'
            : 'Créer un compte'}
        </Link>
      </p>
    </main>
  );
}
