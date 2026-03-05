// RAG Service — Retrieval Augmented Generation for chatbot
// Enhanced with LLM adapter pattern & embedding-based semantic search
// 1. Uses configurable LLM providers (Gemini, ChatGPT, Ollama → Mock fallback)
// 2. Retrieves documents using semantic embeddings + access control
// 3. Shows pre-generated summaries based on user role

import type { InstanceSummary, InstanceDetail } from "../types";
import { LLMProviderFactory } from "./llmProviderAdapter";
import { DocumentEmbeddingService } from "./embeddingService";

interface RetrievalResult {
  instances: InstanceDetail[];
  context: string;
  queryType: "sla_status" | "remaining_time" | "summary" | "general";
}

/**
 * UPDATED RAG Flow (Mentor's Recommendations):
 * 1. Analyze user query (intent, keywords, document IDs)
 * 2. Retrieve documents using semantic embeddings + access control
 * 3. If summary requested, retrieve pre-generated summary from index (not on-demand)
 * 4. Format context with retrieved documents
 * 5. Use LLM Adapter to generate response (tries: Gemini → ChatGPT → Ollama → Mock)
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

    // Step 2: Retrieve instances (hybrid: ID-based + semantic search with access control)
    const retrievedInstances = await retrieveInstancesWithEmbeddings(
      documentIds,
      keywords,
      userQuery,
      instances,
      instanceDetails,
      userRole,
      userWorkflows
    );

    // Step 3: If document found, format context
    let context = "";
    if (retrievedInstances.instances.length > 0) {
      context = formatContextForLLM(retrievedInstances.instances, queryAnalysis.queryType);
    }

    // Step 4: Handle summary request
    if (queryAnalysis.queryType === "summary" && retrievedInstances.instances.length > 0) {
      const firstDoc = retrievedInstances.instances[0];
      // Note: We need to find the docId from the original data
      // For now, we'll search through instanceDetails to find matching document
      let docId = "";
      for (const [id, detail] of Object.entries(instanceDetails)) {
        if (detail.department === firstDoc.department) {
          docId = id;
          break;
        }
      }
      // Get pre-generated summary (generated at document submission time)
      const preGenSummary = DocumentEmbeddingService.getSummary(docId, userRole);
      if (preGenSummary) {
        return preGenSummary; // Return pre-generated summary with role-based filtering
      }
      // Fallback: generate on-demand if no pre-generated summary exists
      return await generateSummaryOnDemand(context);
    }

    // Step 5: Generate response using LLM Adapter (best available provider)
    const response = await generateResponseViaLLM(userQuery, context, queryAnalysis.queryType);

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
 * Step 2: Retrieve instances using hybrid approach
 * 1. If document IDs specified: direct lookup + access check
 * 2. Otherwise: semantic embedding search with access control
 */
