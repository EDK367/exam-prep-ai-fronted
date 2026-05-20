<template>
  <v-card 
    class="bg-surface-container-lowest rounded-xl pa-4 hover-shadow transition-all duration-300 position-relative overflow-hidden group border d-flex flex-column justify-between h-100"
    elevation="0"
  >
    <!-- Visual status preview container -->
    <div 
      class="bg-surface-container-low rounded-lg mb-4 d-flex flex-column align-center justify-center border border-outline-variant-30 overflow-hidden position-relative aspect-ratio-4-3"
    >
      <!-- Completed status layout -->
      <template v-if="file.status === 'completed'">
        <v-icon icon="mdi-file-pdf-box" color="error" size="64" class="mb-2"></v-icon>
        <span class="text-caption font-weight-bold text-success bg-success-container px-3 py-1 rounded-pill">
          Listo
        </span>
      </template>

      <!-- Processing state -->
      <template v-else-if="['processing', 'uploaded', 'chunked', 'ai_processing'].includes(file.status)">
        <v-progress-circular 
          indeterminate 
          color="primary" 
          size="40" 
          width="4" 
          class="mb-3"
        ></v-progress-circular>
        <span class="text-caption font-weight-bold text-primary bg-primary-container px-3 py-1 rounded-pill pulse-animation">
          Procesando...
        </span>
      </template>

      <!-- Failed state -->
      <template v-else-if="file.status === 'failed'">
        <v-icon icon="mdi-alert-circle" color="error" size="64" class="mb-2"></v-icon>
        <span class="text-caption font-weight-bold text-error bg-error-container px-3 py-1 rounded-pill">
          Error de procesamiento
        </span>
      </template>

      <!-- Canceled state -->
      <template v-else>
        <v-icon icon="mdi-file-cancel" color="on-surface-variant" size="64" class="mb-2"></v-icon>
        <span class="text-caption font-weight-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-pill">
          Cancelado
        </span>
      </template>

      <!-- Overlay for interactions -->
      <div 
        v-if="file.status === 'completed'"
        class="overlay position-absolute d-flex align-center justify-center w-100 h-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        @click="goToDetail"
      >
        <v-btn color="primary" icon="mdi-eye" size="large" elevation="2"></v-btn>
      </div>
    </div>
    
    <!-- Info Section -->
    <div class="d-flex align-start justify-space-between flex-grow-1">
      <div class="flex-grow-1 min-w-0 pr-2">
        <h4 
          class="text-body-2 font-weight-bold text-on-surface text-truncate mb-1 cursor-pointer hover-text-primary"
          @click="goToDetail"
          :title="file.filename"
        >
          {{ file.filename }}
        </h4>
        <p class="text-caption text-on-surface-variant mb-0">
          {{ formattedDate }} • {{ formattedSize }}
        </p>
      </div>
      
      <div class="d-flex align-center">
        <!-- Retry button if failed -->
        <v-btn 
          v-if="file.status === 'failed'"
          icon="mdi-refresh" 
          variant="text" 
          size="small" 
          color="primary"
          class="mr-1"
          title="Reintentar procesamiento"
          @click="reprocessFile"
        ></v-btn>
        
        <!-- Delete button -->
        <v-btn 
          icon="mdi-delete" 
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
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Document } from '@/types/document.types'
import { useDocumentStore } from '@/store/documentStore'

const props = defineProps<{
  file: Document
}>()

const router = useRouter()
const documentStore = useDocumentStore()
const deleting = ref(false)

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

function goToDetail() {
  if (props.file.status === 'completed') {
    // Navigate to document detail or start a test
    router.push({ name: 'FileList' }) // Or customized view if detail exists
  }
}

async function reprocessFile() {
  try {
    await documentStore.reprocessDocument(props.file.id)
  } catch (error) {
    console.error('Error reprocessing file:', error)
  }
}

async function deleteFile() {
  if (!confirm(`¿Estás seguro de eliminar el archivo "${props.file.filename}"?`)) return
  deleting.value = true
  try {
    await documentStore.deleteDocument(props.file.id)
  } catch (error) {
    console.error('Error deleting file:', error)
  } finally {
    deleting.value = false
  }
}
</script>

<script lang="ts">
export default {
  name: 'FileCard'
}
</script>

<style scoped>
.aspect-ratio-4-3 {
  aspect-ratio: 4 / 3;
}
.border-outline-variant-30 {
  border-color: rgba(var(--v-theme-outline-variant), 0.3) !important;
}
.overlay {
  background-color: rgba(var(--v-theme-surface-container), 0.7);
  top: 0;
  left: 0;
  z-index: 2;
}
.hover-shadow:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  transform: translateY(-2px);
}
.group:hover .overlay {
  opacity: 1 !important;
}
.hover-error:hover {
  color: rgb(var(--v-theme-error)) !important;
}
.hover-text-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
  text-decoration: underline;
}
.bg-success-container {
  background-color: rgba(var(--v-theme-success), 0.15) !important;
}
.bg-primary-container {
  background-color: rgba(var(--v-theme-primary), 0.15) !important;
}
.bg-error-container {
  background-color: rgba(var(--v-theme-error), 0.15) !important;
}
.pulse-animation {
  animation: pulse 2s infinite ease-in-out;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
