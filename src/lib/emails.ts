// Ficheiro: src/lib/emails.ts

import { Resend } from 'resend';
import { EmailTemplate } from '../components/EmailTemplate';
import prisma from "./prisma"; 

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000); 

  await prisma.verificationToken.deleteMany({
    where: { email },
  });

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expiresAt: expires,
    },
  });

  return verificationToken;
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${baseUrl}/api/confirm-email/${token}`;

  try {
    await resend.emails.send({
      from: 'PsicoConnect <onboarding@resend.dev>',
      to: email, 
      subject: 'Confirme o seu email - PsicoConnect',
      react: EmailTemplate({ confirmLink }),
      headers: {
          'X-Auto-Response-Suppress': 'All',
      },
      tags: [
          { name: 'category', value: 'confirm-email' },
      ],
    });

    console.log(`Email de verificação enviado para ${email}`);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
  }
}