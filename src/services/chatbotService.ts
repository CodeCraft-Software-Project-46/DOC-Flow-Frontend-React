// RAG Service — Retrieval Augmented Generation for chatbot
// Matches user queries to relevant data, filters by role, generates responses locally

import type { InstanceSummary, InstanceDetail } from "../types";

interface RetrievalResult {
  instances: InstanceDetail[];
  context: string;
  queryType: "sla_status" | "remaining_time" | "summary" | "general";
}

/**
 * RAG Flow:
 * 1. Extract keywords from user query (document ID, SLA, summary, etc.)
 * 2. Retrieve matching instances from database based on keywords
 * 3. Filter by user role and permissions
 * 4. Format retrieved data as context
 * 5. Pass context + query to local LLM → natural language response
 */
export async function generateChatResponse(
  userQuery: string,
  userRole: "admin" | "manager" | "user",
  userWorkflows: string[],
  instances: Record<string, InstanceSummary[]>,
  instanceDetails: Record<string, InstanceDetail>
): Promise<string> {
  try {
    // Step 1: Detect query type and extract keywords
    const queryAnalysis = analyzeQuery(userQuery);
    const { documentIds, keywords } = queryAnalysis;

    // Step 2: Retrieve instances based on keywords & document IDs
    const retrievedInstances = retrieveInstances(
      documentIds,
      keywords,
      instances,
      instanceDetails,
      userRole,
      userWorkflows
    );

    // Step 3: If document found, generate context
    let context = "";
    if (retrievedInstances.instances.length > 0) {
      context = formatContextForLLM(retrievedInstances.instances, queryAnalysis.queryType);
    }

    // Step 4a: If user asks for summary, try Ollama first, fallback to template
    if (queryAnalysis.queryType === "summary" && retrievedInstances.instances.length > 0) {
      try {
        // Try Ollama for intelligent summary
        const ollamaSummary = await generateSummaryViaLocalModel(context, "mistral");
        return ollamaSummary;
      } catch (ollamaError) {
        // Fallback to template-based summary if Ollama unavailable
        console.warn("Ollama unavailable, using template summary:", ollamaError);
        return generateSummaryViaTemplate(retrievedInstances.instances[0]);
      }
    }

    // Step 4b: Generate response using local logic
    // (This is where you'd call a local LLM; for now using template-based logic)
    const response = generateResponseLocally(userQuery, context, queryAnalysis.queryType);

    return response;
  } catch (error) {
    console.error("Chatbot error:", error);
    return "I couldn't process that request. Please try rephrasing your question.";
  }
}

/**
 * Step 1: Analyze user query to detect intent and extract keywords
 */
function analyzeQuery(query: string): { documentIds: string[]; keywords: string[]; queryType: string } {
  const lowerQuery = query.toLowerCase();

  // Extract document IDs (PO-2024-xxxx, GRN-2024-xxxx, etc.)
  const docIdPattern = /\b(PO|GRN|SRN|DP)-20\d{2}-\d{4}\b/gi;
  const documentIds = Array.from(query.matchAll(docIdPattern)).map((m) => m[0].toUpperCase());

  // Detect query type
  let queryType = "general";
  if (lowerQuery.includes("sla") || lowerQuery.includes("breached")) queryType = "sla_status";
  if (lowerQuery.includes("remaining") || lowerQuery.includes("time")) queryType = "remaining_time";
  if (lowerQuery.includes("summary") || lowerQuery.includes("summarize")) queryType = "summary";

  // Extract other keywords
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["what", "when", "where", "how", "the", "that"].includes(w));

  return { documentIds, keywords, queryType };
}

/**
 * Step 2: Retrieve instances from database based on query
 * Filter by user role and permissions
 */
function retrieveInstances(
  documentIds: string[],
  keywords: string[],
  instances: Record<string, InstanceSummary[]>,
  instanceDetails: Record<string, InstanceDetail>,
  userRole: "admin" | "manager" | "user",
  userWorkflows: string[]
): RetrievalResult {
  const retrieved: InstanceDetail[] = [];
  const accessibleWorkflows = getAccessibleWorkflows(userRole, userWorkflows);

  // If specific document IDs were mentioned, retrieve them
  if (documentIds.length > 0) {
    documentIds.forEach((docId) => {
      const detail = instanceDetails[docId];
      if (detail) {
        // Check if user has access to this document's workflow
        const workflowOfDoc = getWorkflowOfDocument(docId, instances);
        if (accessibleWorkflows.includes(workflowOfDoc)) {
          retrieved.push(detail);
        }
      }
    });
  } else {
    // Keyword-based search: match instance names/departments with keywords
    Object.entries(instanceDetails).forEach(([id, detail]) => {
      const workflowOfDoc = getWorkflowOfDocument(id, instances);
      if (!accessibleWorkflows.includes(workflowOfDoc)) return; // Skip if no access

      const searchableText = `${id} ${detail.department} ${detail.steps.map((s) => s.name).join(" ")}`.toLowerCase();
      const matches = keywords.filter((kw) => searchableText.includes(kw)).length;

      if (matches > 0) {
        retrieved.push(detail);
      }
    });
  }

  return {
    instances: retrieved,
    context: "",
    queryType: "general",
  };
}

/**
 * Determine which workflows a user can access based on role
 */
function getAccessibleWorkflows(userRole: "admin" | "manager" | "user", userWorkflows: string[]): string[] {
  if (userRole === "admin") {
    // Admin sees everything
    return ["Purchase Order Approval", "GRN Processing", "SRN Workflow", "Direct Payment"];
  }
  if (userRole === "manager") {
    // Manager sees all workflows (customizable later)
    return ["Purchase Order Approval", "GRN Processing", "SRN Workflow", "Direct Payment"];
  }
  // Regular user sees only assigned workflows
  return userWorkflows;
}

