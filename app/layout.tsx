import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://falendanil92-eng.github.io/drevo-zhizni/'),
  title: 'Древо жизни — Солнце.Культура',
  description: 'Монументальное панно «Древо жизни» — культурный проект о выборе жизни, традиции русского жемчужного шитья и созидании.',
  openGraph: {
    title: 'Древо жизни — Солнце.Культура',
    description: 'Монументальное панно, созданное в древней русской технике сажения по бели.',
    url: 'https://falendanil92-eng.github.io/drevo-zhizni/',
    siteName: 'Солнце.Культура',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: 'og.png', width: 1200, height: 630, alt: 'Древо жизни — Солнце.Культура' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Древо жизни — Солнце.Культура',
    description: 'Монументальное панно в древней русской технике сажения по бели.',
    images: ['og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
