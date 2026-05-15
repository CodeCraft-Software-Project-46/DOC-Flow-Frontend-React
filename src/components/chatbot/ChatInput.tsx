//Input box + send button

import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
  const [text, setText] = useState(""); //Stores what user is typing

  const handleSend = () => {
    if (!text.trim() || loading) return; //Prevents sending empty messages or multiple messages while waiting for response

    onSend(text.trim());  //sends message to ChatWidget

    setText("");
  };

  return (
    <div className="flex gap-2 border-t p-3 bg-white items-end">
      <textarea
        value={text}
        placeholder="Ask something..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Enter sends, Shift+Enter adds a new line.
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        rows={2}
        className="flex-1 border rounded-lg px-3 py-3 text-sm outline-none resize-none max-h-28 overflow-y-auto"
      />

      <button
        onClick={handleSend}
        disabled={loading} // Disable send button while loading to prevent multiple sends
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        {loading ? "..." : "Send"}  
      </button>
    </div>
  );
}
