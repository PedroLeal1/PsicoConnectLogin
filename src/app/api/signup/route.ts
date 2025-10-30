import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import { z } from "zod"; import bcrypt from "bcrypt";
const prisma = new PrismaClient();
const schema = z.object({
  name: z.string().min(2), email: z.string().email(),
  password: z.string().min(6), confirmPassword: z.string().min(6),
  role: z.enum(["PSYCHOLOGIST","PATIENT"]),
}).refine(d=>d.password===d.confirmPassword,{path:["confirmPassword"],message:"Senhas não conferem"});

export async function POST(req: Request) {
  const body = await req.json();
  const data = schema.parse(body);
  const exists = await prisma.user.findUnique({ where: { email: data.email }});
  if (exists) return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({ data: { name: data.name, email: data.email, passwordHash, role: data.role as Role }});
  if (user.role === "PSYCHOLOGIST") await prisma.psychologist.create({ data: { userId: user.id }});
  else await prisma.patient.create({ data: { userId: user.id }});
  return NextResponse.json({ ok: true });
}
