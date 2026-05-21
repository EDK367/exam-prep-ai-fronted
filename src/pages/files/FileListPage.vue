<template>
  <v-container class="max-w-7xl mx-auto px-4 px-md-8 py-12" fluid>
    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4 mb-12">
      <div>
        <h1 class="text-h3 font-weight-bold text-on-surface mb-1">My Files</h1>
        <p class="text-body-1 text-on-surface-variant">Manage your study materials and uploaded PDF documents.</p>
      </div>
      <v-btn @click="triggerUpload" :loading="uploading" color="primary-container" class="text-on-primary-container px-6" size="large" rounded="xl" elevation="2">
        <v-icon icon="mdi-upload" class="mr-2"></v-icon>
        Upload New
      </v-btn>
      <input type="file" ref="fileInput" class="d-none" accept=".pdf" @change="handleFileUpload" />
    </div>

    <!-- Dashboard Layout: Sidebar & Content -->
    <v-row>
      <!-- Sidebar / Quick Actions -->
      <v-col cols="12" lg="3" class="d-flex flex-column ga-6">
        <v-card class="bg-surface-container-lowest rounded-xl pa-6 border" elevation="0">
          <h3 class="text-caption font-weight-bold text-on-surface-variant text-uppercase letter-spacing-wide mb-4">
            Storage
          </h3>
          <div class="d-flex flex-column ga-2">
            <div class="d-flex justify-space-between text-caption font-weight-medium align-center">
              <span class="text-on-surface-variant">{{ uploadPercentage }}% Usado</span>
              <span class="text-primary font-weight-bold text-right" style="font-size: 0.75rem;">
                {{ usedUploads }} / {{ maxUploads }} PDFs ({{ totalSizeFormatted }})
              </span>
            </div>
            <v-progress-linear
              :model-value="uploadPercentage"
              color="primary-container"
              bg-color="surface-container-highest"
              height="8"
              rounded
            ></v-progress-linear>
          </div>
        </v-card>

        <v-card class="bg-surface-container-lowest rounded-xl pa-6 border" elevation="0">
          <h3 class="text-caption font-weight-bold text-on-surface-variant text-uppercase letter-spacing-wide mb-4">
            Categories
          </h3>
          <v-list class="bg-transparent pa-0" density="compact">
            <v-list-item link class="bg-surface-container-low rounded-lg mb-2 text-primary font-weight-bold">
              <template v-slot:prepend>
                <v-icon icon="mdi-file-document" class="mr-2" size="small"></v-icon>
              </template>
              <v-list-item-title class="text-body-2">All Files</v-list-item-title>
            </v-list-item>
            
            <v-list-item link class="rounded-lg mb-2 text-on-surface-variant hover-bg-low">
              <template v-slot:prepend>
                <v-icon icon="mdi-star" class="mr-2" size="small"></v-icon>
              </template>
              <v-list-item-title class="text-body-2">Starred</v-list-item-title>
            </v-list-item>
            
            <v-list-item link class="rounded-lg mb-2 text-on-surface-variant hover-bg-low">
              <template v-slot:prepend>
                <v-icon icon="mdi-clock-outline" class="mr-2" size="small"></v-icon>
              </template>
              <v-list-item-title class="text-body-2">Recent</v-list-item-title>
            </v-list-item>
            
            <v-list-item link class="rounded-lg text-on-surface-variant hover-bg-low">
              <template v-slot:prepend>
                <v-icon icon="mdi-delete" class="mr-2" size="small"></v-icon>
              </template>
              <v-list-item-title class="text-body-2">Trash</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- File Grid -->
      <v-col cols="12" lg="9">
        <v-row v-if="loading">
          <v-col cols="12" class="text-center py-8">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12" sm="6" xl="4" v-for="file in documents" :key="file.id">
            <FileCard :file="file" />
          </v-col>

          <!-- Empty State / Add Placeholder -->
          <v-col cols="12" sm="6" xl="4">
            <v-card 
              @click="triggerUpload"
              class="bg-surface-container-low border-dashed border-2 rounded-xl pa-4 d-flex flex-column align-center justify-center text-center cursor-pointer transition-all duration-300 group h-100 min-h-300"
              elevation="0"
            >
              <div class="pa-4 bg-surface-container-highest rounded-circle mb-4 transition-colors group-hover-bg">
                <v-icon icon="mdi-plus" class="text-on-surface-variant group-hover-text transition-colors" size="32"></v-icon>
              </div>
              <h4 class="text-body-1 font-weight-bold text-on-surface">Add more files</h4>
              <p class="text-caption text-on-surface-variant mt-2 max-w-150">Drag and drop or click to upload</p>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
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

const usedUploads = computed(() => planUsage.value?.uploads.used ?? documents.value.length)
const maxUploads = computed(() => planUsage.value?.uploads.max ?? 5)
const uploadPercentage = computed(() => {
  if (maxUploads.value === 0) return 0
  return Math.min(100, Math.round((usedUploads.value / maxUploads.value) * 100))
})

onMounted(() => {
  documentStore.fetchDocuments()
  fetchUsage()
})

// Update usage when files are added or deleted
watch(() => documents.value.length, () => {
  fetchUsage()
})

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.type !== 'application/pdf') {
    uiStore.addNotification('error', 'Only PDF files are allowed.')
    return
  }

  try {
    await documentStore.uploadDocument(file)
    uiStore.addNotification('success', 'Document uploaded successfully. Processing started.')
  } catch (error) {
    console.error('Upload failed', error)
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<style scoped>
.max-w-7xl {
  max-width: 1280px;
}
.letter-spacing-wide {
  letter-spacing: 0.1em;
}
.hover-bg-low:hover {
  background-color: rgba(var(--v-theme-surface-container-low), 0.8) !important;
}
.border-dashed {
  border-style: dashed !important;
  border-color: rgb(var(--v-theme-outline-variant)) !important;
}
.group:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
}
.group:hover .group-hover-bg {
  background-color: rgba(var(--v-theme-primary-container), 0.2) !important;
}
.group:hover .group-hover-text {
  color: rgb(var(--v-theme-primary)) !important;
}
.min-h-300 {
  min-height: 300px;
}
.max-w-150 {
  max-width: 150px;
}
</style>
