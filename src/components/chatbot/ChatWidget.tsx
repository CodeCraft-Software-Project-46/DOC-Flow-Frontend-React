import { useState } from "react";

import ChatInput from "./ChatInput";
import ChatMessageComponent from "./ChatMessage";

import type { ChatMessage } from "../../types/chatTypes";

import { sendChatMessage } from "../../services/chatService";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi 👋 Ask me anything about workflows!",
    },
  ]);

  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);

      const answer = await sendChatMessage(text);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      let errorMessage = "Unable to connect to chatbot server.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg text-xl z-50"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 w-[350px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="font-semibold">AI Assistant</h2>

            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.map((message) => (
              <ChatMessageComponent key={message.id} message={message} />
            ))}

            {loading && <div className="text-sm text-gray-400">Typing...</div>}
          </div>

          <ChatInput onSend={handleSend} loading={loading} />
        </div>
      )}
    </>
  );
}
