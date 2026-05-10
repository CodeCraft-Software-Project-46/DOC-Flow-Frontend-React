import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({
  onSend,
  loading,
}: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || loading) return;

    onSend(text.trim());

    setText("");
  };

  return (
    <div className="flex gap-2 border-t p-3 bg-white">
      <input
        type="text"
        value={text}
        placeholder="Ask something..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && handleSend()
        }
        className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}