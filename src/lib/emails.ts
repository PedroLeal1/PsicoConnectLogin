import { Resend } from "resend";
import prisma from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #111;">
      <h2>Confirme o seu email</h2>
      <p>Obrigado por se cadastrar no PsicoConnect.</p>
      <p>Clique no botão abaixo para confirmar o seu email:</p>
      <a
        href="${confirmLink}"
        style="
          display: inline-block;
          background: #2563eb;
          color: white;
          text-decoration: none;
          padding: 12px 18px;
          border-radius: 8px;
          font-weight: bold;
        "
      >
        Confirmar email
      </a>
      <p style="margin-top: 16px;">
        Se o botão não funcionar, copie e cole este link no navegador:
      </p>
      <p>${confirmLink}</p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: "PsicoConnect <nao-responda@psicoconnect.site>",
      to: email,
      subject: "Confirme o seu email - PsicoConnect",
      html,
      headers: {
        "X-Auto-Response-Suppress": "All",
      },
      tags: [{ name: "category", value: "confirm-email" }],
    });

    console.log("Email enviado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}