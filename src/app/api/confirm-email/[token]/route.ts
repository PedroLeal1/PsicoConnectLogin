// Ficheiro: src/app/api/confirm-email/[token]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function GET(
  request: Request
) {

  const urlParts = request.url.split('/');
  const token = urlParts[urlParts.length - 1];

  if (!token || token.length < 30) {
    return NextResponse.json({ error: "Token em falta ou inválido no URL." }, { status: 400 });
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return NextResponse.json({ error: "Token inválido ou não encontrado" }, { status: 404 });
  }

  const hasExpired = new Date(verificationToken.expiresAt) < new Date();
  if (hasExpired) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json({ error: "Token expirado. Por favor, tente registar-se novamente." }, { status: 410 });
  }

  const user = await prisma.user.findUnique({
    where: { email: verificationToken.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilizador não encontrado" }, { status: 404 });
  }

  if (user.emailVerified) {
    return NextResponse.redirect(`${baseUrl}/login?verified=true`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return NextResponse.redirect(`${baseUrl}/login?verified=true`);
}