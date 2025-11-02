// Ficheiro: src/app/api/delete-user/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: "Parâmetro 'email' em falta." }, { status: 400 });
  }

  try {
    
    const user = await prisma.user.findUnique({ 
        where: { email },
        include: {
            psychologist: true,
            patient: true,
        }
    });

    if (!user) {
      return NextResponse.json({ message: `Utilizador com email ${email} não encontrado.` }, { status: 404 });
    }
    
    
    if (user.psychologist) {
       
        await prisma.psychologist.delete({ where: { id: user.psychologist.id } });
    }
    if (user.patient) {
        await prisma.patient.delete({ where: { id: user.patient.id } });
    }


    await prisma.verificationToken.deleteMany({ where: { email: email } });
    
   
    await prisma.user.delete({ where: { id: user.id } });
    
    return NextResponse.json({ 
        ok: true, 
        message: `Utilizador ${email} e todos os dados relacionados (Psicólogo/Paciente) excluídos com sucesso.`, 
        userId: user.id 
    });

  } catch (e) {
    console.error("Erro ao excluir utilizador:", e);
    return NextResponse.json({ error: "Erro interno do servidor ao excluir." }, { status: 500 });
  }
}

/* http://localhost:3000/api/delete-user?email=EMAILQUEQUEREXCLUIR */