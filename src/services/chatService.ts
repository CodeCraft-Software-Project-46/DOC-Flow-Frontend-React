import API from "./api";

export const sendChatMessage = async (
  message: string
): Promise<string> => {
  try {
    const response = await API.post<{ answer: string }>(
      "/api/chatbot/chat/",
      { message }
    );

    return response.data?.answer || "No response from server.";
  } catch (error) {
    console.error("Chat API Error:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};