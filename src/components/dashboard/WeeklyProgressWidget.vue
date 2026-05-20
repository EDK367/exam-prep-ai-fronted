<template>
  <v-card class="bg-surface-container-lowest rounded-xl pa-6 hover-shadow" border elevation="0">
    <h3 class="text-caption font-weight-bold text-on-surface-variant text-uppercase letter-spacing-wide mb-6">
      Overall Progress
    </h3>

    <div class="d-flex flex-column ga-6">
      <div>
        <div class="d-flex justify-space-between mb-2">
          <span class="text-caption text-on-surface-variant">Exams Completed</span>
          <span class="text-caption font-weight-bold">{{ completedExams }}/{{ totalExams }}</span>
        </div>
        <v-progress-linear
          :model-value="examsProgress"
          color="primary-container"
          bg-color="surface-container-highest"
          height="8"
          rounded
        ></v-progress-linear>
      </div>

      <div>
        <div class="d-flex justify-space-between mb-2">
          <span class="text-caption text-on-surface-variant">Documents Processed</span>
          <span class="text-caption font-weight-bold">{{ completedDocs }}/{{ totalDocs }}</span>
        </div>
        <v-progress-linear
          :model-value="docsProgress"
          color="primary"
          bg-color="surface-container-highest"
          height="8"
          rounded
        ></v-progress-linear>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExamStore } from '@/store/examStore'
import { useDocumentStore } from '@/store/documentStore'

const examStore = useExamStore()
const documentStore = useDocumentStore()

const completedExams = computed(() => examStore.tests.filter(t => t.status === 'completed').length)
const totalExams = computed(() => Math.max(examStore.tests.length, 1))
const examsProgress = computed(() => (completedExams.value / totalExams.value) * 100)

const completedDocs = computed(() => documentStore.documents.filter(d => d.status === 'completed').length)
const totalDocs = computed(() => Math.max(documentStore.documents.length, 1))
const docsProgress = computed(() => (completedDocs.value / totalDocs.value) * 100)
</script>

<style scoped>
.letter-spacing-wide {
  letter-spacing: 0.1em;
}
.hover-shadow {
  transition: box-shadow 0.3s ease;
}
.hover-shadow:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}
</style>
