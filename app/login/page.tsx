'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  const [form, setForm] = useState({
    email: '',
    ticketNumber: '',
    date: '',
    licensePlate: '',
    city: '',
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm((prev) => ({ ...prev, file: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.ticketNumber || !form.date || !form.licensePlate || !form.city) {
      alert(lang === 'en' ? 'Please fill in all fields.' : 'Por favor complete todos los campos.');
      return;
    }

    const { data, error } = await supabase.from('tickets').insert([
      {
        email: form.email,
        ticket_number: form.ticketNumber,
        violation_date: form.date,
        license_plate: form.licensePlate,
        city: form.city,
      },
    ]);

    if (error) {
      console.error('❌ Supabase Error:', error);
      alert(lang === 'en' ? 'Submission failed. Try again.' : 'Error al enviar. Intenta de nuevo.');
    } else {
      alert(lang === 'en' ? 'Success! Your ticket was submitted. Redirecting to payment...' : '¡Éxito! Tu multa fue enviada. Redirigiendo al pago...');

      setForm({
        email: '',
        ticketNumber: '',
        date: '',
        licensePlate: '',
        city: '',
        file: null,
      });

      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email }),
        });
        const sessionData = await res.json();
        window.location.href = sessionData.url;
      } catch (err) {
        console.error('❌ Payment redirect failed:', err);
      }
    }
  };

  const t = {
    title: 'TicketSolver',
    tagline: lang === 'en' ? 'Fast. Easy. Legal Help.' : 'Rápido. Fácil. Ayuda legal.',
    heading: lang === 'en' ? 'Solve Your Parking Ticket in Minutes' : 'Resuelve tu multa de estacionamiento en minutos',
    subheading: lang === 'en'
      ? 'Upload your ticket. Pay the service fee. Let our legal team handle the rest.'
      : 'Sube tu multa. Paga la tarifa. Nuestro equipo legal se encargará del resto.',
    email: lang === 'en' ? 'Your Email' : 'Tu correo electrónico',
    ticketNumber: lang === 'en' ? 'Ticket Number' : 'Número de multa',
    date: lang === 'en' ? 'Violation Date' : 'Fecha de infracción',
    licensePlate: lang === 'en' ? 'License Plate' : 'Placa del vehículo',
    city: lang === 'en' ? 'City' : 'Ciudad',
    upload: lang === 'en' ? 'Upload Ticket (Image or PDF)' : 'Sube la multa (imagen o PDF)',
    button: lang === 'en' ? 'Continue to Payment' : 'Continuar al pago',
    footer: lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.',
    language: lang === 'en' ? 'Español' : 'English',
  };

  const labels: Record<string, string> = {
    email: t.email,
    ticketNumber: t.ticketNumber,
    date: t.date,
    licensePlate: t.licensePlate,
    city: t.city,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center">
      <header className="w-full py-6 px-4 md:px-12 border-b border-gray-200 bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">{t.title}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">{t.tagline}</span>
          <button
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {t.language}
          </button>
        </div>
      </header>

      <section className="flex-grow w-full max-w-xl px-6 py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.heading}</h2>
          <p className="text-gray-500 mb-6">{t.subheading}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(labels).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">
                  {labels[field]}
                </label>
                <input
                  type={field === 'date' ? 'date' : 'text'}
                  name={field}
                  value={form[field as keyof typeof form] as string}
                  onChange={handleChange}
                  required
                  className="text-black mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">{t.upload}</label>
              <input
                type="file"
                name="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
                required
                className="text-black mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              🚀 {t.button}
            </button>
          </form>
        </div>
      </section>

      <footer className="w-full text-center py-4 text-sm text-gray-400 border-t mt-10">
        &copy; {new Date().getFullYear()} TicketSolver — {t.footer}
      </footer>
    </main>
  );
}
