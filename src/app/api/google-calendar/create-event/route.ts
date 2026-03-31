import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const googleAccessToken = (token as any)?.googleAccessToken;

  if (!token || !googleAccessToken) {
    return NextResponse.json(
      { error: "Google Calendar não conectado." },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();

    const { title, date, startTime, endTime, location, description } = body;

    if (!title || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Título, data, hora inicial e hora final são obrigatórios." },
        { status: 400 },
      );
    }

    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    const googleResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: title,
          description: description || "",
          location: location || "",
          start: {
            dateTime: startDateTime,
            timeZone: "America/Fortaleza",
          },
          end: {
            dateTime: endDateTime,
            timeZone: "America/Fortaleza",
          },
        }),
      },
    );

    const data = await googleResponse.json();

    if (!googleResponse.ok) {
      return NextResponse.json(
        {
          error: "Erro ao criar evento no Google Calendar.",
          details: data,
        },
        { status: googleResponse.status },
      );
    }

    return NextResponse.json({
      message: "Evento criado com sucesso no Google Calendar.",
      event: data,
    });
  } catch (error) {
    console.error("Erro ao criar evento:", error);

    return NextResponse.json(
      { error: "Erro interno ao criar evento no Google Calendar." },
      { status: 500 },
    );
  }
}
