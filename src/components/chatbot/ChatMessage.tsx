import type { ChatMessage } from "../../types/chatTypes";

interface Props {
  message: ChatMessage;
}

export default function ChatMessageComponent({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] break-words ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
