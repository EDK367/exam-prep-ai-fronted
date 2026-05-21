import api from './api'
import type { AxiosProgressEvent } from 'axios'
import type {
  Document,
  DocumentDetail,
  DocumentListResponse,
  DocumentProcessingStatus,
} from '@/types/document.types'

export const documentService = {
  upload(
    file: File,
    onProgress?: (percent: number) => void,
    abortController?: AbortController,
  ) {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<Document>('/documents/upload', formData, {
      timeout: 120_000,
      signal: abortController?.signal,
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total)
          onProgress(percent)
        }
      },
    })
  },

  list(params?: { status?: string; page?: number; page_size?: number }) {
    return api.get<DocumentListResponse>('/documents/', { params })
  },

  get(documentId: string) {
    return api.get<Document>(`/documents/${documentId}`)
  },

  getDetail(documentId: string) {
    return api.get<DocumentDetail>(`/documents/${documentId}/detail`)
  },

  getStatus(documentId: string) {
    return api.get<DocumentProcessingStatus>(`/documents/${documentId}/status`)
  },

  reprocess(documentId: string) {
    return api.post<Document>(`/documents/${documentId}/reprocess`)
  },

  delete(documentId: string) {
    return api.delete(`/documents/${documentId}`)
  },

  getFile(documentId: string) {
    return api.get<Blob>(`/documents/${documentId}/file`, {
      responseType: 'blob',
      timeout: 120_000,
    })
  },
}
