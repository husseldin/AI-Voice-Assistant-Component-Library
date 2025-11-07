import { ConversationMemory, MemorySearchOptions, MemorySearchResult, MemoryStats } from './types';

/**
 * Conversation Memory Store
 * Simple RAG-like memory system for maintaining conversation context
 */
export class ConversationMemoryStore {
  private memories: ConversationMemory[] = [];
  private maxMemories: number;

  constructor(maxMemories = 1000) {
    this.maxMemories = maxMemories;
  }

  /**
   * Add a new memory
   */
  addMemory(
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, any>
  ): ConversationMemory {
    const memory: ConversationMemory = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      role,
      content,
      metadata,
      importance: this.calculateImportance(content),
    };

    this.memories.push(memory);

    // Trim old memories if exceeding max
    if (this.memories.length > this.maxMemories) {
      this.trimMemories();
    }

    return memory;
  }

  /**
   * Search memories by semantic similarity
   */
  searchMemories(options: MemorySearchOptions): MemorySearchResult[] {
    const { query, limit = 5, threshold = 0.5 } = options;

    // Simple keyword matching (in production, use embeddings)
    const results: MemorySearchResult[] = [];

    for (const memory of this.memories) {
      const similarity = this.calculateSimilarity(query, memory.content);

      if (similarity >= threshold) {
        results.push({ memory, similarity });
      }
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Get recent memories
   */
  getRecentMemories(count = 10): ConversationMemory[] {
    return this.memories.slice(-count);
  }

  /**
   * Get memories within time range
   */
  getMemoriesByTimeRange(start: Date, end: Date): ConversationMemory[] {
    return this.memories.filter(
      m => m.timestamp >= start && m.timestamp <= end
    );
  }

  /**
   * Get memories by role
   */
  getMemoriesByRole(role: 'user' | 'assistant' | 'system'): ConversationMemory[] {
    return this.memories.filter(m => m.role === role);
  }

  /**
   * Get important memories
   */
  getImportantMemories(minImportance = 0.7, limit = 10): ConversationMemory[] {
    return this.memories
      .filter(m => (m.importance || 0) >= minImportance)
      .sort((a, b) => (b.importance || 0) - (a.importance || 0))
      .slice(0, limit);
  }

  /**
   * Clear all memories
   */
  clearMemories() {
    this.memories = [];
  }

  /**
   * Export memories
   */
  exportMemories(): ConversationMemory[] {
    return [...this.memories];
  }

  /**
   * Import memories
   */
  importMemories(memories: ConversationMemory[]) {
    this.memories = memories;
  }

  /**
   * Get memory statistics
   */
  getStats(): MemoryStats {
    if (this.memories.length === 0) {
      return { totalMemories: 0 };
    }

    const timestamps = this.memories.map(m => m.timestamp);
    const importances = this.memories
      .map(m => m.importance || 0)
      .filter(i => i > 0);

    return {
      totalMemories: this.memories.length,
      oldestMemory: new Date(Math.min(...timestamps.map(t => t.getTime()))),
      newestMemory: new Date(Math.max(...timestamps.map(t => t.getTime()))),
      averageImportance: importances.length > 0
        ? importances.reduce((sum, i) => sum + i, 0) / importances.length
        : 0,
    };
  }

  /**
   * Calculate importance score for a message
   */
  private calculateImportance(content: string): number {
    let score = 0.5; // Base score

    // Longer messages are more important
    if (content.length > 100) score += 0.1;
    if (content.length > 200) score += 0.1;

    // Questions are important
    if (content.includes('?')) score += 0.1;

    // Commands/requests are important
    const commandWords = ['please', 'can you', 'could you', 'help', 'show', 'tell'];
    if (commandWords.some(word => content.toLowerCase().includes(word))) {
      score += 0.1;
    }

    // Specific topics are important
    const importantTopics = ['important', 'urgent', 'critical', 'remember'];
    if (importantTopics.some(topic => content.toLowerCase().includes(topic))) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Calculate similarity between query and content
   * Simple implementation - in production, use embeddings
   */
  private calculateSimilarity(query: string, content: string): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentWords = content.toLowerCase().split(/\s+/);

    let matches = 0;
    for (const word of queryWords) {
      if (contentWords.some(cw => cw.includes(word) || word.includes(cw))) {
        matches++;
      }
    }

    return matches / queryWords.length;
  }

  /**
   * Trim old memories, keeping important ones
   */
  private trimMemories() {
    // Sort by importance and recency
    const sorted = this.memories.sort((a, b) => {
      const importanceDiff = (b.importance || 0) - (a.importance || 0);
      if (Math.abs(importanceDiff) > 0.2) return importanceDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    // Keep top N memories
    this.memories = sorted.slice(0, this.maxMemories);

    // Re-sort by timestamp
    this.memories.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}
