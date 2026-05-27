import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessageComponent from "./ChatMessage";
import type { ChatMessage } from "../../types/chatTypes";
import { sendChatMessage } from "../../api/chatService";

export default function ChatWidget() {
  const [open, setOpen] = useState(false); //controls chat popup visibility
  const [expanded, setExpanded] = useState(false); //toggles a slightly larger chat window

  const [loading, setLoading] = useState(false); //shows "Typing..." when waiting for backend

  const [messages, setMessages] = useState<ChatMessage[]>([ //Stores all chat messages
    {
      id: "1", 
      role: "assistant",
      content: "Hi 👋 Ask me anything about workflows!",
    },
  ]); //stores conversation history, starting with a welcome message from the assistant

  const handleSend = async (text: string) => { //Called when user sends a message from ChatInput
    const userMessage: ChatMessage = { 
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]); //Create user message

    try {
      setLoading(true); //Start loading

      const answer = await sendChatMessage(text); //Call backend API

      const assistantMessage: ChatMessage = { //Create assistant response
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {            //Error handling
      let errorMessage = "Unable to connect to chatbot server.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessages((prev) => [//Add assistant message
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
        onClick={() => setOpen(!open)} //Toggle chat visibility when clicking the chat icon button
        className="fixed bottom-5 right-5 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg text-xl z-50"
      >
        💬
      </button>

      {open && (
        <div
          className={`fixed bottom-24 right-5 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-200 ${
            expanded ? "w-[500px] h-[700px]" : "w-[350px] h-[500px]" // Set width and height based on expanded state
          }`}
        >
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="font-semibold">AI Assistant</h2>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setExpanded((prev) => !prev)} //Toggle expanded state
                aria-label={expanded ? "Shrink chat" : "Expand chat"}
                title={expanded ? "Shrink" : "Expand"}
                className="text-sm leading-none"
              >
                {expanded ? "▢" : "□"}
              </button>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.map((message) => ( //Render each message using ChatMessageComponent
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
