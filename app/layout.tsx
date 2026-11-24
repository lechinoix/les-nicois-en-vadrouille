import type { Metadata } from 'next';
import Link from 'next/link';
import NavigationMenu from '@/components/NavigationMenu';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/100-italic.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/300-italic.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/400-italic.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/700-italic.css';
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
          <NavigationMenu />
        </header>
        {children}
        <footer>Ambre & Nico · Les Niçois en Vadrouille</footer>
      </body>
    </html>
  );
}
