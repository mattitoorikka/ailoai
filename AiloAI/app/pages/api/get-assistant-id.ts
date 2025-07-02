
import { getSession } from "@auth0/nextjs-auth0";
import { getAssistantId } from "@/app/assistant-config";

export default async function handler(req, res) {
  const session = await getSession(req, res);

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized: No session found" });
  }

  // Ota topic query-parametrista, oletuksena "yleinen"
  const topic = typeof req.query.topic === "string" ? req.query.topic : "yleinen";

  const assistantId = getAssistantId(session.user, topic);

  if (!assistantId) {
    return res.status(404).json({ error: "Assistant ID not found in metadata" });
  }

  return res.status(200).json({ assistantId });
}
