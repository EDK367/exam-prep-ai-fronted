import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { documentService } from '@/services/documentService'
import type {
  Document,
  DocumentStatus,
  DocumentProcessingStatus,
} from '@/types/document.types'

export const useDocumentStore = defineStore('documents', () => {
  // ── State ─────────────────────────────────────────────────────────────
  const documents = ref<Document[]>([])
  const currentDocument = ref<Document | null>(null)
  const loading = ref(false)
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uploadError = ref<string | null>(null)
  const processingStatus = ref<DocumentProcessingStatus | null>(null)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)
  let uploadAbortController: AbortController | null = null
  let pollingInterval: ReturnType<typeof setInterval> | null = null

  // ── Computed ──────────────────────────────────────────────────────────
  const hasNext = computed(() => page.value * pageSize.value < total.value)
  const isProcessing = computed(() =>
    processingStatus.value
      ? ['processing', 'chunked', 'ai_processing'].includes(
          processingStatus.value.status,
        )
      : false,
  )

  // ── Actions ───────────────────────────────────────────────────────────

  async function fetchDocuments(
    statusFilter?: DocumentStatus,
    pageNum: number = 1,
  ) {
    loading.value = true
    try {
      const { data } = await documentService.list({
        status: statusFilter,
        page: pageNum,
        page_size: pageSize.value,
      })
      documents.value = data.items
      total.value = data.total
      page.value = data.page
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      loading.value = false
    }
  }

  async function uploadDocument(file: File) {
    uploading.value = true
    uploadProgress.value = 0
    uploadError.value = null
    uploadAbortController = new AbortController()

    try {
      const { data } = await documentService.upload(
        file,
        (percent) => {
          uploadProgress.value = percent
        },
        uploadAbortController,
      )

      documents.value.unshift(data)
      currentDocument.value = data

      // Start polling for processing status
      startPolling(data.id)

      return data
    } catch (error: any) {
      if (error.name === 'CanceledError') {
        uploadError.value = 'Upload canceled'
      } else {
        uploadError.value =
          error.response?.data?.error?.message || 'Upload failed'
      }
      throw error
    } finally {
      uploading.value = false
      uploadAbortController = null
    }
  }

  function cancelUpload() {
    uploadAbortController?.abort()
    uploading.value = false
    uploadProgress.value = 0
  }

  async function fetchDocument(documentId: string) {
    loading.value = true
    try {
      const { data } = await documentService.get(documentId)
      currentDocument.value = data
      
      if (!['completed', 'failed', 'canceled'].includes(data.status)) {
        startPolling(data.id)
      }
      
      return data
    } finally {
      loading.value = false
    }
  }

  async function pollStatus(documentId: string) {
    try {
      const { data } = await documentService.getStatus(documentId)
      processingStatus.value = data

      // Update document in list
      const idx = documents.value.findIndex((d) => d.id === documentId)
      if (idx !== -1) {
        documents.value[idx] = {
          ...documents.value[idx],
          status: data.status,
          chunk_count: data.chunk_count ?? documents.value[idx].chunk_count,
        }
      }
      
      // Update current document if it matches
      if (currentDocument.value?.id === documentId) {
        currentDocument.value = {
          ...currentDocument.value,
          status: data.status,
          chunk_count: data.chunk_count ?? currentDocument.value.chunk_count,
        }
      }

      // Stop polling on terminal states
      if (['completed', 'failed', 'canceled'].includes(data.status)) {
        stopPolling()
      }

      return data
    } catch (error) {
      stopPolling()
      throw error
    }
  }

  function startPolling(documentId: string, intervalMs: number = 3000) {
    stopPolling()
    pollingInterval = setInterval(() => pollStatus(documentId), intervalMs)
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  async function reprocessDocument(documentId: string) {
    const { data } = await documentService.reprocess(documentId)
    const idx = documents.value.findIndex((d) => d.id === documentId)
    if (idx !== -1) {
      documents.value[idx] = data
    }
    startPolling(documentId)
    return data
  }

  async function deleteDocument(documentId: string) {
    await documentService.delete(documentId)
    documents.value = documents.value.filter((d) => d.id !== documentId)
    if (currentDocument.value?.id === documentId) {
      currentDocument.value = null
    }
  }

  function $reset() {
    documents.value = []
    currentDocument.value = null
    loading.value = false
    uploading.value = false
    uploadProgress.value = 0
    uploadError.value = null
    processingStatus.value = null
    stopPolling()
  }

  return {
    // State
    documents,
    currentDocument,
    loading,
    uploading,
    uploadProgress,
    uploadError,
    processingStatus,
    total,
    page,
    pageSize,
    // Computed
    hasNext,
    isProcessing,
    // Actions
    fetchDocuments,
    uploadDocument,
    cancelUpload,
    fetchDocument,
    pollStatus,
    startPolling,
    stopPolling,
    reprocessDocument,
    deleteDocument,
    $reset,
  }
})
