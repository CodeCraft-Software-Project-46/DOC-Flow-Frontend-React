## ChatBot RAG Service Architecture

This service implements **Retrieval Augmented Generation (RAG)** for the document workflow chatbot—enabling intelligent Q&A with role-based access control and local data processing (no external API exposure).

---

## Core Flow

```
User Query
    ↓
[1] Analyze & Extract Keywords
    ├─ Detect query type: SLA status | remaining time | summary | general
    └─ Extract document IDs (PO-2024-xxxx, GRN-2024-xxxx, etc.)
    ↓
[2] Retrieve Relevant Data
    ├─ Keyword-based or ID-based search in database
    └─ Filter by user role & permissions (role-based access control)
    ↓
[3] Format Context for Response
    ├─ Organize workflow steps, SLA metrics, timelines
    └─ Create readable context string
    ↓
[4] Generate Response Locally
    ├─ Template-based logic (current MVP)
    └─ Can upgrade to local LLM or API (see below)
    ↓
User Response (with relevant data & insight)
```

---

## Key Functions

### Main Entry Point
**`generateChatResponse()`** — Orchestrates the full RAG pipeline
- **Input:** User query, role, accessible workflows, instance data
- **Output:** Natural language response with relevant context
- **Flow:** Query analysis → Retrieval → Permissions check → Context formatting → Response generation

### Analysis & Extraction
**`analyzeQuery()`** — Detects intent and keywords
- Extracts document IDs using regex: `(PO|GRN|SRN|DP)-20\d{2}-\d{4}`
- Classifies query type: SLA status, remaining time, summary, general
- Identifies keywords for fuzzy search

**Example:**
```typescript
// Input: "What is the SLA status of PO-2024-0112?"
// Returns: { documentIds: ["PO-2024-0112"], queryType: "sla_status", keywords: [...] }
```

### Retrieval & Permissions
**`retrieveInstances()`** — Finds matching documents with access control
- Looks up specific documents by ID if provided; otherwise keyword-searches
- **Role-based filtering:**
  - **User:** sees only their assigned workflows
  - **Manager:** sees all workflows (configurable)
  - **Admin:** unrestricted access
- Returns only documents user has permission to view

**Example:**
```typescript
// Input: User role="manager", workflows=["Purchase Order"]
// If document found in "GRN Processing" workflow: NOT INCLUDED (unless manager role adjusted)
```

**`getAccessibleWorkflows()`** — Determines which workflows user can access
- `admin` → all workflows
- `manager` → all workflows (can be restricted per org)
- `user` → only their assigned workflows array

### Context Formatting
**`formatContextForLLM()`** — Structures data for readable AI response
- Lists workflow steps with status (Met/Breached/Pending)
- Shows time metrics (used/target, SLA deficit)
- Formats as markdown for LLM consumption

---

## Summary Generation Methods (Plug-in Approach)

The service provides **3 configurable methods** for generating document summaries—choose based on your needs:

### Method 1: LLM API (Most Intelligent)
**Function:** `generateSummaryViaLLMAPI()`
- Uses external LLM service (OpenAI, Anthropic, etc.)
- Pros: High quality, context-aware summaries
- Cons: Requires API key, data leaves your system, cost per request
- **Setup:**
  ```bash
  npm install openai
  # or: npm install @anthropic-ai/sdk
  ```
  ```typescript
  // Enable in chatbotService.ts when user requests summary:
  const summary = await generateSummaryViaLLMAPI(docText, "openai");
  ```

### Method 2: Local Model (Balanced)
**Function:** `generateSummaryViaLocalModel()`
- Runs AI model on your own server (Ollama, LLaMA.cpp, etc.)
- Pros: Privacy-first, no API costs, good quality
- Cons: Requires local setup, slower than cloud
- **Setup:**
  ```bash
  # Install Ollama from https://ollama.ai
  ollama pull mistral  # or your preferred model
  ollama serve         # runs on localhost:11434
  ```
  ```typescript
  // Enable when user requests summary:
  const summary = await generateSummaryViaLocalModel(docText, "mistral");
  ```

### Method 3: Template-Based (Fast & Deterministic)
**Function:** `generateSummaryViaTemplate()`
- Extracts key stats without AI: completed steps, SLA status, time deficit
- Pros: No dependencies, instant, deterministic
- Cons: Less intelligent, no NLP understanding
- **Setup:** None—works immediately

