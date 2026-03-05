// ChatBot component — RAG-based local Q&A for workflow documents
// Retrieves role-filtered data from dummyData, answers questions locally

import { useState, useRef, useEffect } from "react";
import { Send, Maximize2, Minimize2 } from "lucide-react";
import { INSTANCES, INSTANCE_DETAILS } from "../data/dummyData";
import { generateChatResponse } from "../services/chatbotService";
import { LLMProviderFactory } from "../services/llmProviderAdapter";
import { initializeEmbeddingService } from "../services/embeddingService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  userRole?: "admin" | "manager" | "user"; // Role-based access control
  userWorkflows?: string[]; // Which workflows user can access
}

export default function ChatBot({ userRole = "user", userWorkflows = [] }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your DocFlow assistant. Ask me about document status, SLA remaining time, or generate summaries. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize LLM providers and embedding service on mount
  useEffect(() => {
    const initializeServices = async () => {
      // Initialize LLM Provider with environment variables
      // In production, these would come from .env or backend config
      LLMProviderFactory.initializeProviders({
        geminiKey: import.meta.env.VITE_GEMINI_API_KEY,
        chatGptKey: import.meta.env.VITE_OPENAI_API_KEY,
        ollamaEndpoint: import.meta.env.VITE_OLLAMA_ENDPOINT || "http://localhost:11434",
        ollamaModel: import.meta.env.VITE_OLLAMA_MODEL || "mistral",
      });

      // Initialize embedding service
      await initializeEmbeddingService();

      console.log("ChatBot services initialized");
    };

    initializeServices().catch((error) => {
      console.error("Failed to initialize chatbot services:", error);
    });
  }, []);

  // Handle user message submission
  async function handleSendMessage() {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Generate response using RAG service
      const response = await generateChatResponse(
        inputValue,
        userRole,
        userWorkflows,
        INSTANCES,
        INSTANCE_DETAILS
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
        aria-label="Open chatbot"
      >
        💬
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 bg-white rounded-lg shadow-2xl flex flex-col transition-all ${
        isExpanded
          ? "inset-6"
          : "bottom-6 right-6 w-96 h-96"
      }`}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white px-5 py-4 rounded-t-lg flex justify-between items-center">
        <div>
          <div className="font-semibold">DocFlow Assistant</div>
          <div className="text-xs text-blue-100">RAG-powered Q&A</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-blue-700 p-2 rounded transition-colors"
            aria-label="Toggle expand"
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-blue-700 px-2 py-1 rounded transition-colors text-sm font-bold"
            aria-label="Close chatbot"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-800 border border-slate-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-800 border border-slate-200 px-4 py-2 rounded-lg text-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce chat-bounce-delay-200" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce chat-bounce-delay-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about documents, SLA, summaries..."
            aria-label="Chat input"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg px-3 py-2 transition-colors"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>

        {/* Sample questions */}
        <div className="mt-3 text-xs text-slate-400">
          <div className="mb-2">Try asking:</div>
          <div className="space-y-1">
            <button
              onClick={() => setInputValue("What is the SLA status of PO-2024-0112?")}
              className="block text-blue-600 hover:underline text-left"
            >
              • "SLA status of PO-2024-0112?"
            </button>
            <button
              onClick={() => setInputValue("Summarize GRN-2024-0041")}
              className="block text-blue-600 hover:underline text-left"
            >
              • "Summarize GRN-2024-0041"
            </button>
            <button
              onClick={() => setInputValue("How much time remains for SRN-2024-0021?")}
              className="block text-blue-600 hover:underline text-left"
            >
              • "Time remaining for SRN-2024-0021?"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
