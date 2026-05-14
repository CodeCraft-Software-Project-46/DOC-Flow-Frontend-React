/* =========================
   CHAT MESSAGE - Used in ChatMessage.tsx and ChatWidget.tsx
========================= */

// Individual chat message in the conversation
export interface ChatMessage {
  id: string;                           // unique message identifier
  role: "user" | "assistant";           // sender type
  content: string;                      // message text
}