import { useAssistantId } from "@/app/hooks/useAssistantId";

/** React-hook, joka palauttaa ai-fetch-funktion tai null kunnes valmis */
export function useAiFetch(topic?: string) {
  const assistantId = useAssistantId(topic);

  if (!assistantId) return null; // estää ennenaikaisen käytön

  return async function aiFetch(
    url: string,
    init: RequestInit & { body?: FormData | Record<string, any> } = {}
  ) {
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
