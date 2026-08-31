import API from "./axios";

export interface ChatbotConfig {
  active_provider: string;
  available_providers: string[];
}

export const getChatbotConfig = async (): Promise<ChatbotConfig> => {
  const response = await API.get<ChatbotConfig>("/api/chatbot/config/");
  return response.data;
};

export const sendChatMessage = async (
  message: string,
  provider?: string
): Promise<string> => {
  try {
    const response = await API.post<{ answer: string }>(
      "/api/chatbot/chat/",
      { message, provider }
    );

    return response.data?.answer || "No response from server.";
  } catch (error) {
    console.error("Chat API Error:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};
