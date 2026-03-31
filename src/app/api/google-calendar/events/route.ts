import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

async function refreshGoogleAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error_description ||
        data?.error ||
        "Erro ao renovar token do Google.",
    );
  }

  return data.access_token as string;
}

async function createGoogleEvent(accessToken: string, payload: any) {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  return { response, data };
}

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const googleAccessToken = (token as any)?.googleAccessToken;
  const googleRefreshToken = (token as any)?.googleRefreshToken;

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

    const payload = {
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
    };

    let accessTokenToUse = googleAccessToken;

    let { response, data } = await createGoogleEvent(accessTokenToUse, payload);

    if (response.status === 401 && googleRefreshToken) {
      accessTokenToUse = await refreshGoogleAccessToken(googleRefreshToken);
      ({ response, data } = await createGoogleEvent(accessTokenToUse, payload));
    }

    if (!response.ok) {
      console.log(
        "CREATE EVENT GOOGLE RESPONSE:",
        JSON.stringify(data, null, 2),
      );

      return NextResponse.json(
        {
          error:
            data?.error?.message || "Erro ao criar evento no Google Calendar.",
          details: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      message: "Evento criado com sucesso no Google Calendar.",
      event: data,
    });
  } catch (error: any) {
    console.error("Erro ao criar evento:", error);

    return NextResponse.json(
      {
        error:
          error?.message || "Erro interno ao criar evento no Google Calendar.",
      },
      { status: 500 },
    );
  }
}
