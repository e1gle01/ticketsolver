'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TicketSolverPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
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

    const required = ['fullName', 'dateOfBirth', 'ticketNumber', 'date', 'licensePlate', 'city'];
    for (const field of required) {
      if (!form[field as keyof typeof form]) {
        alert(lang === 'en' ? 'Please fill in all required fields.' : 'Por favor complete todos los campos requeridos.');
        return;
      }
    }

    let fileUrl = '';
    if (form.file) {
      const cleanFileName = form.file.name.replace(/[^a-z0-9.\-_]/gi, '_');
      const filePath = `uploads/${Date.now()}_${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tickets')
        .upload(filePath, form.file, {
          contentType: form.file.type,
        });

      if (uploadError) {
        console.error('❌ Upload Error:', uploadError.message ?? uploadError);
        alert('Failed to upload the file.');
        return;
      }

      const { data } = supabase.storage.from('tickets').getPublicUrl(filePath);
      fileUrl = data.publicUrl;
    }

    const { error } = await supabase.from('tickets').insert([
      {
        full_name: form.fullName,
        date_of_birth: form.dateOfBirth,
        email: form.email,
        phone_number: form.phoneNumber,
        ticket_number: form.ticketNumber,
        violation_date: form.date,
        license_plate: form.licensePlate,
        city: form.city,
        status: 'Pending',
        notified_email: false,
        notified_sms: false,
        file_url: fileUrl,
      },
    ]);

    if (error) {
      console.error('❌ Supabase Error:', error);
      alert(lang === 'en' ? 'Submission failed. Try again.' : 'Error al enviar. Intenta de nuevo.');
      return;
    }

    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, status: 'Received' }),
      });
    } catch (err) {
      console.error('❌ Notification Error:', err);
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const sessionData = await res.json();
      if (!sessionData.url) throw new Error('No URL returned from Stripe.');
      window.location.href = sessionData.url;
    } catch (err) {
      console.error('❌ Stripe error:', err);
      alert(lang === 'en' ? 'Payment session failed.' : 'La sesión de pago falló.');
    }
  };

  const t = {
    heading: lang === 'en'
      ? 'Solve Your Parking Ticket in Minutes for only $99'
      : 'Resuelve tu multa de estacionamiento en minutos por solo $99',
    subheading: lang === 'en'
      ? 'Upload your ticket. Pay the service fee. Let our legal team handle the rest.'
      : 'Sube tu multa. Paga la tarifa. Nuestro equipo legal se encargará del resto.',
    fields: {
      fullName: lang === 'en' ? 'Full Name' : 'Nombre completo',
      dateOfBirth: lang === 'en' ? 'Date of Birth' : 'Fecha de nacimiento',
      email: lang === 'en' ? 'Your Email' : 'Tu correo electrónico',
      phoneNumber: lang === 'en' ? 'Phone Number' : 'Número de teléfono',
      ticketNumber: lang === 'en' ? 'Ticket Number' : 'Número de multa',
      date: lang === 'en' ? 'Violation Date' : 'Fecha de infracción',
      licensePlate: lang === 'en' ? 'License Plate' : 'Placa del vehículo',
      city: lang === 'en' ? 'City' : 'Ciudad',
      file: lang === 'en' ? 'Upload Ticket (Image or PDF)' : 'Sube la multa (imagen o PDF)',
    },
    button: lang === 'en' ? 'Continue to Payment' : 'Continuar al pago',
    statusButton: lang === 'en' ? 'Check Ticket Status' : 'Ver estado de tu multa',
    footer: lang === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.',
    toggleLang: lang === 'en' ? 'Español' : 'English',
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center">
      <section className="flex-grow w-full max-w-xl px-6 py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {t.toggleLang}
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.heading}</h2>
          <p className="text-gray-500 mb-6">{t.subheading}</p>

          <div className="mt-4 mb-6 text-center">
            <a
              href="/status"
              className="inline-block px-6 py-3 text-sm font-semibold bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition duration-200"
            >
              🔍 {t.statusButton}
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(t.fields).map(([key, label]) =>
              key === 'file' ? (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                    required
                    className="text-black mt-1 w-full rounded-md border border-gray-300 shadow-sm"
                  />
                </div>
              ) : (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type={key === 'date' || key === 'dateOfBirth' ? 'date' : 'text'}
                    name={key}
                    value={form[key as keyof typeof form] as string}
                    onChange={handleChange}
                    required={['fullName', 'dateOfBirth', 'ticketNumber', 'date', 'licensePlate', 'city'].includes(key)}
                    className="text-black mt-1 w-full rounded-md border border-gray-300 shadow-sm"
                  />
                </div>
              )
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg"
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
