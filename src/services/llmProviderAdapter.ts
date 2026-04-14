/**
 * LLM Provider Adapter (Strategy Pattern)
 * Allows swapping between different LLM backends: Gemini, ChatGPT, Ollama, or none
 * Decouples chatbot logic from specific LLM implementation
 */

export interface ILLMProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generateResponse(prompt: string): Promise<string>;
  generateSummary(context: string): Promise<string>;
}

// ============================================
// 1. GEMINI PROVIDER (Recommended - Third-party)
// ============================================
export class GeminiProvider implements ILLMProvider {
  name = "Gemini";
  private apiKey: string;
  private apiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (import.meta.env.VITE_GEMINI_API_KEY as string) || "";
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.warn("Gemini: API key not configured");
      return false;
    }
    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "test" }] }],
        }),
      });
      return response.ok;
    } catch (error) {
      console.warn("Gemini connection check failed:", error);
      return false;
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.apiKey) throw new Error("Gemini API key not configured");

    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Gemini API error");
      }

      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate response";
    } catch (error) {
      console.error("Gemini generation error:", error);
      throw error;
    }
  }

  async generateSummary(context: string): Promise<string> {
    const prompt = `Please provide a concise summary of the following workflow document:\n\n${context}\n\nSummary:`;
    return this.generateResponse(prompt);
  }
}

// ============================================
// 2. CHATGPT PROVIDER (Recommended - Third-party)
// ============================================
export class ChatGPTProvider implements ILLMProvider {
  name = "ChatGPT";
  private apiKey: string;
  private apiEndpoint = "https://api.openai.com/v1/chat/completions";
  private model = "gpt-3.5-turbo";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (import.meta.env.VITE_OPENAI_API_KEY as string) || "";
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.warn("ChatGPT: API key not configured");
      return false;
    }
    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "user", content: "test" }],
          max_tokens: 10,
        }),
      });
      return response.ok || response.status === 429; // 429 = rate limited but available
    } catch (error) {
      console.warn("ChatGPT connection check failed:", error);
      return false;
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.apiKey) throw new Error("ChatGPT API key not configured");

    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "ChatGPT API error");
      }

      return data.choices?.[0]?.message?.content || "Unable to generate response";
    } catch (error) {
      console.error("ChatGPT generation error:", error);
      throw error;
    }
  }

  async generateSummary(context: string): Promise<string> {
    const prompt = `You are a workflow document analyst. Please provide a concise summary (3-4 sentences) of the following document:\n\n${context}\n\nSummary:`;
    return this.generateResponse(prompt);
  }
}

// ============================================
// 3. OLLAMA PROVIDER (Local - Fallback)
// ============================================
export class OllamaProvider implements ILLMProvider {
  name = "Ollama (Local)";
  private endpoint: string;
  private model: string;

  constructor(endpoint?: string, model?: string) {
    this.endpoint = endpoint || "http://localhost:11434";
    this.model = model || "mistral";
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`);
      return response.ok;
    } catch (error) {
      console.warn("Ollama not available:", error);
      return false;
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.endpoint}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
        }),
      });

      const data = await response.json();
      return data.response || "Unable to generate response";
    } catch (error) {
      console.error("Ollama generation error:", error);
      throw error;
    }
  }

  async generateSummary(context: string): Promise<string> {
    const prompt = `Summarize this workflow document concisely:\n\n${context}\n\nSummary:`;
    return this.generateResponse(prompt);
  }
}

// ============================================
// 4. MOCK PROVIDER (Testing / Fallback)
// ============================================
export class MockProvider implements ILLMProvider {
  name = "Mock (Template-based)";

  async isAvailable(): Promise<boolean> {
    return true; // Always available for fallback
  }

  async generateResponse(prompt: string): Promise<string> {
    // Template-based response logic (your current fallback)
    if (prompt.toLowerCase().includes("sla")) {
      return "Based on the document, the SLA status is actively being monitored. Please review the specific steps and timelines for more details.";
    }
    if (prompt.toLowerCase().includes("remaining")) {
      return "The document has time remaining before SLA target. Check the step-level breakdown for exact timelines.";
    }
    return "I found relevant information about your document. Please ask for specific details like SLA status or time remaining.";
  }

  async generateSummary(context: string): Promise<string> {
    // Extract basic info for template summary
    const lines = context.split("\n");
    return `Document Summary:\n- ${lines.slice(0, 3).join("\n- ")}`;
  }
}

// ============================================
// LLM PROVIDER FACTORY & ORCHESTRATOR
// ============================================
export class LLMProviderFactory {
  private static providers: ILLMProvider[] = [];

  /**
   * Initialize providers in priority order
   * Try third-party providers first, fallback to local/mock
   */
  static initializeProviders(config: {
    geminiKey?: string;
    chatGptKey?: string;
    ollamaEndpoint?: string;
    ollamaModel?: string;
  }) {
    this.providers = [
      new GeminiProvider(config.geminiKey),
      new ChatGPTProvider(config.chatGptKey),
      new OllamaProvider(config.ollamaEndpoint, config.ollamaModel),
      new MockProvider(), // Always last as fallback
    ];
  }

  /**
   * Get the first available provider
   * Will test availability in order: Gemini → ChatGPT → Ollama → Mock
   */
  static async getAvailableProvider(): Promise<ILLMProvider> {
    for (const provider of this.providers) {
      try {
        if (await provider.isAvailable()) {
          console.log(`Using LLM Provider: ${provider.name}`);
          return provider;
        }
      } catch {
        console.warn(`${provider.name} failed availability check`);
      }
    }
    // Fallback to Mock if no providers available
    console.warn("All LLM providers unavailable, using Mock provider");
    return this.providers[this.providers.length - 1] || new MockProvider();
  }

  /**
   * Generate response using best available provider
   */
  static async generateResponse(prompt: string): Promise<string> {
    const provider = await this.getAvailableProvider();
    return provider.generateResponse(prompt);
  }

  /**
   * Generate summary using best available provider
   */
  static async generateSummary(context: string): Promise<string> {
    const provider = await this.getAvailableProvider();
    return provider.generateSummary(context);
  }
}