---

## Configuration & Customization

### 1. Adjust Role Permissions
Edit `getAccessibleWorkflows()` to customize role access:
```typescript
function getAccessibleWorkflows(userRole, userWorkflows) {
  if (userRole === "manager") {
    // Currently: all workflows
    // Customize: return userWorkflows.filter(wf => wf.department === userDept)
  }
}
```

### 2. Enable Summary Method
In `generateChatResponse()`, add logic to choose summary method:
```typescript
if (queryAnalysis.queryType === "summary" && retrievedInstances.instances.length > 0) {
  // Choose method based on user preference or config:
  const summary = await generateSummaryViaTemplate(retrievedInstances.instances[0]);
  // OR: const summary = await generateSummaryViaLocalModel(docText);
  // OR: const summary = await generateSummaryViaLLMAPI(docText, "openai");
}
```

### 3. Improve Keyword Extraction
Replace regex-based matching with NLP:
```
Current: Simple regex + keyword split
Better:  npm install natural (Node.js) or compromise (JS)
         Use stemming/lemmatization for smarter matching
```

---

## Integration with ChatBot Component

The `ChatBot.tsx` component calls this service:
```typescript
// In ChatBot.tsx handleSendMessage():
const response = await generateChatResponse(
  inputValue,          // user's question
  userRole,            // "admin" | "manager" | "user"
  userWorkflows,       // assigned workflow IDs
  INSTANCES,           // workflow → [summaries]
  INSTANCE_DETAILS     // docId → full details
);
```

The component:
- ✅ Handles UI (message display, input, loading state)
- ✅ Manages conversation threading
- ✅ Calls this service layer for intelligence
- ✅ Enforces role-based access at UI level (display/permissions)

---

## Example Q&A Flows

### User asks: "What is the SLA status of PO-2024-0112?"
```
1. analyzeQuery() → finds docId="PO-2024-0112", queryType="sla_status"
2. retrieveInstances() → looks up PO-2024-0112, checks user's access
3. formatContextForLLM() → "Document: Procurement, Status: In Progress, Step 2 Breached (12/10 hrs)"
4. generateResponseLocally() → "Based on the document: SLA Breach detected in Step 2..."
```

### Manager asks: "Summarize GRN-2024-0041"
```
1. analyzeQuery() → finds docId="GRN-2024-0041", queryType="summary"
2. retrieveInstances() → manager can access (role allows), retrieves all steps
3. Would call generateSummaryVia[Template|LocalModel|LLMApi]()
4. Returns: "Completed: 3/4 steps, Deficit: 2 hours, Recovery: CRITICAL"
```

### Admin asks: "Which documents are at risk?"
```
1. analyzeQuery() → no docId, queryType="general", keywords=["risk", "documents"]
2. retrieveInstances() → keyword search, admin sees ALL
3. Returns: [list of breached docs with SLA deficits]
4. Formats as: "Found 3 at-risk documents: PO-2024-51, GRN-2024-38, SRN-2024-71..."
```

---

## Error Handling

- **Invalid query type:** Falls back to generic response
- **User lacks access:** Silently filters out (returns "not found")
- **Local model unavailable:** Returns error message with helpful hint
- **No matches found:** Suggests asking with document ID or workflow name

---

## Performance Considerations

- **Keyword search:** O(n) scan through all instances—acceptable for <10k docs, may need indexing for scale
- **Role filtering:** O(1) per document—very fast
- **Local model response:** ~2-5s (depends on hardware)—consider showing "thinking..." loader
- **API LLM response:** ~1-3s (depends on service latency)

---

## Security & Privacy

✅ **No external API exposure:** Data stays within org
✅ **Role-based filtering:** Users see only their documents, enforced server-side
✅ **Keyword extraction:** Client-side only (no data sent externally)
✅ **Local model option:** Complete privacy—no cloud calls

---

## Future Enhancements

- [ ] **NLP-based keyword extraction** (higher accuracy than regex)
- [ ] **Semantic search** (embeddings-based retrieval instead of keyword match)
- [ ] **Multi-turn context** (remember previous questions in conversation)
- [ ] **Source attribution** (show which document/step the response came from)
- [ ] **Analytics** (track which questions are most common)
- [ ] **Fine-tuning** (train local model on org's actual documents)
