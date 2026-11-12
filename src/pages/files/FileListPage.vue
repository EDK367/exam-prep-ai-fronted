<template>
  <v-container class="max-w-7xl mx-auto px-4 px-md-8 py-8" fluid>
    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4 mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold text-on-surface mb-1">Mis Archivos</h1>
        <p class="text-body-2 text-on-surface-variant mb-0">Gestiona tus materiales de estudio y documentos PDF procesados con IA.</p>
      </div>
      <div class="d-flex align-center ga-3">
        <v-btn 
          @click="triggerUpload" 
          :loading="uploading" 
          color="primary" 
          class="text-on-primary px-5 rounded-lg font-weight-bold" 
          size="default" 
          elevation="1"
        >
          <v-icon icon="mdi-cloud-upload" class="mr-2"></v-icon>
          Subir Documento
        </v-btn>
        <input type="file" ref="fileInput" class="d-none" accept=".pdf" @change="handleFileUpload" />
      </div>
    </div>

    <!-- Search & Quick Filters Bar -->
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3 mb-6">
      <div class="flex-grow-1" style="max-width: 420px;">
        <v-text-field
          v-model="searchQuery"
          placeholder="Buscar documento por nombre..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          bg-color="surface"
          clearable
          hide-details
          class="rounded-lg"
        ></v-text-field>
      </div>

      <div class="d-flex align-center ga-2 flex-wrap">
        <v-chip-group v-model="selectedCategory" mandatory color="primary">
          <v-chip value="all" filter size="small" variant="tonal" class="font-weight-medium">
            Todos ({{ documents.length }})
          </v-chip>
          <v-chip value="completed" filter size="small" variant="tonal" class="font-weight-medium">
            Listos ({{ countByStatus('completed') }})
          </v-chip>
          <v-chip value="processing" filter size="small" variant="tonal" class="font-weight-medium">
            En Proceso ({{ countProcessing }})
          </v-chip>
        </v-chip-group>
      </div>
    </div>

    <!-- Main Content Area -->
    <v-row>
      <!-- Sidebar / Storage Info -->
      <v-col cols="12" lg="3" class="d-flex flex-column ga-6">
        <v-card class="bg-surface-container-lowest rounded-xl pa-5 border" elevation="0">
          <h3 class="text-caption font-weight-bold text-on-surface-variant text-uppercase letter-spacing-wide mb-3">
            Almacenamiento
          </h3>
          <div class="d-flex flex-column ga-2">
            <div class="d-flex justify-space-between text-caption font-weight-medium align-center">
              <span class="text-on-surface-variant">{{ uploadPercentage }}% Usado</span>
              <span class="text-primary font-weight-bold" style="font-size: 0.75rem;">
                {{ usedUploads }} / {{ maxUploads }} PDFs
              </span>
            </div>
            <v-progress-linear
              :model-value="uploadPercentage"
              color="primary"
              bg-color="surface-container-highest"
              height="8"
              rounded
            ></v-progress-linear>
            <span class="text-caption text-on-surface-variant opacity-75 mt-1">
              Espacio total: {{ totalSizeFormatted }}
            </span>
          </div>
        </v-card>

        <v-card class="bg-surface-container-lowest rounded-xl pa-5 border" elevation="0">
          <h3 class="text-caption font-weight-bold text-on-surface-variant text-uppercase letter-spacing-wide mb-3">
            Guía de Estudio RAG
          </h3>
          <p class="text-caption text-on-surface-variant line-height-relaxed mb-3">
            Sube libros, temarios o apuntes en PDF. La IA dividirá el contenido en fragmentos vectoriales para generar cuestionarios y flashcards precisos.
          </p>
          <v-btn 
            variant="tonal" 
            size="small" 
            color="primary" 
            block 
            class="rounded-lg font-weight-medium text-caption"
            to="/dashboard/exams"
          >
            Ir a mis Exámenes
          </v-btn>
        </v-card>
      </v-col>

      <!-- File Grid -->
      <v-col cols="12" lg="9">
        <!-- Skeleton Loading State -->
        <v-row v-if="loading">
          <v-col cols="12" sm="6" xl="4" v-for="n in 6" :key="n">
            <v-card class="rounded-xl pa-4 border bg-surface-container-lowest" elevation="0">
              <v-skeleton-loader type="image, article"></v-skeleton-loader>
            </v-card>
          </v-col>
        </v-row>

        <!-- Document Grid -->
        <v-row v-else-if="filteredDocuments.length > 0">
          <v-col cols="12" sm="6" xl="4" v-for="file in filteredDocuments" :key="file.id">
            <FileCard :file="file" />
          </v-col>

          <!-- Add More Placeholder Card -->
          <v-col cols="12" sm="6" xl="4">
            <v-card 
              @click="triggerUpload"
              class="bg-surface-container-low border-dashed border-2 rounded-xl pa-6 d-flex flex-column align-center justify-center text-center cursor-pointer transition-all duration-300 group h-100 min-h-240"
              elevation="0"
            >
              <div class="pa-4 bg-surface-container-highest rounded-circle mb-3 transition-colors group-hover-bg">
                <v-icon icon="mdi-plus" class="text-primary transition-transform group-hover-scale" size="28"></v-icon>
              </div>
              <h4 class="text-body-2 font-weight-bold text-on-surface mb-1">Subir otro documento</h4>
              <p class="text-caption text-on-surface-variant mb-0">PDF hasta 50MB</p>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty Filter Results -->
        <div v-else class="text-center py-12 bg-surface-container-lowest rounded-xl border pa-8">
          <v-icon icon="mdi-file-search-outline" size="48" color="on-surface-variant" class="mb-3 opacity-60"></v-icon>
          <h3 class="text-subtitle-1 font-weight-bold mb-1">No se encontraron documentos</h3>
          <p class="text-caption text-on-surface-variant mb-4" v-if="searchQuery">
            Ningún archivo coincide con "{{ searchQuery }}"
          </p>
          <p class="text-caption text-on-surface-variant mb-4" v-else>
            Aún no has subido ningún documento. Comienza subiendo tu primer PDF de estudio.
          </p>
          <v-btn color="primary" size="small" class="rounded-lg px-4" @click="triggerUpload">
            Subir Documento
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import FileCard from '@/components/files/FileCard.vue'
import { useDocumentStore } from '@/store/documentStore'
import { useUiStore } from '@/store/uiStore'
import { examService } from '@/services/examService'
import type { PlanUsage } from '@/types/exam.types'

