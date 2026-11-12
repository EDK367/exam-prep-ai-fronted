<template>
  <v-card 
    class="bg-surface-container-lowest rounded-xl pa-4 hover-shadow transition-all duration-300 position-relative overflow-hidden group border d-flex flex-column justify-between h-100"
    elevation="0"
  >
    <!-- Visual Preview & Status Area -->
    <div 
      class="bg-surface-container-low rounded-lg mb-4 d-flex flex-column align-center justify-center border border-outline-variant-30 overflow-hidden position-relative aspect-ratio-4-3"
    >
      <template v-if="file.status === 'completed'">
        <v-icon icon="mdi-file-pdf-box" color="error" size="56" class="mb-2"></v-icon>
        <span class="text-caption font-weight-bold text-success bg-success-container px-3 py-0.5 rounded-pill">
          Listo para estudiar
        </span>
      </template>

      <template v-else-if="['processing', 'uploaded', 'chunked', 'ai_processing'].includes(file.status)">
        <v-progress-circular 
          indeterminate 
          color="primary" 
          size="38" 
          width="3" 
          class="mb-2"
        ></v-progress-circular>
        <span class="text-caption font-weight-bold text-primary bg-primary-container px-3 py-0.5 rounded-pill pulse-animation">
          Procesando con IA...
        </span>
      </template>

      <template v-else-if="file.status === 'failed'">
        <v-icon icon="mdi-alert-circle" color="error" size="56" class="mb-2"></v-icon>
        <span class="text-caption font-weight-bold text-error bg-error-container px-3 py-0.5 rounded-pill">
          Error de procesamiento
        </span>
      </template>

      <template v-else>
        <v-icon icon="mdi-file-cancel" color="on-surface-variant" size="56" class="mb-2"></v-icon>
        <span class="text-caption font-weight-bold text-on-surface-variant bg-surface-container-high px-3 py-0.5 rounded-pill">
          Cancelado
        </span>
      </template>

      <!-- Hover Overlay for Quick Actions -->
      <div 
        v-if="file.status === 'completed'"
        class="overlay position-absolute d-flex align-center justify-center ga-2 w-100 h-100 opacity-0 group-hover:opacity-100 transition-opacity"
        style="background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(2px);"
      >
        <v-btn
          color="surface"
          icon="mdi-eye"
          size="small"
          elevation="2"
          title="Ver PDF"
          @click.stop="openPdfPreview"
        ></v-btn>
        <v-btn
          color="primary-container"
          class="text-on-primary-container"
          icon="mdi-cards-outline"
          size="small"
          elevation="2"
          title="Estudiar con Flashcards"
          @click.stop="showFlashcards = true"
        ></v-btn>
        <v-btn
          color="secondary-container"
          class="text-on-secondary-container"
          icon="mdi-text-box-search-outline"
          size="small"
          elevation="2"
          title="Resumen Ejecutivo"
          @click.stop="showSummary = true"
        ></v-btn>
      </div>
    </div>
    
    <!-- Meta Info & Secondary Actions -->
    <div class="d-flex align-start justify-space-between flex-grow-1">
      <div class="flex-grow-1 min-w-0 pr-2">
        <h4 
          class="text-body-2 font-weight-bold text-on-surface text-truncate mb-1 cursor-pointer hover-text-primary"
          @click="openPdfPreview"
          :title="file.filename"
        >
          {{ file.filename }}
        </h4>
        <p class="text-caption text-on-surface-variant mb-0">
          {{ formattedDate }} • {{ formattedSize }}
        </p>
      </div>
      
      <div class="d-flex align-center ga-1">
        <v-btn 
          v-if="file.status === 'failed'"
          icon="mdi-refresh" 
          variant="text" 
          size="small" 
          color="primary"
          title="Reintentar procesamiento"
          @click="reprocessFile"
        ></v-btn>
        
        <v-btn 
          icon="mdi-delete-outline" 
          variant="text" 
          size="small" 
          color="on-surface-variant" 
          class="hover-error"
          title="Eliminar archivo"
          :loading="deleting"
          @click="deleteFile"
        ></v-btn>
      </div>
    </div>

    <!-- Quick Action Footer for Completed File -->
    <div v-if="file.status === 'completed'" class="mt-3 pt-3 border-t d-flex align-center justify-space-between ga-2">
      <v-btn 
        variant="tonal" 
        color="primary" 
        size="small" 
        class="text-caption font-weight-bold flex-grow-1"
        :to="`/dashboard/exams/create/${file.id}`"
        prepend-icon="mdi-school"
      >
        Crear Examen
      </v-btn>
      <v-btn
        variant="text"
        icon="mdi-cards-outline"
        size="small"
        color="primary"
        title="Flashcards"
        @click="showFlashcards = true"
      ></v-btn>
      <v-btn
        variant="text"
        icon="mdi-text-box-search-outline"
        size="small"
        color="primary"
        title="Resumen IA"
        @click="showSummary = true"
      ></v-btn>
    </div>

    <!-- Modals -->
    <PdfPreviewDialog
      v-model="showPdfPreview"
      :document-id="file.id"
      :filename="file.filename"
    />

    <FlashcardsDialog
      v-model="showFlashcards"
      :document-id="file.id"
      :filename="file.filename"
    />

    <DocumentSummaryDialog
      v-model="showSummary"
      :document-id="file.id"
      :filename="file.filename"
    />
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Document } from '@/types/document.types'
import { useDocumentStore } from '@/store/documentStore'
import { useUiStore } from '@/store/uiStore'
import PdfPreviewDialog from '@/components/files/PdfPreviewDialog.vue'
import FlashcardsDialog from '@/components/study/FlashcardsDialog.vue'
import DocumentSummaryDialog from '@/components/study/DocumentSummaryDialog.vue'

const props = defineProps<{
  file: Document
}>()

const documentStore = useDocumentStore()
const uiStore = useUiStore()

const deleting = ref(false)
const showPdfPreview = ref(false)
const showFlashcards = ref(false)
const showSummary = ref(false)

const formattedDate = computed(() => {
  if (!props.file.created_at) return ''
  return new Date(props.file.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

const formattedSize = computed(() => {
  if (!props.file.size_types) return '0 KB'
  const kb = props.file.size_types / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
})

function openPdfPreview() {
  if (props.file.status !== 'completed') return
  showPdfPreview.value = true
}

async function reprocessFile() {
  try {
    await documentStore.reprocessDocument(props.file.id)
    uiStore.showSuccess('Documento reenviado para procesamiento')
  } catch (err: any) {
    uiStore.showError('No se pudo reintentar el procesamiento')
  }
}

async function deleteFile() {
  const confirmed = await uiStore.showConfirm({
    title: '¿Eliminar documento?',
    message: `¿Estás seguro de que deseas eliminar "${props.file.filename}"? Todos los exámenes generados a partir de él se conservarán.`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    color: 'error'
  })

  if (!confirmed) return

  deleting.value = true
  try {
    await documentStore.deleteDocument(props.file.id)
    uiStore.showSuccess('Documento eliminado con éxito')
  } catch (err: any) {
    uiStore.showError('No se pudo eliminar el documento')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
  border-color: var(--v-theme-primary);
}

.hover-text-primary:hover {
  color: var(--v-theme-primary);
}

.hover-error:hover {
  color: var(--v-theme-error) !important;
}

.aspect-ratio-4-3 {
  aspect-ratio: 4/3;
  width: 100%;
}

.pulse-animation {
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.97); }
}
</style>
