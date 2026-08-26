import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://solntse-drevo.ru';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Древо жизни — монументальное панно | Солнце.Культура',
    template: '%s | Солнце.Культура',
  },
  description:
    '«Древо жизни» — монументальное панно 3 × 3 метра, созданное в традиции русского жемчужного шитья. Культурный проект о созидании, жизни и живом мире.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: 'Солнце.Культура',
    title: 'Древо жизни — монументальное панно',
    description:
      'Культурный проект о созидании и традиции русского жемчужного шитья.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Древо жизни — монументальное панно',
    description:
      'Культурный проект о созидании и традиции русского жемчужного шитья.',
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
