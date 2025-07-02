import { openai } from "@/app/openai";

export const runtime = "edge";

// Luo uusi säie ja lisää system message paikallisella ajalla ja (mahdollisella) sijainnilla
export async function POST(request: Request) {
  let latitude: number | undefined;
  let longitude: number | undefined;

  try {
    const body = await request.json();
    latitude = body.latitude;
    longitude = body.longitude;
  } catch {
    // Ei bodya tai ei JSONia – jatketaan ilman sijaintia
  }

  const thread = await openai.beta.threads.create();

  const now = new Date();
  const localTime = now.toLocaleString("fi-FI", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const systemMessage =
    latitude != null && longitude != null
      ? `Tänään on ${localTime}. Sijaintisi koordinaatit ovat: lat ${latitude.toFixed(
          2
        )}, lon ${longitude.toFixed(2)}.`
      : `Tänään on ${localTime}. Sijaintia ei voitu määrittää.`;

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: systemMessage,
  });

  return new Response(
    JSON.stringify({
      threadId: thread.id,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