/**
 * Find which workflow a document belongs to
 */
function getWorkflowOfDocument(docId: string, instances: Record<string, InstanceSummary[]>): string {
  for (const [workflow, docs] of Object.entries(instances)) {
    if (docs.some((d) => d.id === docId)) {
      return workflow;
    }
  }
  return "";
}

/**
 * Step 3: Format retrieved context for LLM
 */
function formatContextForLLM(instances: InstanceDetail[], _queryType: string): string {
  if (instances.length === 0) return "";

  const doc = instances[0]; // Focus on first result for simplicity

  const stepsInfo = doc.steps
    .map(
      (step) =>
        `- ${step.name}: ${step.status} (${step.timeTaken || 0}/${step.slaTarget} hours, ${step.running ? "currently running" : step.pending ? "pending" : "completed"})`
    )
    .join("\n");

  return `
Document: ${doc.department}
Status: ${doc.steps.some((s) => s.running) ? "In Progress" : "Completed"}
Time Used: ${doc.timeUsed} hours

Steps:
${stepsInfo}

SLA Recovery: ${doc.recovery.overall}
SLA Deficit: ${doc.recovery.deficit} hours
  `;
}

/**
 * Step 4: Generate response using local logic (template-based)
 * In production, replace this with a local LLM API call
 */
function generateResponseLocally(userQuery: string, context: string, queryType: string): string {
  const lowerQuery = userQuery.toLowerCase();

  // If we have context, generate a targeted response
  if (context.trim()) {
    if (queryType === "sla_status") {
      if (lowerQuery.includes("breach")) {
        return `Based on the document data: The workflow has some steps with breached SLA. ${context}

**For this document:**
- The SLA Deficit is documented above
- Recovery status: ${context.includes("critical") ? "CRITICAL - immediate action needed" : "Manageable"}`;
      }
      return `Here's the current SLA status:\n${context}`;
    }

    if (queryType === "remaining_time") {
      return `**Time Remaining Analysis**:\n${context}

Looking at the workflow, you need to act quickly on pending steps to avoid further SLA breaches.`;
    }

    if (queryType === "summary") {
      return `**Document Summary**:\n${context}

This document is currently being processed through its workflow steps. For more detailed summaries, you can enable summary generation from LLM, API, or locally-hosted models in configuration.`;
    }

    return `Here's what I found:\n${context}`;
  }

  // No context — generic response
  if (lowerQuery.includes("summary")) {
    return "I can help generate summaries. Please specify the document ID (e.g., 'PO-2024-0112') and I'll provide a summary if you have permission.";
  }

  if (lowerQuery.includes("sla") || lowerQuery.includes("status")) {
    return "Please specify which document you'd like to check (e.g., 'What is the SLA status of GRN-2024-0041?').";
  }

  return "I couldn't find information about that query. Try asking about a specific document ID (like PO-2024-0112) or workflow status.";
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SUMMARY GENERATION METHODS (Plug-in points for 3 different approaches)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Method 1: Generate summary using External LLM API
 * (e.g., OpenAI, Anthropic, Hugging Face)
 *
 * To use:
 * - Install: npm install openai (or relevant SDK)
 * - Set API key in .env file
 * - Uncomment call in generateChatResponse() based on user preference
 */
export async function generateSummaryViaLLMAPI(_documentText: string, _apiProvider: "openai" | "anthropic"): Promise<string> {
  // Example implementation for OpenAI:
  // const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //   method: "POST",
  //   headers: {
  //     "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       { role: "system", content: "Summarize the following document concisely." },
  //       { role: "user", content: documentText },
  //     ],
  //     max_tokens: 150,
  //   }),
  // });
  // const data = await response.json();
  // return data.choices[0].message.content;

  console.warn("LLM API integration not yet configured");
  return "LLM API summary generation not yet enabled.";
}

/**
 * Method 2: Generate summary using Locally Hosted Model
 * (e.g., Ollama, LLaMA.cpp, Hugging Face transformers)
 *
 * To use:
 * - Install local model: ollama pull mistral (or your preferred model)
 * - Run locally: ollama serve
 * - Connect to http://localhost:11434 (default Ollama port)
 */
export async function generateSummaryViaLocalModel(documentText: string, modelName: string = "mistral"): Promise<string> {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        prompt: `Summarize this document concisely:\n\n${documentText}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Local model server error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Local model error:", error);
    return "Local model server not available. Please ensure Ollama is running at localhost:11434";
  }
}

/**
 * Method 3: Template-Based Summary (No External Model)
 * Extracts key information without AI — useful for quick, deterministic summaries
 *
 * To use:
 * - No setup required, works offline
 * - Less intelligent but fast and predictable
 */
export function generateSummaryViaTemplate(detail: InstanceDetail): string {
  const completedSteps = detail.steps.filter((s) => s.status === "Met").length;
  const breachedSteps = detail.steps.filter((s) => s.status === "Breached").length;
  const pendingSteps = detail.steps.filter((s) => s.pending).length;

  return `
**Document Summary**
- Department: ${detail.department}
- Total Time Used: ${detail.timeUsed} hours
- Completed Steps: ${completedSteps}/${detail.steps.length}
- Breached SLA: ${breachedSteps > 0 ? `Yes (${breachedSteps} steps)` : "No"}
- Pending: ${pendingSteps} steps remaining
- SLA Recovery: ${detail.recovery.overall.toUpperCase()}
- Time Deficit: ${detail.recovery.deficit} hours
`;
}
