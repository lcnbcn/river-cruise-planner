// Supabase Edge Function: Genera un archivo ICS para un único evento
// Acceso por GET: https://<project-ref>.functions.supabase.co/ics-event?text=...&details=...&location=...&start=YYYYMMDDTHHMMSS&end=YYYYMMDDTHHMMSS&filename=evento

// Deno standard server
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

function sanitize(text: string): string {
  return text
    .replace(/\\/g, "\\\\") // escapar barras invertidas primero
    .replace(/\n|\r\n?/g, "\\n") // nuevas líneas
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatUTC(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

serve((req: Request) => {
  const { searchParams } = new URL(req.url);

  const text = sanitize(searchParams.get("text") ?? "Evento");
  const details = sanitize(searchParams.get("details") ?? "");
  const location = sanitize(searchParams.get("location") ?? "");
  const start = searchParams.get("start") ?? ""; // esperado: YYYYMMDDTHHMMSS (hora local)
  const end = searchParams.get("end") ?? "";     // esperado: YYYYMMDDTHHMMSS (hora local)
  const filename = (searchParams.get("filename") ?? "evento") + ".ics";

  // Validación mínima
  if (!start || !end) {
    return new Response("Missing start/end", { status: 400 });
  }

  const uid = `${crypto.randomUUID()}@ics-event.supabase`;
  const dtstamp = formatUTC(new Date());

  // Construir ICS (CRLF)
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cruise Schedule//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${text}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const body = icsLines.join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      // inline: algunos navegadores/OS abren directamente la app de Calendario
      "Content-Disposition": `inline; filename=\"${filename}\"`,
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
});