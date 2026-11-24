'use client';

import { Menu } from '@base-ui/react/menu';
import sports from '@/lib/sports';

export default function NavigationMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger className="navigation-trigger" aria-label="Menu principal">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          className="navigation-positioner"
          sideOffset={12}
          align="end"
        >
          <Menu.Popup
            className="navigation-popup"
            aria-label="Navigation principale"
          >
            <Menu.LinkItem href="/adventures" closeOnClick>
              Toutes nos sorties
            </Menu.LinkItem>
            {sports.map((sport) => (
              <Menu.LinkItem
                key={sport.slug}
                href={`/sport/${sport.slug}`}
                closeOnClick
              >
                {sport.name}
              </Menu.LinkItem>
            ))}
            <Menu.Separator className="navigation-separator" />
            <Menu.LinkItem href="/editor" closeOnClick>
              Éditeur
            </Menu.LinkItem>
            <Menu.LinkItem href="/account" closeOnClick>
              Mon compte
            </Menu.LinkItem>
            <Menu.LinkItem href="/auth/sign-up" closeOnClick>
              Créer un compte
            </Menu.LinkItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
