import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock("./axios", () => ({
  default: { get: mockGet, post: mockPost },
}));

import { getChatbotConfig, sendChatMessage } from "./chatService";

describe("chatService", () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  describe("getChatbotConfig", () => {
    it("requests the active and available providers from its endpoint", async () => {
      const payload = { active_provider: "gemini", available_providers: ["gemini", "ollama"] };
      mockGet.mockResolvedValueOnce({ data: payload });

      await expect(getChatbotConfig()).resolves.toEqual(payload);
      expect(mockGet).toHaveBeenCalledWith("/api/chatbot/config/");
    });
  });

  describe("sendChatMessage", () => {
    it("posts the message and optional provider, returning the answer", async () => {
      mockPost.mockResolvedValueOnce({ data: { answer: "There are 3 running documents." } });

      const result = await sendChatMessage("how many running documents?", "gemini");

      expect(mockPost).toHaveBeenCalledWith("/api/chatbot/chat/", {
        message: "how many running documents?",
        provider: "gemini",
      });
      expect(result).toBe("There are 3 running documents.");
    });

    it("sends provider as undefined when none is selected", async () => {
      mockPost.mockResolvedValueOnce({ data: { answer: "Hello!" } });

      await sendChatMessage("hi");

      expect(mockPost).toHaveBeenCalledWith("/api/chatbot/chat/", {
        message: "hi",
        provider: undefined,
      });
    });

    it("falls back to a default message when the response has no answer", async () => {
      mockPost.mockResolvedValueOnce({ data: {} });

      await expect(sendChatMessage("hi")).resolves.toBe("No response from server.");
    });

    describe("when the request fails", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      afterEach(() => {
        consoleErrorSpy.mockClear();
      });

      it("returns a friendly fallback instead of throwing", async () => {
        mockPost.mockRejectedValueOnce(new Error("network error"));

        await expect(sendChatMessage("hi")).resolves.toBe(
          "Sorry, something went wrong. Please try again."
        );
      });
    });
  });
});
