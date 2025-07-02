// app/layout.tsx
'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lang = searchParams.get('lang') === 'es' ? 'es' : 'en';

  const tagline =
    lang === 'en'
      ? 'Fast. Easy. Legal Help.'
      : 'Rápido. Fácil. Ayuda legal.';

  const aboutLabel = lang === 'en' ? 'About Us' : 'Sobre Nosotros';
  const statusLabel = lang === 'en' ? 'Check Status' : 'Ver Estado';

  return (
    <html lang={lang}>
      <body className={`${poppins.className} bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col`}>
        <header className="w-full py-6 px-4 md:px-12 border-b bg-white shadow-sm flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold text-blue-700 hover:text-blue-900 transition duration-200">
            TicketSolver
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/about" className="text-sm text-gray-600 hover:text-blue-700">
              {aboutLabel}
            </Link>
            <Link href="/status" className="text-sm text-gray-600 hover:text-blue-700">
              {statusLabel}
            </Link>
          </nav>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="w-full text-center py-6 text-sm text-gray-400 border-t">
          &copy; {new Date().getFullYear()} TicketSolver — All rights reserved.
        </footer>
      </body>
    </html>
  );
}
