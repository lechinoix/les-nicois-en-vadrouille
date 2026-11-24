import type { Metadata } from 'next';
import Link from 'next/link';
import sports from '@/lib/sports.json';
import './globals.css';
export const metadata: Metadata = {
  title: 'Les Niçois en Vadrouille',
  description: 'Le site de montagne (et de chill) d’Ambre et Nicolas.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header>
          <Link className="brand" href="/">
            <img src="/img/les-nicois.png" alt="Ambre et Nicolas grimpant" />
            Les Niçois en Vadrouille
          </Link>
          <details>
            <summary aria-label="Menu">☰</summary>
            <nav>
              <Link href="/adventures">Toutes nos sorties</Link>
              {sports.map((s) => (
                <Link href={`/sport/${s.slug}`} key={s.slug}>
                  {s.name}
                </Link>
              ))}
              <Link href="/editor">Éditeur</Link>
              <Link href="/account">Mon compte</Link>
              <Link href="/auth/sign-up">Créer un compte</Link>
            </nav>
          </details>
        </header>
        {children}
        <footer>Ambre & Nico · Les Niçois en Vadrouille</footer>
      </body>
    </html>
  );
}
