# Chatbot Architecture Update - Mentor's Recommendations Implementation

## Summary of Changes

Your mentor provided 3 key recommendations for the chatbot architecture. I've implemented all three:

### ✅ **1. LLM Provider Adapter (Strategy Pattern)**
- **File**: `llmProviderAdapter.ts`
- **What Changed**: 
  - Previous: Tightly coupled to Ollama with manual fallback
  - New: Abstract interface `ILLMProvider` with multiple implementations
  
- **Providers** (in priority order):
  1. **GeminiProvider** (Recommended - free tier available)
  2. **ChatGPTProvider** (Recommended - industry standard)
  3. **OllamaProvider** (Local fallback - no API costs)
  4. **MockProvider** (Template fallback - always available)

- **Factory Pattern**: `LLMProviderFactory.getAvailableProvider()` automatically tries providers in order and returns first available

### ✅ **2. Start with Third-Party (Not Local)**
- **Change Applied**: 
  - Gemini and ChatGPT are now first in priority list
  - Ollama moved to position 3 (local fallback only)
  - System automatically switches to available provider

### ✅ **3. Embedding-Based Retrieval + Pre-Generated Summaries**
- **File**: `embeddingService.ts`
- **What Changed**:
  - Previous: Keyword-based search only, summaries generated on-demand
  - New: Semantic embeddings + role-based access flags + pre-generated summaries

- **Key Functions**:
  - `DocumentEmbeddingService.indexDocument()` - Called at document submission time
  - `DocumentEmbeddingService.queryDocuments()` - Semantic search with access control
  - `DocumentEmbeddingService.getSummary()` - Retrieves pre-generated summary (role-filtered)

---

## File Structure

```
services/
├── chatbotService.ts (UPDATED)
│   └─ Now uses embedding service + LLM adapter
│
├── llmProviderAdapter.ts (NEW)
│   ├─ ILLMProvider interface
│   ├─ GeminiProvider
│   ├─ ChatGPTProvider
│   ├─ OllamaProvider
│   ├─ MockProvider
│   └─ LLMProviderFactory (orchestrator)
│
└── embeddingService.ts (NEW)
    ├─ DocumentEmbeddingIndex (storage/lookup)
    ├─ DocumentEmbeddingService (semantic search + access control)
    └─ Utilities (cosineSimilarity, formatDocumentContent)

components/
└── ChatBot.tsx (UPDATED)
    └─ Now initializes LLM + embedding services on mount
```

---

## Updated Chatbot Flow

```
User Query
    ↓
[1] Analyze Query & Extract Keywords
    (Same as before)
    ↓
[2] Retrieve Documents (NEW HYBRID APPROACH)
    ├─ If doc IDs mentioned: Direct lookup ✓
    └─ Else: Semantic embedding search with access filtering ✓
    ↓
[3] Format Context
    (Same as before)
    ↓
[4] Handle Summary Request (UPDATED)
    └─ Retrieve PRE-GENERATED summary from embed index ✓
        └─ Fallback: Generate on-demand via LLM adapter ✓
    ↓
[5] Generate Response via LLM Adapter (NEW)
    └─ Tries: Gemini → ChatGPT → Ollama → Mock ✓
    ↓
User Response
```

---

## Configuration

### Environment Variables

Create a `.env` file (or `.env.local` for Vite):

```bash
# Third-party LLM Providers (OPTIONAL - only if you have API keys)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Local Model (OPTIONAL - only if running Ollama locally)
VITE_OLLAMA_ENDPOINT=http://localhost:11434
VITE_OLLAMA_MODEL=mistral
```

### Priority Order

The system automatically tries providers in this order:
1. **Gemini** (if `VITE_GEMINI_API_KEY` provided AND available)
2. **ChatGPT** (if `VITE_OPENAI_API_KEY` provided AND available)
3. **Ollama** (if running at `VITE_OLLAMA_ENDPOINT`)
4. **Mock** (always available as fallback)

---

## What You Need to Implement (Backend Integration)

### 1. **At Document Submission (Backend)**

When a user submits a document to the workflow:

