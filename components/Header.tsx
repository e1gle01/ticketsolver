'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  return (
    <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        TicketSolver
      </Link>

      <nav className="space-x-4">
        <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
          About
        </Link>
        <Link href="/status" className="text-gray-700 hover:text-blue-600 font-medium">
          Status
        </Link>
        <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
          Admin
        </Link>
      </nav>
    </header>
  );
}
