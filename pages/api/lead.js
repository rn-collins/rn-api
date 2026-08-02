import { Resend } from 'resend';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, message, source } = req.body;
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'collins.ra@northeastern.edu',
      subject: `New inquiry from ${source || 'RN Build'}: ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p><p><em>Source: ${source}</em></p>`,
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
