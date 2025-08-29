// app/api/assistants/threads/[threadId]/actions/route.ts
import { NextResponse } from "next/server";
import { openai } from "@/app/openai";

export const runtime = "edge";

// Next 15+: params on Promise -> odota sitä
type Ctx = { params: Promise<{ threadId: string }> };

export async function POST(request: Request, context: Ctx) {
  const { threadId } = await context.params;

  try {
    const { toolCallOutputs, runId } = await request.json();

    if (!threadId || !runId) {
      return NextResponse.json(
        { error: "Missing threadId or runId" },
        { status: 400 }
      );
    }

    // Varmista että jokainen output on string ja että tool_call_id on olemassa
    const tool_outputs = (toolCallOutputs ?? []).map((t: any) => ({
      tool_call_id: t.tool_call_id ?? t.id, // riippuu mitä client lähettää
      output: typeof t.output === "string" ? t.output : JSON.stringify(t.output),
    }));

    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      runId,
      { tool_outputs }
    );

    return new Response(stream.toReadableStream());
  } catch (err: any) {
    console.error("actions route error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
