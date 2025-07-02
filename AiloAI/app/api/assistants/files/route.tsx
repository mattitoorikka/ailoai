import { openai } from "@/app/openai";

async function parseRequestData(req: Request) {
  const contentType = req.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const json = await req.json();
    return { ...json };
  }

  if (contentType?.includes("multipart/form-data")) {
    const formData = await req.formData();
    const obj: Record<string, any> = {};
    formData.forEach((value, key) => (obj[key] = value));
    return obj;
  }

  return {};
}

const getOrCreateVectorStore = async (assistantId: string) => {
  try {
    const assistant = await openai.beta.assistants.retrieve(assistantId);

    const existing = assistant.tool_resources?.file_search?.vector_store_ids?.[0];
    if (existing) return existing;

    const vectorStore = await openai.vectorStores.create({
      name: `vector-store-${assistantId}`,
    });

    await openai.beta.assistants.update(assistantId, {
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });

    return vectorStore.id;
  } catch (error) {
    console.error("Error in getOrCreateVectorStore:", error);
    throw error;
  }
};

export async function POST(request: Request) {
  try {
    const data = await parseRequestData(request);
    const assistantId = data.assistantId as string | undefined;
    const action = data.action;
    const file = data.file as File | undefined;

    if (!assistantId) {
      return new Response("assistantId missing", { status: 400 });
    }

    const vectorStoreId = await getOrCreateVectorStore(assistantId);

    if (action === "list") {
      const fileList = await openai.vectorStores.files.list(vectorStoreId);

      const filesArray = await Promise.all(
        fileList.data.map(async (file) => {
          try {
            const fileDetails = await openai.files.retrieve(file.id);
            const vectorFileDetails = await openai.vectorStores.files.retrieve(
              vectorStoreId,
              file.id
            );
            return {
              file_id: file.id,
              filename: fileDetails.filename,
              status: vectorFileDetails.status,
            };
          } catch (error) {
            console.error(`Error retrieving file ${file.id}:`, error);
            return {
              file_id: file.id,
              filename: "Unknown",
              status: "error",
            };
          }
        })
      );

      return Response.json(filesArray);
    }

    if (file instanceof File) {
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        return new Response("File too large", { status: 400 });
      }

      const openaiFile = await openai.files.create({
        file,
        purpose: "assistants",
      });

      await openai.vectorStores.files.create(vectorStoreId, {
        file_id: openaiFile.id,
      });

      return Response.json({
        message: "File uploaded successfully",
        file_id: openaiFile.id,
        filename: file.name,
      });
    }

    return new Response("No file or action provided", { status: 400 });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await parseRequestData(request);
    const { assistantId, fileId } = data;

    if (!assistantId || !fileId) {
      return new Response("assistantId or fileId missing", { status: 400 });
    }

    const vectorStoreId = await getOrCreateVectorStore(assistantId);

    await openai.vectorStores.files.del(vectorStoreId, fileId);

    try {
      await openai.files.del(fileId);
    } catch (error) {
      console.warn("Could not delete file from OpenAI storage:", error);
    }

    return Response.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}