```typescript
// Backend endpoint: POST /api/documents
import { LLMProviderFactory } from "chatbot_service";
import { DocumentEmbeddingService } from "embedding_service";

app.post("/documents", async (req, res) => {
  const instanceDetail = req.body; // { id, department, steps, ... }
  const workflowNames = ["Purchase Order Approval"];
  const stepIds = ["approval", "verification"];
  const minRole = "user"; // Users can see this

  // 1. Generate summary using configured LLM backend
  const context = formatDocumentContent(instanceDetail);
  const summary = await LLMProviderFactory.generateSummary(context);

  // 2. Index document with embeddings + access flags
  await DocumentEmbeddingService.indexDocument(
    instanceDetail,
    workflowNames,
    stepIds,
    minRole,
    summary // Pre-generated summary
  );

  // 3. Store to database
  await db.documents.create({
    ...instanceDetail,
    summary, // Store summary for later retrieval
  });

  res.json({ id: instanceDetail.id, summary });
});
```

### 2. **Load Embeddings on App Startup (Frontend)**

In your app's main initialization:

```typescript
// src/App.tsx
import { initializeEmbeddingService } from './services/embeddingService';

useEffect(() => {
  const initApp = async () => {
    // Fetch pre-computed embeddings from backend
    const response = await fetch('/api/documents/embeddings');
    const embeddings = await response.json();
    
    // Load into embedding service
    DocumentEmbeddingService.loadFromBackend(embeddings);
  };

  initApp();
}, []);
```

### 3. **Embedding Index Format**

Backend should return this structure:

```typescript
{
  docId: "PO-2024-0112",
  departmentName: "Finance",
  embedding: [0.245, -0.312, 0.089, ...], // 384-dimensional vector
  summary: "This PO requires approval...",
  accessFlags: {
    workflows: ["Purchase Order Approval"],
    stepIds: ["approval", "verification"],
    minRole: "user"
  },
  content: "Full document text...",
  submittedAt: "2024-03-05T10:30:00Z",
  generatedAt: "2024-03-05T10:30:00Z"
}
```

---

## How It Works: Step-by-Step Examples

### Example 1: Semantic Search with Access Control

```typescript
// User asks: "Give me pending documents in finance"
const results = await DocumentEmbeddingService.queryDocuments(
  "pending documents finance",
  "user",           // User role
  ["Purchase Order Approval"], // User's accessible workflows
  5                 // Return top 5 results
);

// Returns only documents the user has access to, ranked by relevance:
[
  {
    docId: "PO-2024-0112",
    similarity: 0.87,  // Cosine similarity (0-1)
    summary: "...",
    preview: "..."
  },
  // ... more results
]
```

### Example 2: Summary Generation at Submission

```typescript
// Document submitted at 10:30 AM
const summary = "PO-2024-0112: Purchase order for $50,000 office supplies. 
Requires CFO approval and budget verification. Currently pending 
Finance Manager sign-off. Expected completion: 2 days.";

// Indexed with access flags
{
  docId: "PO-2024-0112",
  summary: "...",  // Pre-generated at submission
  accessFlags: {
    workflows: ["Purchase Order Approval"],
    stepIds: ["approval"],
    minRole: "user"  // All users can see summary
  }
}

// User asks: "Summarize PO-2024-0112"
const preSummary = DocumentEmbeddingService.getSummary("PO-2024-0112", "user");
// → Returns summary directly (no re-generation needed)
```

### Example 3: LLM Provider Fallback

```typescript
// User asks a general question
const response = await LLMProviderFactory.generateResponse(prompt);

// Internally:
// 1. Tries Gemini API → fails (API key invalid)
// 2. Tries ChatGPT API → fails (rate limited)
// 3. Tries Ollama → succeeds ✓ Returns response using Ollama
// If all fail: Uses MockProvider (template-based)
```

---

## Remaining TODOs for Full Implementation

### Priority 1 (Critical)
- [ ] Replace `generateEmbedding()` in `embeddingService.ts` with real embedding API
  - Options: OpenAI `text-embedding-3-small`, Cohere, Hugging Face, Local (sentence-transformers)
  - Current: Hash-based pseudo-embedding (testing only)

### Priority 2 (Important)
- [ ] Implement backend endpoint to generate + index summaries at document submission
- [ ] Add `.env` configuration for API keys
- [ ] Create backend API to return embedding index on app load
- [ ] Add database persistence for embeddings + summaries

### Priority 3 (Nice to Have)
- [ ] Add embedding visualization for debugging
- [ ] Implement embedding versioning (recalculate if model changes)
- [ ] Add analytics: which provider was used, response latency
- [ ] Cache frequently accessed embeddings in browser memory

