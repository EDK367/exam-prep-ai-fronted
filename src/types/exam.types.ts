// Frontend type definitions for exams, tests, questions, and results

import type { QuestionType, TestStatus } from './document.types'

export interface Question {
  id: string
  questions_type: QuestionType
  points: number
  content: {
    question: string
    type?: string
    options?: string[]
    correct_answer?: string
    explanation?: string
  }
  created_at: string
}

export interface QuestionWithAnswer extends Question {
  user_answer?: string | number | boolean | null
  is_correct?: boolean | null
  explanation?: string
}

export interface Test {
  id: string
  title: string
  status: TestStatus
  is_active: boolean
  user_id: string
  document_id?: string
  test_template_id?: string
  score?: number
  question_count?: number
  created_at: string
  updated_at: string
}

export interface TestDetail extends Test {
  questions: Question[]
}

export interface TestResult {
  test_id: string
  title: string
  total_questions: number
  correct_answers: number
  incorrect_answers: number
  unanswered: number
  score_percent: number
  passed: boolean
  passing_score: number
  questions: QuestionWithAnswer[]
}

export interface TestListResponse {
  items: Test[]
  total: number
  page: number
  page_size: number
  has_next: boolean
}

export interface CreateTestPayload {
  document_id: string
  title?: string
  question_count?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  template_id?: string
  include_flashcards?: boolean
  include_summary?: boolean
}

export interface SubmitAnswerPayload {
  question_id: string
  response_text: string | number | boolean
}

export interface Flashcard {
  front: string
  back: string
  category?: string
}

export interface FlashcardSet {
  flashcards: Flashcard[]
}

export interface Summary {
  title: string
  summary: string
  key_points: string[]
  concepts: { term: string; definition: string }[]
  conclusion: string
}

export interface UsageStats {
  input_tokens: number
  output_tokens: number
  total_tokens: number
  total_cost: number
  request_count: number
  max_tokens: number
  remaining_tokens: number
  plan: string
  model: string
}

export interface PlanUsage {
  plan: string
  tokens: { used: number; max: number; remaining: number }
  uploads: { used: number; max: number; remaining: number }
  tests: { used: number; max: number; remaining: number }
  cost: { total: number; request_count: number }
}
