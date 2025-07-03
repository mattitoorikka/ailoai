"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { useAssistantId } from "@/app/hooks/useAssistantId";

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
  topic: string;
  assistantId?: string;
};

const Message = ({ role, text }: MessageProps) => {
  if (role === "code") {
    return (
      <div className={styles.placeholder}>
        Luodaan raporttia, odota hetki...
      </div>
    );
  }

  const isTyping = text.includes("Kirjoitetaan vastausta");
  const className =
    role === "assistant"
      ? `${styles.assistantMessage} ${isTyping ? styles.typing : ""}`
      : styles.userMessage;

  return (
    <div className={className}>
      {role === "assistant" ? <Markdown>{text}</Markdown> : text}
    </div>
  );
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""),
  topic,
  assistantId: assistantIdFromProps,
}: ChatProps) => {
  const resolvedId = useAssistantId(topic);
  const assistantId = assistantIdFromProps || resolvedId;

  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestionsByTopic: Record<string, string[]> = {
    markkinointi: [
      "📢 Ehdota kampanja ensi viikon asiakasryhmälle.",
      "💡 Tee kolme ideaa Instagram-postaukseen lounasteemalla.",
      "📍 Miten hyödynnän paikallisen tapahtuman näkyvyyttä somessa?",
      "📅 Voitko laatia koko viikon somejulkaisut?",
      "🧊 Tee näyttöteksti iltapäivän tarjousjuomalle.",
      "🎲 Yllätä minut markkinointi-idealla!",
    ],
    valikoima: [
      "📆 Luo 2 viikon kiertävä lounaslista nykyisillä laitteilla.",
      "🥣 Kokki sairastui, tee helppo ruokalista ensi viikolle.",
      "🥦 Lisää vegaanivaihtoehtoja ilman lisäkuormaa keittiölle.",
      "💸 Paranna katetta muuttamalla torstain menua.",
      "📋 Hyödynnä nämä raaka-aineet ja tee lista huomiselle.",
      "🎲 Yllätä minut valikoimalla!",
    ],
    yleinen: [
      "📋 Tarvitsen selkeän viikkoinfon henkilökunnalle.",
      "🧊 Kylmiö ei toimi – tee ohje tai viesti tiimille.",
      "🏕️ Kirjoita tuuraajalle ohjeet pisteen avaamiseen.",
      "📢 Laadi näyttöteksti päivän ruoille ja aukioloille.",
      "💬 Tee vastaus asiakkaalle, joka kysyy gluteenitonta ruokaa.",
      "🎲 Yllätä minut käytännön ohjeella!",
      "📄 Miten teen anniskelun puolivuotis-ilmoituksen?",
    ],
    tarjouspyynnot: [
      "📄 Laadi tarjous 60 hengen iltajuhlaan, buffet-mallilla.",
      "🧾 Analysoi tämä tarjouspyyntö ja kerro mitä se edellyttää.",
      "🍽️ Ehdota ruokalista, jossa otettu huomioon halal ja vegaani.",
      "💰 Miten varmistan hyvän katteen ilman ylikuormitusta?",
      "✉️ Tee saateviesti sähköpostin liitteeksi.",
      "🎲 Yllätä minut tarjousidealla!",
    ],
    hr: [
      "📑 Tee työsopimus kausityöntekijälle, 30h/viikko.",
      "📅 Miten osa-aikaisen työntekijän lomat määräytyvät?",
      "⚠️ Voinko antaa huomautuksen jatkuvasta myöhästymisestä?",
      "👋 Kirjoita perehdytysohje uudelle salityöntekijälle.",
      "📄 Tee neutraali työtodistus määräaikaiselle työntekijälle.",
      "🎲 Yllätä minut HR-aiheisella vinkillä!",
    ],
  };
  

  const suggestions = suggestionsByTopic[topic] || suggestionsByTopic["yleinen"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (threadId) return; // Älä luo uudelleen

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch("/api/assistants/threads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });
          const data = await res.json();
          setThreadId(data.threadId);
        } catch (err) {
          console.error("Thread creation (with location) failed:", err);
        }
      },
      async () => {
        try {
          const res = await fetch("/api/assistants/threads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          const data = await res.json();
          setThreadId(data.threadId);
        } catch (err) {
          console.error("Thread creation (fallback) failed:", err);
        }
      },
      { timeout: 5000 }
    );
  }, [threadId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() && !selectedImage) {
      alert("Please provide a message or upload an image.");
      return;
    }
    if (!assistantId) {
      alert("assistantId puuttuu.");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: userInput || "Image sent" }]);
    const tempInput = userInput;
    setUserInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setInputDisabled(true);

    const fd = new FormData();
    fd.append("assistantId", assistantId);
    if (tempInput) fd.append("content", tempInput);
    if (selectedImage) fd.append("file", selectedImage);

    try {
      const res = await fetchWithTimeout(
        fetch(`/api/assistants/threads/${threadId}/messages`, {
          method: "POST",
          body: fd,
        }),
        60_000
      );
      if (!res.body) throw new Error("Empty response body");
      const stream = AssistantStream.fromReadableStream(res.body);
      handleReadableStream(stream);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Vastauksessa tapahtui virhe tai se viivästyi. Yritä uudelleen.",
        },
      ]);
    } finally {
      setInputDisabled(false);
    }
  };

  const fetchWithTimeout = (fetchPromise: Promise<Response>, timeout: number) =>
    Promise.race([
      fetchPromise,
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeout)
      ),
    ]);

  const handleReadableStream = (stream: AssistantStream) => {
    setMessages((prev) => {
      const exists = prev.some(
        (m) => m.role === "assistant" && m.text === "💬 Kirjoitetaan vastausta"
      );
      return exists ? prev : [...prev, { role: "assistant", text: "💬 Kirjoitetaan vastausta" }];
    });

    stream.on("textDelta", (delta) => delta.value && appendToLastMessage(delta.value));
    stream.on("textCreated", () =>
      setMessages((prev) =>
        prev.map((m) =>
          m.role === "assistant" && m.text.startsWith("💬") ? { ...m, text: "" } : m
        )
      )
    );
    stream.on("event", async (e: AssistantStreamEvent.ThreadRunRequiresAction) => {
      if (e.event === "thread.run.requires_action") await handleRequiresAction(e);
      if (e.event === "thread.run.completed") setInputDisabled(false);
    });
  };

  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;

    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (t) => ({
        output: await functionCallHandler(t),
        tool_call_id: t.id,
      }))
    );

    const res = await fetch(`/api/assistants/threads/${threadId}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, toolCallOutputs }),
    });

    if (res.body) handleReadableStream(AssistantStream.fromReadableStream(res.body));
  };

  const appendToLastMessage = (text: string) =>
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), { ...last, text: last.text + text }];
    });

  if (!assistantId) {
    return (
      <div className={styles.ChatContainer}>
        <p>🔄 Ladataan käyttäjäkohtaista assistenttia...</p>
      </div>
    );
  }

  return (
    <div className={styles.ChatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {userInput.trim() === "" && messages.length === 0 && (
        <div className={styles.suggestions}>
          <h2>Miten voin auttaa sinua tänään?</h2>
          <div className={styles.suggestionButtons}>
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                type="button"
                className={styles.suggestionButton}
                onClick={() => setUserInput(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`${styles.inputForm} ${styles.clearfix}`}>
        {imagePreview && (
          <div className={styles.imagePreview}>
            <img src={imagePreview} alt="Selected preview" className={styles.previewImage} />
          </div>
        )}
        <label htmlFor="fileInput" className={styles.iconButton}>
          📎
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.doc,.docx,.csv,.json,.txt,.jpg,.jpeg,.png"
          className={styles.hiddenFileInput}
          onChange={handleImageChange}
        />
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Kirjoita viestisi..."
          disabled={inputDisabled}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled || !userInput.trim() || !threadId}
          >
          ➤
        </button>

        
      </form>

      <p className={styles.chatDisclaimer}>
        Keskustelusi ovat yksityisiä. Niitä ei käytetä koulutukseen.
      </p>
    </div>
  );
};

export default Chat;
