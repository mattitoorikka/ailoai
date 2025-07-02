import { useAssistantId } from "@/app/hooks/useAssistantId";

/** React-hook, joka palauttaa ai-fetch-funktion */
export function useAiFetch() {
  const assistantId = useAssistantId();

  return async function aiFetch(
    url: string,
    init: RequestInit & { body?: FormData | Record<string, any> } = {}
  ) {
    if (!assistantId) throw new Error("assistantId puuttuu!");

    let body: BodyInit | undefined;

    // Jos mukana kuva → oletat että body on FormData
    if (init.body instanceof FormData) {
      init.body.append("assistantId", assistantId);
      body = init.body;
    } else {
      // Tekstipyyntö → muutetaan JSONiksi ja lisätään id 
      const json = { assistantId, ...(init.body as Record<string, any>) };
      body = JSON.stringify(json);
      init.headers = { "Content-Type": "application/json", ...init.headers };
    }

    return fetch(url, { ...init, body, credentials: "include" });
  };
}
