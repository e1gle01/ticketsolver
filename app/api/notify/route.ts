import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, status } = await req.json();

  // Validate inputs
  if (!email || !status || typeof email !== 'string' || typeof status !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid request data' }), { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'TicketSolver <noreply@ticketsolver.com>',
      to: email,
      subject: 'Your Ticket Status Has Been Updated',
      html: `
        <html>
          <body style="font-family: sans-serif; color: #333;">
            <p>Hello,</p>
            <p>Your parking ticket status has been updated to: <strong>${status}</strong>.</p>
            <p>If you have any questions, feel free to reply to this email.</p>
            <br/>
            <p>Thank you,<br/>The TicketSolver Team</p>
          </body>
        </html>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('❌ Resend Email Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}
