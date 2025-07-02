'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function StatusPage() {
  const [email, setEmail] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(true);

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('email', email);

    if (error) {
      console.error('Error fetching tickets:', error);
    } else {
      setTickets(data);
    }

    setLoading(false);
  };
  const getStatusBadge = (status: string | null | undefined) => {
    const base = 'inline-block px-2 py-1 rounded-full text-xs font-semibold';
  
    if (!status || typeof status !== 'string') {
      return <span className={`${base} bg-gray-100 text-gray-600`}>Unknown</span>;
    }
  
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'in progress':
        return <span className={`${base} bg-blue-100 text-blue-800`}>In Progress</span>;
      case 'completed':
        return <span className={`${base} bg-green-100 text-green-800`}>Completed</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Check Your Ticket Status</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-4 border border-gray-200"
      >
        <label className="block text-sm font-medium text-gray-700">Enter your email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          View Status
        </button>
      </form>

      {submitted && (
        <div className="w-full max-w-xl mt-8">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : tickets.length === 0 ? (
            <p className="text-center text-gray-600 mt-4">
              No tickets found for this email.
            </p>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white border border-gray-200 p-6 rounded-xl shadow text-gray-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      Ticket #{ticket.ticket_number}
                    </h3>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <p><strong>City:</strong> {ticket.city}</p>
                  <p><strong>License Plate:</strong> {ticket.license_plate}</p>
                  <p><strong>Violation Date:</strong> {ticket.violation_date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
