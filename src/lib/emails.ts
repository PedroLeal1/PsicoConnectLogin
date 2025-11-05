import { Resend } from 'resend';
import prisma from './prisma';

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({ where: { email } });

  const verificationToken = await prisma.verificationToken.create({
    data: { email, token, expiresAt: expires },
  });

  return verificationToken;
}

function buildVerifyHtml(link: string) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;color:#0f172a">
    <h2 style="margin:0 0 12px">Confirme seu e-mail</h2>
    <p>Use o botão abaixo para confirmar sua conta no PsicoConnect.</p>
    <p>
      <a href="${link}" style="display:inline-block;padding:10px 16px;border-radius:10px;background:#3b82f6;color:#fff;text-decoration:none">
        Confirmar e-mail
      </a>
    </p>
    <p style="font-size:12px;color:#475569">Se o botão não funcionar, copie e cole este link no navegador:<br>${link}</p>
  </div>
  `.trim();
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${baseUrl}/api/confirm-email/${token}`;
  const html = buildVerifyHtml(confirmLink);

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'PsicoConnect <nao-responda@psicoconnect.site>',
    to: email,
    subject: 'Confirme o seu email - PsicoConnect',
    html,
    headers: { 'X-Auto-Response-Suppress': 'All' },
    tags: [{ name: 'category', value: 'confirm-email' }],
  });
}
