# Ollama Local LLM Setup Guide

The ChatBot now integrates with **Ollama** for intelligent document summarization. When users ask for summaries, the system will attempt to use Ollama before falling back to template-based summaries.

---

## Quick Start

### 1. Install Ollama
- Download from: https://ollama.ai
- Or via package manager:
  ```bash
  # macOS (Homebrew)
  brew install ollama
  
  # Linux (apt)
  curl https://ollama.ai/install.sh | sh
  
  # Windows
  # Download installer from ollama.ai
  ```

### 2. Pull a Model
Open a terminal and run:
```bash
ollama pull mistral
```

Available models (pick one):
- `mistral` — Fast, good quality (recommended, used by default)
- `llama2` — More capable, larger
- `neural-chat` — Conversation optimized
- `orca-mini` — Smaller, lighter

### 3. Start Ollama Server
In a terminal, run:
```bash
ollama serve
```

You should see:
```
2026/03/04 10:30:45 "Listening on 127.0.0.1:11434"
```

**Leave this terminal running.** Ollama listens on `http://localhost:11434`

### 4. Test Connection
In another terminal:
```bash
curl http://localhost:11434/api/tags
```

Should return JSON with available models.

### 5. Use in ChatBot
The ChatBot is already configured! When a user asks:
- **"Summarize PO-2024-0112"** → Chatbot sends request to Ollama → Returns intelligent summary
- **"What is the SLA status?"** → Chatbot generates contextual response

---

## How It Works (Under the Hood)

When user asks for a summary:

```
User says: "Summarize GRN-2024-0041"
    ↓
ChatBot detects: queryType = "summary"
    ↓
Service retrieves: Document details + workflow steps
    ↓
Service calls: generateSummaryViaLocalModel(context, "mistral")
    ↓
Ollama processes locally (no data leaves your machine)
    ↓
Returns: "Completed 3/4 steps, SLA deficit 2 hours..."
    ↓
User sees: Intelligent summary in chat
```

If Ollama is **not running**, system automatically falls back to:
```
generateSummaryViaTemplate() → returns key stats (instant, no AI)
```

---

## Configuration

### Change Default Model
Edit [src/services/chatbotService.ts](src/services/chatbotService.ts), line ~38:

```typescript
// Current:
const ollamaSummary = await generateSummaryViaLocalModel(context, "mistral");

// Change to:
const ollamaSummary = await generateSummaryViaLocalModel(context, "llama2");
```

### Change Ollama Port
If not using default `localhost:11434`, edit [src/services/chatbotService.ts](src/services/chatbotService.ts), line ~274:

```typescript
const response = await fetch("http://localhost:11434/api/generate", {
  // Change 11434 to your port
```

### Increase Response Quality
Add parameters to Ollama call in [src/services/chatbotService.ts](src/services/chatbotService.ts):

```typescript
// Current (fast):
fetch("http://localhost:11434/api/generate", {
  body: JSON.stringify({
    model: "mistral",
    prompt: `Summarize...`,
    stream: false,
  }),
})

// Better quality (slower):
fetch("http://localhost:11434/api/generate", {
  body: JSON.stringify({
    model: "mistral",
    prompt: `Summarize...`,
    stream: false,
    options: {
      temperature: 0.7,    // Lower = more focused
      top_k: 40,
      top_p: 0.9,
    }
  }),
})
```

---

## Troubleshooting

### Error: "Local model server not available"
- Check Ollama is running: `ollama serve` in a terminal
- Default port is `localhost:11434`
- Try: `curl http://localhost:11434/api/tags`

### Responses are slow
- Model size matters: `mistral` (4GB) < `llama2` (7GB)
- GPU acceleration: Ollama uses GPU if available (NVIDIA/Apple)
- Check system resources (RAM, CPU)

### Want to switch to API instead?
Edit [src/services/chatbotService.ts](src/services/chatbotService.ts):

```typescript
// Replace:
const ollamaSummary = await generateSummaryViaLocalModel(context, "mistral");

// With:
const ollamaSummary = await generateSummaryViaLLMAPI(context, "openai");
// OR
const ollamaSummary = generateSummaryViaTemplate(retrievedInstances.instances[0]);
```

---

## Example Queries to Try

1. **Check SLA Status:**
   - "What is the SLA status of PO-2024-0112?"
   - "Is GRN-2024-0041 breached?"

2. **Summarize Documents:**
   - "Summarize GRN-2024-0041"
   - "Give me a summary of SRN-2024-0021"

3. **Time Remaining:**
   - "How much time left for PO-2024-0112?"
   - "Time remaining for SRN-2024-0021?"

4. **General Questions:**
   - "Which workflows are at risk?"
   - "Show me all breached documents"

---

## Privacy & Security

✅ All data stays local (no external API calls)
✅ Ollama runs on your machine
✅ No cloud storage or logs
✅ Device-scoped (localhost:11434)

---

## Performance Expectations

| Action | Time | Model Size | GPU |
|--------|------|-----------|-----|
| SLA Status Query | <1s | N/A (template) | — |
| Summary (with Ollama) | 2-5s | mistral: 4GB | Yes: 0.5s |
| Template Fallback | <0.5s | N/A | — |

---

## Next Steps

1. Install Ollama: https://ollama.ai
2. Run `ollama pull mistral`
3. Run `ollama serve` in a terminal
4. Open the app and try asking the chatbot: **"Summarize PO-2024-0112"**

That's it! The chatbot will use Ollama for answers. 🚀
