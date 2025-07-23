// assistant-config.ts

export const STATIC_ASSISTANT_IDS: Record<string, string> = {
  yleinen: "asst_K9yFCWJQ39GPlNkc32RAHuiY",
  valikoima: "asst_9PsbxISdv300MLk7perkxQec",
  markkinointi: "asst_JlagRMAPpWkIPcFYHDQc1csW",
  tarjouspyynnot: "asst_E4rbTTvbmnbwl7vrcv3Us87Y",
  hr: "asst_7gIwcj44bbmqnnZHv6J8W3VY",
};

export const DEFAULT_TOPIC = "yleinen";

export const fallbackAssistantId =
  process.env.OPENAI_ASSISTANT_ID || STATIC_ASSISTANT_IDS[DEFAULT_TOPIC];

export const getAssistantId = (user: any, topic?: string): string => {
  const metadata = user?.["https://solmiokassa.fi/metadata"];

  const topicId = topic && metadata?.assistant_ids?.[topic];
  const generalId = metadata?.assistant_id;

  return topicId || generalId || STATIC_ASSISTANT_IDS[topic ?? DEFAULT_TOPIC] || fallbackAssistantId;
};
