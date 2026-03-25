import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
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
    const now = new Date().toISOString();

    const url = new URL(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    );
    url.searchParams.set("timeMin", now);
    url.searchParams.set("maxResults", "10");
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Erro ao buscar eventos do Google Calendar.",
          details: data,
        },
        { status: response.status },
      );
    }

    console.log(
      "GOOGLE CALENDAR RAW ITEMS:",
      JSON.stringify(data.items || [], null, 2),
    );

    const events = (data.items || [])
      .filter((event: any) => {
        return event.status !== "cancelled" && event.eventType !== "birthday";
      })
      .map((event: any) => ({
        id: event.id,
        title: event.summary || "Sem título",
        description: event.description || "",
        start: event.start?.dateTime || event.start?.date || null,
        end: event.end?.dateTime || event.end?.date || null,
        location: event.location || "",
        htmlLink: event.htmlLink || "",
        status: event.status || "",
      }));

    return NextResponse.json({
      events,
      debug: {
        tokenEmailHint: (token as any)?.email || null,
        rawItems: data.items || [],
      },
    });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);

    return NextResponse.json(
      { error: "Erro interno ao buscar eventos do Google Calendar." },
      { status: 500 },
    );
  }
}
