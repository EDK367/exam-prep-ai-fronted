// Frontend type definitions for documents, exams, flashcards, and billing

export type DocumentStatus =
  | 'uploaded'
  | 'processing'
  | 'chunked'
  | 'ai_processing'
  | 'completed'
  | 'failed'
  | 'canceled'

export type TestStatus =
  | 'draft'
  | 'generating'
  | 'ready'
  | 'in_progress'
  | 'completed'
  | 'failed'

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'open_question'
  | 'flashcard'

export interface Document {
  id: string
  filename: string
  storage_path?: string
  size_types?: number
  status: DocumentStatus
  page_count?: number
  chunk_count?: number
  error_message?: string
  mime_type?: string
  created_at: string
  updated_at: string
}

export interface DocumentChunk {
  id: string
  chunk_index: number
  content: string
  metadata_json?: Record<string, unknown>
  created_at: string
}

export interface DocumentDetail extends Document {
  chunks: DocumentChunk[]
}

export interface DocumentProcessingStatus {
  document_id: string
  status: DocumentStatus
  progress_percent: number
  current_step: string
  error_message?: string
  chunk_count?: number
  celery_task_id?: string
}

export interface DocumentListResponse {
  items: Document[]
  total: number
  page: number
  page_size: number
  has_next: boolean
}