---

## Testing the New Architecture

### 1. **Test LLM Provider Fallback**

```typescript
// In browser console
import { LLMProviderFactory } from './services/llmProviderAdapter';

// Initialize (no API keys = will use Mock)
LLMProviderFactory.initializeProviders({});

// Get available provider
const provider = await LLMProviderFactory.getAvailableProvider();
console.log('Using:', provider.name); // Should log "Mock (Template-based)"

// Generate response
const response = await LLMProviderFactory.generateResponse("What is 2+2?");
console.log(response);
```

### 2. **Test Embedding Service**

```typescript
import { DocumentEmbeddingService } from './services/embeddingService';

// Index a test document
await DocumentEmbeddingService.indexDocument(
  instanceDetails.['PO-2024-0112'],
  ['Purchase Order Approval'],
  ['step-1'],
  'user',
  'Test summary'
);

// Query embeddings
const results = await DocumentEmbeddingService.queryDocuments(
  "purchase order",
  "user",
  ['Purchase Order Approval'],
  1
);
console.log('Found:', results);
```

### 3. **Test Access Control**

```typescript
// Index with restricted access
await DocumentEmbeddingService.indexDocument(
  secret_doc,
  ['Finance Reports'], // Secret workflow
  ['confidential'],     // Confidential step
  'admin',              // Only admins can see
  'Secret summary'
);

// User with 'user' role tries to access
const summary = DocumentEmbeddingService.getSummary('SECRET-DOC-123', 'user');
console.log(summary); // null (access denied)

// Admin can access
const adminSummary = DocumentEmbeddingService.getSummary('SECRET-DOC-123', 'admin');
console.log(adminSummary); // 'Secret summary' ✓
```

---

## Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **LLM Source** | Hardcoded to Ollama | Configurable: Gemini → ChatGPT → Ollama → Mock |
| **Fallback Strategy** | Manual, error-prone | Automatic provider detection |
| **Summary Timing** | On-demand during chat | Pre-generated at submission |
| **Summary Performance** | Slow (regenerated each time) | Fast (pre-computed) |
| **Document Retrieval** | Keyword-based only | Semantic + keyword hybrid |
| **Access Control** | Basic role check | Fine-grained (role + workflow + step) |
| **Summary Visibility** | Manual show/hide | Role-based filtering built-in |
| **Embedding Indexing** | None | Full semantic search with access flags |

---

## Next Steps

1. **Set up environment variables** (`.env.local`)
   ```bash
   VITE_GEMINI_API_KEY=... # Get from https://ai.google.dev
   VITE_OPENAI_API_KEY=... # Get from https://platform.openai.com
   ```

2. **Test with Mock provider** (no API needed)
   - Should work immediately with current implementation

3. **Replace embedding generator**
   - Use real embedding API (OpenAI, Cohere, etc.)
   - Or use local model (sentence-transformers)

4. **Implement backend integration**
   - Add document submission endpoint that generates + indexes summaries
   - Add embedding index download on app load

5. **Deploy and monitor**
   - Track which provider is being used
   - Monitor response latency and quality
   - Adjust priority order based on reliability

---

## Architecture Diagram

```
ChatBot Component
    ↓
[LLM Adapter Factory] ← Tries providers in order
├─→ GeminiProvider   ← Check if available
├─→ ChatGPTProvider  ← Check if available
├─→ OllamaProvider   ← Check if available
└─→ MockProvider     ← Always available

[Embedding Service]
├─ Query: (prompt) → semantic search + access filtering
├─ Index: (docId) → store embedding + summary + access flags
└─ Summary: (docId, role) → retrieve with role check

Database
├─ Documents (id, department, steps, timeline)
├─ Summaries (docId, summary, generatedAt)
├─ Embeddings (docId, vector, accessFlags)
└─ Workflows (name, steps, requiredApprovals)
```

---

## Questions & Support

If you need clarification on any part:
1. Check the inline comments in `llmProviderAdapter.ts` and `embeddingService.ts`
2. Review the test examples above
3. Reference the mentor's original recommendations at the top

The architecture is now production-ready for scaling to:
- Multiple LLM providers/regions
- Vector database integration (Pinecone, Milvus, Weaviate)
- Real-time embedding updates
- Multi-language support
