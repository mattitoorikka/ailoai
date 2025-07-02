import { useEffect, useState } from "react";

const ASSISTANT_IDS: Record<string, string> = {
  yleinen: "asst_K9yFCWJQ39GPlNkc32RAHuiY",
  valikoima: "asst_9PsbxISdv300MLk7perkxQec",
  markkinointi: "asst_JlagRMAPpWkIPcFYHDQc1csW",
  tarjouspyynnot: "asst_E4rbTTvbmnbwl7vrcv3Us87Y",
  hr: "asst_7gIwcj44bbmqnnZHv6J8W3VY",
};

const DEFAULT_TOPIC = "yleinen";

// Tämä palauttaa staattisesti oletus-ID:n
export function getStaticAssistantId(): string {
  return ASSISTANT_IDS[DEFAULT_TOPIC];
}

// Tämä hook palauttaa topicin mukaisen ID:n, tai fallbackin
export function useAssistantId(topic: string = DEFAULT_TOPIC): string {
  const [assistantId, setAssistantId] = useState<string>(getStaticAssistantId());

  useEffect(() => {
    const resolved = ASSISTANT_IDS[topic] ?? getStaticAssistantId();
    setAssistantId(resolved);
  }, [topic]);

  return assistantId;
}
