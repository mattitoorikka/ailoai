import { useEffect, useState } from "react";
import { STATIC_ASSISTANT_IDS, DEFAULT_TOPIC } from "@/app/assistant-config";

export function useAssistantId(topic: string = DEFAULT_TOPIC): string | null {
  const [assistantId, setAssistantId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        const topicId = data.user_metadata?.assistant_ids?.[topic];
        const generalId = data.user_metadata?.assistant_id;

        const fallback = STATIC_ASSISTANT_IDS[topic] || STATIC_ASSISTANT_IDS[DEFAULT_TOPIC];

        const resolved = topicId || generalId || fallback;

        setAssistantId(resolved);
      } catch (err) {
        console.error("Failed to fetch user metadata", err);
        const fallback = STATIC_ASSISTANT_IDS[topic] || STATIC_ASSISTANT_IDS[DEFAULT_TOPIC];
        setAssistantId(fallback);
      }
    };

    fetchMetadata();
  }, [topic]);

  return assistantId;
}
