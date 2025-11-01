import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const schema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(8),
    role: z.enum(["PSYCHOLOGIST", "PATIENT"]),
    crp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  })
  .refine((data) => {
    if (data.role === "PSYCHOLOGIST" && (!data.crp || data.crp.trim() === "")) {
      return false;
    }
    return true;
  }, {
    path: ["crp"],
    message: "CRP é obrigatório para psicólogos.",
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      return NextResponse.json({ error: "Este email já está em uso." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    });

    if (user.role === "PSYCHOLOGIST") {
      await prisma.psychologist.create({
        data: {
          userId: user.id,
          crp: data.crp!,
        },
      });
    } else {
      await prisma.patient.create({ data: { userId: user.id } });
    }

    return NextResponse.json({ ok: true, userId: user.id });
  
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados de validação inválidos", details: e.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error(e);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

