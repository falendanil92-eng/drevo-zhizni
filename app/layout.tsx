import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Древо жизни — Солнце.Культура',
  description: 'Монументальное панно «Древо жизни» — культурный проект о выборе жизни, традиции русского жемчужного шитья и созидании.',
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
