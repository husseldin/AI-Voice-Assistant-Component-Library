export interface ConversationMemory {
  id: string;
  timestamp: Date;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  embedding?: number[];
  importance?: number;
}

export interface MemorySearchOptions {
  query: string;
  limit?: number;
  threshold?: number;
  includeMetadata?: boolean;
}

export interface MemorySearchResult {
  memory: ConversationMemory;
  similarity: number;
}

export interface MemoryStats {
  totalMemories: number;
  oldestMemory?: Date;
  newestMemory?: Date;
  averageImportance?: number;
}