const documentStore = useDocumentStore()
const uiStore = useUiStore()

const { documents, loading, uploading } = storeToRefs(documentStore)
const fileInput = ref<HTMLInputElement | null>(null)
const planUsage = ref<PlanUsage | null>(null)
const searchQuery = ref('')
const selectedCategory = ref<'all' | 'completed' | 'processing'>('all')

async function fetchUsage() {
  try {
    const { data } = await examService.getFullUsage()
    planUsage.value = data.data
  } catch (error) {
    console.error('Failed to fetch plan usage:', error)
  }
}

const totalSizeFormatted = computed(() => {
  const bytes = documents.value.reduce((acc, doc) => acc + (doc.size_types || 0), 0)
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
})

const maxUploads = computed(() => planUsage.value?.uploads?.max ?? 5)
const usedUploads = computed(() => planUsage.value?.uploads?.used ?? documents.value.length)

const uploadPercentage = computed(() => {
  if (maxUploads.value === 0) return 0
  const pct = Math.round((usedUploads.value / maxUploads.value) * 100)
  return Math.min(pct, 100)
})

function countByStatus(status: string) {
  return documents.value.filter(d => d.status === status).length
}

const countProcessing = computed(() => {
  return documents.value.filter(d => ['processing', 'uploaded', 'chunked', 'ai_processing'].includes(d.status)).length
})

const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    // Text search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!doc.filename.toLowerCase().includes(q)) return false
    }
    // Category filter
    if (selectedCategory.value === 'completed') {
      return doc.status === 'completed'
    }
    if (selectedCategory.value === 'processing') {
      return ['processing', 'uploaded', 'chunked', 'ai_processing'].includes(doc.status)
    }
    return true
  })
})

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.type !== 'application/pdf') {
    uiStore.showError('Solo se permiten archivos en formato PDF')
    return
  }

  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    uiStore.showError('El archivo excede el tamaño máximo permitido de 50MB')
    return
  }

  try {
    await documentStore.uploadDocument(file)
    uiStore.showSuccess('Documento subido. Procesamiento con IA iniciado.')
    fetchUsage()
  } catch (error: any) {
    uiStore.showError(error?.response?.data?.detail || 'Error al subir el archivo')
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

onMounted(() => {
  documentStore.fetchDocuments()
  fetchUsage()
})
</script>

<style scoped>
.max-w-7xl {
  max-width: 1280px;
}

.min-h-240 {
  min-height: 240px;
}

.border-dashed {
  border-style: dashed !important;
}

.group:hover .group-hover-bg {
  background-color: var(--v-theme-primary-container) !important;
}

.group:hover .group-hover-scale {
  transform: scale(1.15);
}
</style>
