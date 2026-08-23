import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Древо жизни — структурный макет',
  description: 'Структурный прототип лендинга проекта «Древо жизни».',
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
