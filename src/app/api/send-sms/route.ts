// File: /app/api/notify/route.ts

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Parse the JSON body
    const body = await req.json();
    const { email, status } = body;

    // Validate required fields
    if (!email || !status) {
      console.error('❌ Missing email or status in request body:', body);
      return new Response(JSON.stringify({ error: 'Missing email or status' }), {
        status: 400,
      });
    }

    // Send the email
    await resend.emails.send({
      from: 'TicketSolver <noreply@ticketsolver.com>',
      to: email,
      subject: 'Your Ticket Status Has Been Updated',
      html: `<p>Hello,</p><p>Your parking ticket has been <strong>${status}</strong>.</p><p>Thank you for using TicketSolver!</p>`,
    });

    console.log('✅ Email sent to', email);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('❌ Failed to send email via Resend:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
