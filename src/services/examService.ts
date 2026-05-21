import api from './api'
import type {
  Test,
  TestDetail,
  TestResult,
  TestListResponse,
  CreateTestPayload,
  SubmitAnswerPayload,
  FlashcardSet,
  Summary,
  UsageStats,
  PlanUsage,
} from '@/types/exam.types'

export const examService = {
  // ── Test CRUD ────────────────────────────────────────────────────────

  create(payload: CreateTestPayload) {
    return api.post<Test>('/tests/', payload, { timeout: 300_000 })
  },

  list(params?: { status?: string; page?: number; page_size?: number }) {
    return api.get<TestListResponse>('/tests/', { params })
  },

  get(testId: string) {
    return api.get<TestDetail>(`/tests/${testId}`)
  },

  start(testId: string) {
    return api.post<Test>(`/tests/${testId}/start`)
  },

  submit(testId: string, answers: SubmitAnswerPayload[]) {
    return api.post<TestResult>(`/tests/${testId}/submit`, { answers })
  },

  getResults(testId: string) {
    return api.get<TestResult>(`/tests/${testId}/results`)
  },

  delete(testId: string) {
    return api.delete(`/tests/${testId}`)
  },

  retake(testId: string) {
    return api.post<Test>(`/tests/${testId}/retake`)
  },

  // ── AI Content Generation ────────────────────────────────────────────

  generateExamFromText(
    text: string,
    questionCount: number = 10,
    difficulty: string = 'medium',
  ) {
    return api.post('/ai/generate-exam', {
      text,
      question_count: questionCount,
      difficulty,
    }, { timeout: 300_000 })
  },

  generateExamFromDocument(
    documentId: string,
    questionCount: number = 10,
    difficulty: string = 'medium',
  ) {
    return api.post('/ai/generate-exam-from-document', {
      document_id: documentId,
      question_count: questionCount,
      difficulty,
    }, { timeout: 300_000 })
  },

  generateFlashcards(documentId: string, count: number = 15) {
    return api.post<{ success: boolean; data: FlashcardSet }>(
      '/ai/generate-flashcards',
      { document_id: documentId, count },
      { timeout: 300_000 }
    )
  },

  generateSummary(documentId: string) {
    return api.post<{ success: boolean; data: Summary }>(
      '/ai/generate-summary',
      { document_id: documentId },
      { timeout: 300_000 }
    )
  },

  getExplanation(question: string, context: string) {
    return api.post('/ai/explain', { question, context }, { timeout: 120_000 })
  },

  // ── Usage & Billing ──────────────────────────────────────────────────

  getUsage() {
    return api.get<{ success: boolean; data: UsageStats }>('/ai/usage')
  },

  getPlan() {
    return api.get<{ success: boolean; data: Record<string, unknown> }>(
      '/billing/plan',
    )
  },

  getFullUsage() {
    return api.get<{ success: boolean; data: PlanUsage }>('/billing/usage')
  },
}
