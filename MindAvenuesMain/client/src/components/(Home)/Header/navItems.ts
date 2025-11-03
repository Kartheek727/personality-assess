// components/Header/navItems.ts
import { NavItemType } from './types';

export const navItems: NavItemType[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About Us',
    href: '/about',
    children: [
      { label: 'Founders', href: '/about/#founders' },
      { label: 'Vision', href: '/about/#vision' },
      { label: 'Mission', href: '/about/#mission' },
      { label: 'Objectives', href: '/about/#objectives' },
      { label: 'Networks', href: '/about/#networks' },
    ],
  },
  {
    label: 'Inner Mind Map Assessment',
    href: '/inner-mind-map',
  },
];