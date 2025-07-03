import { useAssistantId } from "@/app/hooks/useAssistantId";

/** React-hook, joka palauttaa ai-fetch-funktion */
export function useAiFetch(topic?: string) {
  const assistantId = useAssistantId(topic); // ✅ käytä parametria

  return async function aiFetch(
    url: string,
    init: RequestInit & { body?: FormData | Record<string, any> } = {}
  ) {
    if (!assistantId) throw new Error("assistantId puuttuu!");

    let body: BodyInit | undefined;

    if (init.body instanceof FormData) {
      init.body.append("assistantId", assistantId);
      body = init.body;
    } else {
      const json = { assistantId, ...(init.body as Record<string, any>) };
      body = JSON.stringify(json);
      init.headers = { "Content-Type": "application/json", ...init.headers };
    }

    return fetch(url, { ...init, body, credentials: "include" });
  };
}
