<template>
  <v-dialog v-model="dialog" max-width="800" scrollable>
    <v-card class="rounded-xl bg-surface">
      <v-toolbar color="transparent" class="px-2 border-b" density="comfortable">
        <v-toolbar-title class="text-h6 font-weight-bold">Select Document for Exam</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <div class="mb-8">
          <h3 class="text-subtitle-1 font-weight-bold mb-4">Option A: Upload New Document</h3>
          <div 
            class="d-flex align-center justify-center pa-8 border-dashed rounded-lg bg-surface-container-lowest cursor-pointer hover-bg transition-colors"
            @click="triggerUpload"
            v-ripple
          >
            <div class="text-center">
              <v-icon icon="mdi-cloud-upload" size="48" color="primary" class="mb-2"></v-icon>
              <h4 class="text-body-1 font-weight-bold">Upload PDF Document</h4>
              <p class="text-caption text-on-surface-variant mb-0">Max 50MB. Only PDF allowed.</p>
            </div>
            <input type="file" ref="fileInput" class="d-none" accept=".pdf" @change="handleFileUpload" />
          </div>
          
          <v-progress-linear 
            v-if="documentStore.uploading" 
            :model-value="documentStore.uploadProgress" 
            color="primary" 
            height="8" 
            rounded
            class="mt-4"
          ></v-progress-linear>
        </div>

        <v-divider class="my-6"></v-divider>

        <div>
          <h3 class="text-subtitle-1 font-weight-bold mb-4">Option B: Select Existing Document</h3>
          
          <div v-if="documentStore.loading" class="d-flex justify-center py-8">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          
          <v-list v-else class="bg-transparent pa-0">
            <div v-if="completedDocuments.length === 0" class="text-center py-8 text-on-surface-variant">
              No completed documents found. Upload one first.
            </div>
            
            <v-list-item 
              v-for="doc in completedDocuments" 
              :key="doc.id"
              class="mb-3 rounded-lg border pa-4 cursor-pointer hover-shadow"
              @click="selectDocument(doc.id)"
            >
              <template v-slot:prepend>
                <div class="bg-primary-container pa-3 rounded-lg mr-4">
                  <v-icon icon="mdi-file-pdf-box" color="primary"></v-icon>
                </div>
              </template>
              
              <v-list-item-title class="font-weight-bold mb-1">{{ doc.filename }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ formatDate(doc.created_at) }} • {{ formatSize(doc.size_types) }} • {{ doc.chunk_count || 0 }} pages/chunks
              </v-list-item-subtitle>
              
              <template v-slot:append>
                <v-btn variant="text" color="primary" icon="mdi-chevron-right"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentStore } from '@/store/documentStore'
import { useUiStore } from '@/store/uiStore'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()
const documentStore = useDocumentStore()
const uiStore = useUiStore()

const fileInput = ref<HTMLInputElement | null>(null)

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const completedDocuments = computed(() => {
  return documentStore.documents.filter(d => d.status === 'completed')
})

watch(dialog, (isOpen) => {
  if (isOpen) {
    documentStore.fetchDocuments()
  }
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
    const uploadedDoc = await documentStore.uploadDocument(file)
    uiStore.addNotification('success', 'Document uploaded. Processing started.')
    dialog.value = false
    router.push(`/dashboard/exams/create/${uploadedDoc.id}`)
  } catch (error) {
    console.error('Upload failed', error)
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

const selectDocument = (documentId: string) => {
  dialog.value = false
  router.push(`/dashboard/exams/create/${documentId}`)
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatSize(bytes?: number) {
  if (!bytes) return '0 KB'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}
</script>

<style scoped>
.border-dashed {
  border-style: dashed !important;
  border-color: rgb(var(--v-theme-outline-variant)) !important;
  border-width: 2px !important;
}
.hover-bg:hover {
  background-color: rgba(var(--v-theme-surface-container-low), 0.5) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}
.hover-shadow {
  transition: all 0.3s ease;
}
.hover-shadow:hover {
  border-color: rgb(var(--v-theme-primary-container)) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}
</style>