async function retrieveInstancesWithEmbeddings(
  documentIds: string[],
  keywords: string[],
  userQuery: string,
  instances: Record<string, InstanceSummary[]>,
  instanceDetails: Record<string, InstanceDetail>,
  userRole: "admin" | "manager" | "user",
  userWorkflows: string[]
): Promise<RetrievalResult> {
  const retrieved: InstanceDetail[] = [];
  const accessibleWorkflows = getAccessibleWorkflows(userRole, userWorkflows);

  // **Approach 1: Direct ID lookup (if user specified document IDs)**
  if (documentIds.length > 0) {
    documentIds.forEach((docId) => {
      const detail = instanceDetails[docId];
      if (detail) {
        const workflowOfDoc = getWorkflowOfDocument(docId, instances);
        if (accessibleWorkflows.includes(workflowOfDoc)) {
          retrieved.push(detail);
        }
      }
    });
  }

  // **Approach 2: Semantic search via embeddings (if no direct matches)**
  if (retrieved.length === 0) {
    try {
      // Query embeddings with access control
      const embeddingResults = await DocumentEmbeddingService.queryDocuments(
        userQuery,
        userRole,
        userWorkflows,
        3 // Return top 3 most similar documents
      );

      // Map embedding results to instance details
      embeddingResults.forEach((result) => {
        const detail = instanceDetails[result.docId];
        if (detail) {
          retrieved.push(detail);
        }
      });

      console.log(`Found ${retrieved.length} documents via semantic search`);
    } catch (error) {
      console.warn("Embedding search failed, falling back to keyword search:", error);

      // **Fallback: Simple keyword search**
      Object.entries(instanceDetails).forEach(([id, detail]) => {
        const workflowOfDoc = getWorkflowOfDocument(id, instances);
        if (!accessibleWorkflows.includes(workflowOfDoc)) return;

        const searchableText = `${id} ${detail.department} ${detail.steps.map((s) => s.name).join(" ")}`.toLowerCase();
        const matches = keywords.filter((kw) => searchableText.includes(kw)).length;

        if (matches > 0) {
          retrieved.push(detail);
        }
      });
    }
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
 * Step 5: Generate response using LLM Adapter
 * Tries: Gemini → ChatGPT → Ollama → Mock (fallback)
 * This implements the mentor's recommendation to use LLM adapter pattern
 */
async function generateResponseViaLLM(
  userQuery: string,
  context: string,
  queryType: string
): Promise<string> {
  if (!context) {
    // No documents found
    return "I couldn't find any documents matching your query. Try asking about specific document IDs or different keywords.";
  }

  // Construct prompt with context
  const prompt = `
You are a helpful workflow document assistant. Answer the user's question based on the provided context.
Be concise and accurate. If information is not in the context, say so.

Context:
${context}

User Question: ${userQuery}

Answer:
  `.trim();

  try {
    // Use LLM Adapter Factory - automatically picks best available provider
    const response = await LLMProviderFactory.generateResponse(prompt);
    return response;
  } catch (error) {
    console.error("LLM response generation failed:", error);
    // Fallback to template-based response
    return generateResponseViaTemplate(userQuery, queryType);
  }
}

/**
 * Generate summary on-demand (fallback if pre-generated summary not available)
 * Uses LLM Adapter for intelligent summary
 * This is called when no pre-generated summary exists in the embedding index
 */
async function generateSummaryOnDemand(context: string): Promise<string> {
  try {
    return await LLMProviderFactory.generateSummary(context);
  } catch (error) {
    console.error("Summary generation failed:", error);
    return "Unable to generate summary at this time. Please try again later.";
  }
}

/**
 * Template-based response (fallback when all LLM providers unavailable)
 */
function generateResponseViaTemplate(userQuery: string, queryType: string): string {
  const lowerQuery = userQuery.toLowerCase();

  if (queryType === "sla_status" || lowerQuery.includes("sla")) {
    return "Based on the document, the SLA status is being monitored. Please review the step-level SLA metrics and recovery status for detailed information.";
  }

  if (queryType === "remaining_time" || lowerQuery.includes("remaining")) {
    return "The document has time remaining before the SLA target. Check the individual workflow steps for specific time allocations and current progress.";
  }

  return "I found relevant information. Please ask for specific details like SLA status, time remaining, or request a summary.";
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SUMMARY GENERATION ARCHITECTURE (Per Mentor's Recommendations)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * **NEW APPROACH** (v2 - Recommended):
 * 1. Summaries are generated at DOCUMENT SUBMISSION TIME (backend process)
 * 2. Stored in embedding index with access flags (workflow, step, role)
 * 3. Chatbot retrieves pre-generated summary: DocumentEmbeddingService.getSummary()
 * 4. Display/hide based on user role (role-based access control)
 * 5. Uses LLM Adapter factory to generate (Gemini → ChatGPT → Ollama → Template)
 *
 * **BACKEND INTEGRATION NEEDED**:
 * When document is submitted to workflow:
 * ```typescript
 * // In your backend (document submission endpoint)
 * const summary = await LLMProviderFactory.generateSummary(documentContext);
 * await DocumentEmbeddingService.indexDocument(
 *   instanceDetail,
 *   ['Purchase Order Approval'],  // workflows
 *   ['step-1', 'step-2'],          // step IDs
 *   'user',                         // minRole
 *   summary                         // pre-generated summary
 * );
 * ```
 *
 * **OLD APPROACH** (v1 - Still available as fallback):
 * - generateSummaryViaLLMAPI (OpenAI, Anthropic, etc.)
 * - generateSummaryViaLocalModel (Ollama, LLaMA.cpp)
 * - generateSummaryViaTemplate (Template-based, no AI)
 *
 * ---
 * Benefits of new approach:
 * ✅ Summaries generated once at submission time (not per chat)
 * ✅ Role-based visibility control built into index
 * ✅ Faster response (pre-computed)
 * ✅ Costs amortized (generate once, use many times)
 * ✅ Supports airandome access flags/workflow/step IDs
 */

export async function generateSummaryViaLLMAPI(_documentText: string, _apiProvider: "openai" | "anthropic"): Promise<string> {
  // DEPRECATED: Summary should be generated at document submission time
  // See DocumentEmbeddingService.indexDocument() for new approach

  console.warn(
    "generateSummaryViaLLMAPI is deprecated. Summaries should be pre-generated at document submission via DocumentEmbeddingService.indexDocument()"
  );
  return "Summary generation moved to document submission phase.";
}

export async function generateSummaryViaLocalModel(_documentText: string, _modelName?: string): Promise<string> {
  // DEPRECATED: Summary should be generated at document submission time
  // See DocumentEmbeddingService.indexDocument() for new approach

  console.warn(
    "generateSummaryViaLocalModel is deprecated. Summaries should be pre-generated at document submission via DocumentEmbeddingService.indexDocument()"
  );
  return "Summary generation moved to document submission phase.";
}

export function generateSummaryViaTemplate(_detail: InstanceDetail): string {
  // DEPRECATED: Summary should be generated at document submission time
  // See DocumentEmbeddingService.indexDocument() for new approach

  console.warn(
    "generateSummaryViaTemplate is deprecated. Summaries should be pre-generated at document submission via DocumentEmbeddingService.indexDocument()"
  );
  return "Summary generation moved to document submission phase.";
}
