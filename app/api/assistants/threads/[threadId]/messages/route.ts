import fs from "fs";
import os from "os";
import path from "path";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;

  const formData = await request.formData();
  const assistantId = formData.get("assistantId") as string | null;
  const content = formData.get("content") as string | null;
  const file = formData.get("file") as File | null;

  if (!assistantId)
    return new Response(JSON.stringify({ error: "assistantId missing" }), { status: 400 });

  if (!content && !file)
    return new Response(JSON.stringify({ error: "Content or file is required" }), { status: 400 });

  let fileId: string | null = null;
  let isImage = false;

  // 🧾 1. Tiedoston käsittely
  if (file) {
    const tempPath = path.join(os.tmpdir(), file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      fs.writeFileSync(tempPath, uint8);

      const ext = path.extname(file.name).toLowerCase();
      isImage = [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext);

      const uploaded = await openai.files.create({
        file: fs.createReadStream(tempPath),
        purpose: isImage ? "vision" : "assistants",
      });

      fileId = uploaded.id;
    } catch (err) {
      console.error("File upload failed:", err);
      return new Response(JSON.stringify({ error: "Failed to upload file" }), { status: 500 });
    } finally {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }

  // 🧠 2. Viestin sisältö
  const messageContent: any[] = [];
  if (content) {
    messageContent.push({ type: "text", text: content });
  }
  if (fileId && isImage) {
    messageContent.push({
      type: "image_file",
      image_file: { file_id: fileId, detail: "auto" },
    });
  }

  // 📦 3. Viestirunko
  const messageInit: any = {
    role: "user",
    content: messageContent.length > 0 ? messageContent : undefined,
  };

  // 📎 Liitä ei-kuvatiedosto attachmentiksi (esim. .pdf, .docx, .txt, .xlsx)
  if (fileId && !isImage) {
    messageInit.attachments = [
      {
        file_id: fileId,
        tools: [{ type: "file_search" }], // tai "code_interpreter" jos haluat esim. analysoida exceliä
      },
    ];
  }

  try {
    await openai.beta.threads.messages.create(threadId, messageInit);

    const stream = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    });

    return new Response(stream.toReadableStream());
  } catch (err) {
    console.error("💥 Error in messages POST:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send message", detail: err }),
      { status: 500 }
    );
  }
}
