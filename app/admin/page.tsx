'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

async function sendNotification(ticket: Ticket) {
  if (!ticket.email && !ticket.phone_number) return;
  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ticket.email,
        phone: ticket.phone_number,
        ticketNumber: ticket.ticket_number,
      }),
    });
  } catch (err) {
    console.error('Notification failed:', err);
  }
}

type Ticket = {
  id: number;
  email: string;
  phone_number: string;
  full_name: string;
  date_of_birth: string;
  ticket_number: string;
  license_plate: string;
  violation_date: string;
  city: string;
  status: string;
  created_at: string;
  file_url?: string;
};

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .neq('status', 'Completed')
      .order('created_at', { ascending: false });

    if (error) console.error('Error loading tickets:', error);
    else setTickets(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;

    const { error } = await supabase.from('tickets').update({ status: newStatus }).eq('id', id);
    if (!error) {
      if (newStatus === 'Completed') {
        await sendNotification(ticket);
      }
      fetchTickets();
    } else {
      alert('Failed to update status.');
    }
  };

  const deleteTicket = async (id: number) => {
    const { error } = await supabase.from('tickets').delete().eq('id', id);
    if (!error) fetchTickets();
    else alert('Failed to delete ticket.');
  };

  const filteredTickets = tickets.filter((t) =>
    [t.email, t.ticket_number, t.license_plate, t.city, t.full_name].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  useEffect(() => {
    if (authorized) fetchTickets();
  }, [authorized]);

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">🔐 Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg"
          />
          <button
            onClick={() => {
              if (password === 'Naanaa2024!') {
                setAuthorized(true);
              } else {
                alert('Incorrect password.');
              }
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-10 text-black">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Portal – Ticket Management</h1>

      <input
        type="text"
        placeholder="Search by name, email, ticket #, plate, or city"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
      />

      {loading ? (
        <p className="text-gray-700">Loading tickets...</p>
      ) : (
        <div className="space-y-6">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white shadow-md rounded-xl p-6 border text-black">
              <p><strong>Full Name:</strong> {ticket.full_name || '—'}</p>
              <p><strong>Date of Birth:</strong> {ticket.date_of_birth || '—'}</p>
              <p><strong>Email:</strong> {ticket.email || '—'}</p>
              <p><strong>Phone:</strong> {ticket.phone_number || '—'}</p>
              <p><strong>Ticket #:</strong> {ticket.ticket_number}</p>
              <p><strong>License Plate:</strong> {ticket.license_plate}</p>
              <p><strong>Date:</strong> {ticket.violation_date}</p>
              <p><strong>City:</strong> {ticket.city}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              <p className="text-sm text-gray-500">Submitted: {new Date(ticket.created_at).toLocaleString()}</p>

              {ticket.file_url && (
                <div className="mt-3">
                  <a
                    href={ticket.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-blue-600 underline"
                  >
                    📎 View Uploaded Ticket
                  </a>
                </div>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                {['Pending', 'In Review', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(ticket.id, status)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      ticket.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
                <button
                  onClick={() => deleteTicket(ticket.id)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
