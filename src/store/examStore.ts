import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { examService } from '@/services/examService'
import type {
  Test,
  TestDetail,
  TestResult,
  CreateTestPayload,
  SubmitAnswerPayload,
  FlashcardSet,
  Summary,
} from '@/types/exam.types'
import { useUiStore } from './uiStore'

export const useExamStore = defineStore('exams', () => {
  const uiStore = useUiStore()

  // ── State ─────────────────────────────────────────────────────────────
  const tests = ref<Test[]>([])
  const currentTest = ref<TestDetail | null>(null)
  const currentResult = ref<TestResult | null>(null)
  const generatedFlashcards = ref<FlashcardSet | null>(null)
  const generatedSummary = ref<Summary | null>(null)

  const loading = ref(false)
  const generating = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  // ── Computed ──────────────────────────────────────────────────────────
  const hasNext = computed(() => page.value * pageSize.value < total.value)

  // ── Actions ───────────────────────────────────────────────────────────

  async function fetchTests(statusFilter?: string, pageNum: number = 1) {
    loading.value = true
    try {
      const { data } = await examService.list({
        status: statusFilter,
        page: pageNum,
        page_size: pageSize.value,
      })
      tests.value = data.items
      total.value = data.total
      page.value = data.page
    } catch (error) {
      uiStore.addNotification('error', 'Error al cargar los exámenes')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createTest(payload: CreateTestPayload) {
    generating.value = true
    try {
      const { data } = await examService.create(payload)
      tests.value.unshift(data)
      uiStore.addNotification('success', 'Examen generado exitosamente')
      return data
    } catch (error: any) {
      const msg = error.response?.data?.error?.message || 'Error al generar examen'
      uiStore.addNotification('error', msg)
      throw error
    } finally {
      generating.value = false
    }
  }

  async function fetchTestDetail(testId: string) {
    loading.value = true
    try {
      const { data } = await examService.get(testId)
      currentTest.value = data
      return data
    } catch (error) {
      uiStore.addNotification('error', 'Error al cargar el examen')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function startTest(testId: string) {
    try {
      const { data } = await examService.start(testId)
      if (currentTest.value && currentTest.value.id === testId) {
        currentTest.value.status = data.status
      }
      return data
    } catch (error) {
      uiStore.addNotification('error', 'Error al iniciar el examen')
      throw error
    }
  }

  async function submitTest(testId: string, answers: SubmitAnswerPayload[]) {
    loading.value = true
    try {
      const { data } = await examService.submit(testId, answers)
      currentResult.value = data
      
      // Update local test status
      const test = tests.value.find((t) => t.id === testId)
      if (test) {
        test.status = 'completed'
        test.score = data.score_percent
      }
      
      uiStore.addNotification('success', 'Examen enviado exitosamente')
      return data
    } catch (error) {
      uiStore.addNotification('error', 'Error al enviar el examen')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchTestResults(testId: string) {
    loading.value = true
    try {
      const { data } = await examService.getResults(testId)
      currentResult.value = data
      return data
    } catch (error) {
      uiStore.addNotification('error', 'Error al cargar los resultados')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteTest(testId: string) {
    try {
      await examService.delete(testId)
      tests.value = tests.value.filter((t) => t.id !== testId)
      if (currentTest.value?.id === testId) {
        currentTest.value = null
      }
      uiStore.addNotification('success', 'Examen eliminado')
    } catch (error) {
      uiStore.addNotification('error', 'Error al eliminar el examen')
      throw error
    }
  }

  async function retakeTest(testId: string) {
    loading.value = true
    try {
      const { data } = await examService.retake(testId)
      const test = tests.value.find((t) => t.id === testId)
      if (test) {
        test.status = 'ready'
        test.score = undefined
      }
      if (currentTest.value && currentTest.value.id === testId) {
        currentTest.value.status = 'ready'
      }
      if (currentResult.value && currentResult.value.test_id === testId) {
        currentResult.value = null
      }
      return data
    } catch (error) {
      uiStore.addNotification('error', 'Error al reiniciar el examen')
      throw error
    } finally {
      loading.value = false
    }
  }

  // ── Extra Content Generation ──────────────────────────────────────────

  async function generateFlashcards(documentId: string, count: number = 15) {
    generating.value = true
    try {
      const { data } = await examService.generateFlashcards(documentId, count)
      generatedFlashcards.value = data.data
      return data.data
    } catch (error: any) {
      const msg = error.response?.data?.error?.message || 'Error al generar flashcards'
      uiStore.addNotification('error', msg)
      throw error
    } finally {
      generating.value = false
    }
  }

  async function generateSummary(documentId: string) {
    generating.value = true
    try {
      const { data } = await examService.generateSummary(documentId)
      generatedSummary.value = data.data
      return data.data
    } catch (error: any) {
      const msg = error.response?.data?.error?.message || 'Error al generar resumen'
      uiStore.addNotification('error', msg)
      throw error
    } finally {
      generating.value = false
    }
  }

  function $reset() {
    tests.value = []
    currentTest.value = null
    currentResult.value = null
    generatedFlashcards.value = null
    generatedSummary.value = null
    loading.value = false
    generating.value = false
    page.value = 1
  }

  return {
    // State
    tests,
    currentTest,
    currentResult,
    generatedFlashcards,
    generatedSummary,
    loading,
    generating,
    total,
    page,
    pageSize,
    // Computed
    hasNext,
    // Actions
    fetchTests,
    createTest,
    fetchTestDetail,
    startTest,
    submitTest,
    fetchTestResults,
    deleteTest,
    retakeTest,
    generateFlashcards,
    generateSummary,
    $reset,
  }
})
