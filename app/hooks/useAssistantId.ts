const ASSISTANT_IDS: Record<string, string> = {
  yleinen: "asst_K9yFCWJQ39GPlNkc32RAHuiY",
  valikoima: "asst_9PsbxISdv300MLk7perkxQec",
  markkinointi: "asst_JlagRMAPpWkIPcFYHDQc1csW",
  tarjouspyynnot: "asst_E4rbTTvbmnbwl7vrcv3Us87Y",
  hr: "asst_7gIwcj44bbmqnnZHv6J8W3VY",
};

const DEFAULT_TOPIC = "yleinen";

export function getStaticAssistantId(): string {
  return ASSISTANT_IDS[DEFAULT_TOPIC];
}

export function useAssistantId(topic: string = DEFAULT_TOPIC): string {
  return ASSISTANT_IDS[topic] ?? getStaticAssistantId();
}
