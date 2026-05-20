<template>
  <v-card :class="isDark ? 'bg-surface-container' : 'bg-surface-container-lowest'" border class="rounded-xl pa-6 hover-shadow" elevation="0">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h6 font-weight-bold d-flex align-center ga-2">
        <v-icon icon="mdi-folder-open" color="primary"></v-icon>
        Recent Files
      </h2>
      <v-btn variant="text" color="primary" class="text-caption font-weight-medium px-2" to="/dashboard/files">View All</v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="6" v-for="file in recentFiles" :key="file.id">
        <div class="d-flex align-center ga-4 pa-4 border rounded-lg file-card group cursor-pointer" @click="$router.push('/dashboard/files')">
          <div class="bg-primary-fixed pa-3 rounded-lg text-primary d-flex align-center justify-center">
            <v-icon icon="mdi-file-document-outline"></v-icon>
          </div>
          <div class="flex-grow-1 overflow-hidden">
            <p class="text-body-2 font-weight-bold text-truncate mb-0" :title="file.filename">{{ file.filename }}</p>
            <p class="text-caption text-on-surface-variant mb-0">{{ formatDate(file.created_at) }} • {{ formatSize(file.size_types) }}</p>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="d-flex align-center justify-center ga-2 pa-4 border border-dashed rounded-lg upload-card cursor-pointer h-100" @click="$router.push('/dashboard/files')">
          <v-icon icon="mdi-cloud-upload" color="primary"></v-icon>
          <span class="text-caption text-primary font-weight-medium">Upload New PDF</span>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useDocumentStore } from '@/store/documentStore'
import { useRouter } from 'vue-router'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
const documentStore = useDocumentStore()
const router = useRouter()

const recentFiles = computed(() => {
  return documentStore.documents.slice(0, 3)
})

onMounted(() => {
  if (documentStore.documents.length === 0) {
    documentStore.fetchDocuments()
  }
})

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
.file-card {
  border-color: rgba(var(--v-theme-outline-variant), 0.5) !important;
  transition: all 0.3s ease;
}
.file-card:hover {
  border-color: rgb(var(--v-theme-primary-container)) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1 !important;
}
.opacity-0 {
  opacity: 0;
}
.upload-card {
  border-color: rgba(var(--v-theme-outline-variant), 0.8) !important;
  border-width: 2px !important;
  transition: all 0.3s ease;
}
.upload-card:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-surface-container), 0.5);
}
.hover-shadow {
  transition: box-shadow 0.3s ease;
}
.hover-shadow:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}
</style>
