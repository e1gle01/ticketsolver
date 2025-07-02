'use client';

import { useState } from 'react';

export default function AboutPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  const t = {
    heading: lang === 'en' ? 'About TicketSolver' : 'Sobre TicketSolver',
    mission: lang === 'en'
      ? 'TicketSolver was founded on a simple mission: to make resolving parking tickets effortless, affordable, and reliable. We connect individuals with qualified legal professionals who manage the complex process on your behalf—from documentation to court appearances.'
      : 'TicketSolver fue fundado con una misión simple: hacer que resolver multas de estacionamiento sea fácil, asequible y confiable. Conectamos a las personas con profesionales legales calificados que manejan el proceso complejo en su nombre, desde la documentación hasta las comparecencias en la corte.',
    service: lang === 'en'
      ? 'Whether you\'re a local resident, a student, or a visitor navigating unfamiliar streets, our streamlined service empowers you to move forward with confidence. For a flat fee of $99, you can upload your citation and leave the paperwork, deadlines, and legal nuances to our expert team.'
      : 'Ya sea que seas un residente local, un estudiante o un visitante navegando por calles desconocidas, nuestro servicio simplificado te permite seguir adelante con confianza. Por una tarifa fija de $99, puedes subir tu multa y dejar el papeleo, las fechas límite y los detalles legales a nuestro equipo experto.',
    principles: lang === 'en'
      ? 'TicketSolver is built on principles of transparency, empathy, and client-first service. We aim to simplify the law—one ticket at a time.'
      : 'TicketSolver se basa en principios de transparencia, empatía y servicio centrado en el cliente. Nuestro objetivo es simplificar la ley, una multa a la vez.',
    meetAttorney: lang === 'en' ? 'Meet Your Attorney' : 'Conoce a Tu Abogada',
    intro: lang === 'en'
      ? 'Smahahane Naanaa is the lead attorney at USA Law Group LLC, located in Miami, Florida. She earned her Juris Doctor from Nova Southeastern University’s Shepard Broad Law Center in 2008.'
      : 'Smahahane Naanaa es la abogada principal de USA Law Group LLC, ubicada en Miami, Florida. Obtuvo su Doctorado en Derecho en la Facultad de Derecho Shepard Broad de Nova Southeastern University en 2008.',
    award: lang === 'en'
      ? 'Ms. Naanaa has been recognized with the Elite Lawyer Award, a distinction honoring attorneys with a proven record of professional excellence and client satisfaction. She is admitted to the bar in Florida (since 2008), the District of Columbia (since 2020), and New York (since 2024).'
      : 'La Sra. Naanaa ha sido reconocida con el premio Elite Lawyer, una distinción que honra a abogados con un historial probado de excelencia profesional y satisfacción del cliente. Está admitida en el colegio de abogados en Florida (desde 2008), el Distrito de Columbia (desde 2020) y Nueva York (desde 2024).',
    fluent: lang === 'en'
      ? 'Fluent in Arabic, English, French, and Spanish, she brings global perspective and compassionate legal support to every client she serves. Her goal is to make legal assistance accessible, understandable, and effective.'
      : 'Fluida en árabe, inglés, francés y español, aporta una perspectiva global y apoyo legal compasivo a cada cliente. Su objetivo es hacer que la asistencia legal sea accesible, comprensible y eficaz.',
    contact: lang === 'en' ? 'Contact Information' : 'Información de Contacto',
    firm: lang === 'en' ? 'Firm' : 'Firma',
    phone: lang === 'en' ? 'Phone' : 'Teléfono',
    email: lang === 'en' ? 'Email' : 'Correo electrónico',
    languages: lang === 'en' ? 'Languages' : 'Idiomas',
    langToggle: lang === 'en' ? 'Español' : 'English',
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            {t.langToggle}
          </button>
        </div>

        <h1 className="text-4xl font-extrabold mb-6 text-blue-700">{t.heading}</h1>

        <p className="mb-5 text-lg leading-relaxed">{t.mission}</p>
        <p className="mb-5 text-lg leading-relaxed">{t.service}</p>
        <p className="mb-10 text-lg leading-relaxed">{t.principles}</p>

        <h2 className="text-2xl font-semibold text-blue-700 mb-4">{t.meetAttorney}</h2>

        <p className="mb-4 text-lg leading-relaxed">{t.intro}</p>
        <p className="mb-4 text-lg leading-relaxed">{t.award}</p>
        <p className="mb-6 text-lg leading-relaxed">{t.fluent}</p>

        <div className="bg-gray-100 rounded-lg p-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.contact}</h3>
          <ul className="space-y-2 text-base">
            <li>
              <span className="font-medium">📍 {t.firm}:</span> USA Law Group LLC, Miami, FL
            </li>
            <li>
              <span className="font-medium">📞 {t.phone}:</span>{' '}
              <a href="tel:7866335917" className="text-blue-600 hover:underline">(786) 633-5917</a>
            </li>
            <li>
              <span className="font-medium">✉️ {t.email}:</span>{' '}
              <a href="mailto:usalawgroup@gmail.com" className="text-blue-600 hover:underline">usalawgroup@gmail.com</a>
            </li>
            <li>
              <span className="font-medium">🌐 {t.languages}:</span> Arabic, English, French, Spanish
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
