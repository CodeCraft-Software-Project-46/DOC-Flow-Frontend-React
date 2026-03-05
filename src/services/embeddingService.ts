/**
 * Embedding & Document Indexing Service
 * Generates embeddings for documents at submission time
 * Indexes them with access flags (workflow, step, role)
 * Enables semantic search with access control at query time
 */

import type { InstanceDetail } from "../types";

export interface DocumentEmbeddingIndex {
  docId: string;
  departmentName: string;
  embedding: number[]; // Vector embedding (768-dimensional or similar)
  summary: string; // Pre-generated summary at submission time
  accessFlags: {
    workflows: string[]; // Which workflows can access this
    stepIds: string[]; // Which steps can access this
    minRole: "user" | "manager" | "admin"; // Minimum role required
  };
  content: string; // Full document context
  submittedAt: Date;
  generatedAt: Date; // When summary was generated
}

export interface EmbeddingQueryResult {
  docId: string;
  similarity: number; // 0-1: How relevant this document is
  summary: string;
  preview: string;
}

// ============================================
// VECTOR SIMILARITY COMPUTATION
// ============================================

/**
 * Calculate cosine similarity between two vectors
 * Used to find most relevant documents to user query
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Simple embedding generator (placeholder)
 * In production, use external API (OpenAI, Cohere, etc.)
 * or local model (sentence-transformers)
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: Replace with real embedding API
  // For now, hash-based pseudo-embedding for testing

  // Simple hash-based embedding (NOT production-grade)
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      h = (h << 5) - h + char;
      h |= 0; // Convert to 32-bit integer
    }
    return h;
  };

  const embedding = new Array(384).fill(0); // 384-dimensional
  const words = text.toLowerCase().split(/\s+/);

  words.forEach((word, idx) => {
    const h = Math.abs(hash(word)) % 384;
    embedding[h] += Math.sin((idx + 1) * (h + 1)) * 0.1;
  });

  // Normalize
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map((val) => (norm ? val / norm : 0));
}

// ============================================
// EMBEDDING STORAGE & INDEX MANAGEMENT
// ============================================

export class DocumentEmbeddingService {
  private static embeddingIndex: Map<string, DocumentEmbeddingIndex> = new Map();

  /**
   * Initialize with existing data (hydrate from backend)
   */
  static loadFromBackend(documents: DocumentEmbeddingIndex[]) {
    this.embeddingIndex.clear();
    documents.forEach((doc) => {
      this.embeddingIndex.set(doc.docId, doc);
    });
    console.log(`Loaded ${documents.length} document embeddings`);
  }

  /**
   * Index a new document at submission time
   * This should be called when a document is first submitted to the workflow
   *
   * @param docId - The document ID (e.g., "PO-2024-0112")
   * @param instanceDetail - The workflow instance to index
   * @param workflows - Which workflows can access this
   * @param stepIds - Which workflow steps can access this
   * @param minRole - Minimum role required to access
   * @param summary - Pre-generated summary (should come from LLM backend)
   */
  static async indexDocument(
    docId: string,
    instanceDetail: InstanceDetail,
    workflows: string[],
    stepIds: string[],
    minRole: "user" | "manager" | "admin" = "user",
    summary: string
  ): Promise<void> {
    // Generate embedding from document content
    const content = this.formatDocumentContent(instanceDetail);
    const embedding = await generateEmbedding(content);

    // Create indexing record
    const indexEntry: DocumentEmbeddingIndex = {
      docId,
      departmentName: instanceDetail.department,
      embedding,
      summary,
      accessFlags: {
        workflows,
        stepIds,
        minRole,
      },
      content,
      submittedAt: new Date(),
      generatedAt: new Date(),
    };

    this.embeddingIndex.set(docId, indexEntry);
    console.log(`Indexed document: ${docId}`);

    // TODO: In production, persist to backend database
  }

  /**
   * Query documents by semantic similarity
   * Filters by user access rights
   *
   * @param query - User's natural language query
   * @param userRole - User's role (for access control)
   * @param userWorkflows - Which workflows user can access
   * @param topN - How many results to return
   */
  static async queryDocuments(
    query: string,
    userRole: "admin" | "manager" | "user",
    userWorkflows: string[],
    topN: number = 3
  ): Promise<EmbeddingQueryResult[]> {
    const queryEmbedding = await generateEmbedding(query);
    const results: Array<{ docId: string; similarity: number; index: DocumentEmbeddingIndex }> = [];

    // Calculate similarity for each indexed document
    for (const [docId, index] of this.embeddingIndex.entries()) {
      // Check access control
      if (!this.hasAccess(userRole, userWorkflows, index.accessFlags)) {
        continue; // Skip if user doesn't have access
      }

      const similarity = cosineSimilarity(queryEmbedding, index.embedding);
      results.push({ docId, similarity, index });
    }

    // Sort by similarity (descending) and return top N
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN)
      .map(({ docId, similarity, index }) => ({
        docId,
        similarity,
        summary: index.summary,
        preview: index.content.substring(0, 200),
      }));
  }

  /**
   * Check if user has access to a document based on access flags
   */
  private static hasAccess(
    userRole: "admin" | "manager" | "user",
    userWorkflows: string[],
    accessFlags: DocumentEmbeddingIndex["accessFlags"]
  ): boolean {
    // Admin has all access
    if (userRole === "admin") return true;

    // Check role requirement
    const roleHierarchy = { user: 0, manager: 1, admin: 2 };
    if (roleHierarchy[userRole] < roleHierarchy[accessFlags.minRole]) {
      return false;
    }

    // Check if user has access to any of the workflows
    const hasWorkflowAccess = accessFlags.workflows.some((workflow) => userWorkflows.includes(workflow));

    return hasWorkflowAccess;
  }

  /**
   * Get pre-generated summary for a document
   * Summary was generated at submission time, show based on user role
   */
  static getSummary(docId: string, userRole: "admin" | "manager" | "user"): string | null {
    const index = this.embeddingIndex.get(docId);
    if (!index) return null;

    // Check if user can see summary based on role
    const roleHierarchy = { user: 0, manager: 1, admin: 2 };
    if (roleHierarchy[userRole] < roleHierarchy[index.accessFlags.minRole]) {
      return null; // User doesn't have permission
    }

    return index.summary;
  }

  /**
   * Format document for embedding generation
   */
  private static formatDocumentContent(doc: InstanceDetail): string {
    const stepsInfo = doc.steps
      .map(
        (step) =>
          `Step: ${step.name}, Status: ${step.status}, Time: ${step.timeTaken}/${step.slaTarget} hours`
      )
      .join("\n");

    return `
Department: ${doc.department}
Status: ${doc.steps.some((s) => s.running) ? "In Progress" : "Completed"}
Time Used: ${doc.timeUsed} hours

Workflow Steps:
${stepsInfo}

SLA Recovery: ${doc.recovery.overall}
SLA Deficit: ${doc.recovery.deficit} hours
    `.trim();
  }

  /**
   * Get all indexed documents (for debugging/admin)
   */
  static getAllIndexed(): DocumentEmbeddingIndex[] {
    return Array.from(this.embeddingIndex.values());
  }

  /**
   * Clear index (useful for testing)
   */
  static clearIndex(): void {
    this.embeddingIndex.clear();
  }
}

// ============================================
// INITIALIZATION HELPER
// ============================================

/**
 * Initialize embedding service after app loads
 * This would be called from your main App component
 */
export async function initializeEmbeddingService() {
  try {
    // TODO: Fetch embeddings from backend
    // const response = await fetch('/api/documents/embeddings');
    // const embeddings = await response.json();
    // DocumentEmbeddingService.loadFromBackend(embeddings);

    console.log("Embedding service initialized");
  } catch (error) {
    console.warn("Could not load embeddings:", error);
  }
}
