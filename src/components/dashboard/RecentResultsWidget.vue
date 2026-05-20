<template>
  <v-card :class="isDark ? 'bg-surface-container' : 'bg-surface-container-lowest'" border class="rounded-xl pa-6 hover-shadow" elevation="0">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h6 font-weight-bold d-flex align-center ga-2">
        <v-icon icon="mdi-medal-outline" color="primary"></v-icon>
        Recent Results
      </h2>
      <v-btn variant="text" color="primary" class="text-caption font-weight-medium px-2" to="/dashboard/exams">View Exams</v-btn>
    </div>

    <div class="d-flex flex-column ga-4">
      <div v-for="(exam, index) in recentExams" :key="exam.id" class="d-flex align-center justify-space-between pa-4 rounded-lg bg-background result-card cursor-pointer" :class="index % 2 === 0 ? 'primary-border' : 'tertiary-border'" @click="$router.push(`/dashboard/results/${exam.id}`)">
        <div>
          <p class="text-body-2 font-weight-bold mb-1">{{ exam.title }}</p>
          <p class="text-caption text-on-surface-variant mb-0">{{ exam.score !== null ? `${exam.score}% Accuracy` : 'Completed' }} • {{ exam.question_count || 0 }} Questions</p>
        </div>
        <div class="text-right">
          <v-chip :color="index % 2 === 0 ? 'primary-fixed' : 'secondary-container'" :class="index % 2 === 0 ? 'text-on-primary-fixed-variant' : 'text-on-secondary-container'" size="small" variant="flat">
            {{ (exam.score || 0) >= 80 ? 'High Score' : ((exam.score || 0) >= 60 ? 'Average' : 'Review needed') }}
          </v-chip>
        </div>
      </div>
      <div v-if="recentExams.length === 0" class="text-center pa-4">
        <p class="text-body-2 text-on-surface-variant">No completed exams yet.</p>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useExamStore } from '@/store/examStore'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
const examStore = useExamStore()

const recentExams = computed(() => {
  return examStore.tests.filter(t => t.status === 'completed').slice(0, 3)
})

onMounted(() => {
  if (examStore.tests.length === 0) {
    examStore.fetchTests()
  }
})
</script>

<style scoped>
.result-card {
  border-left-width: 4px;
  border-left-style: solid;
}
.primary-border {
  border-left-color: rgb(var(--v-theme-primary));
}
.tertiary-border {
  border-left-color: rgb(var(--v-theme-tertiary));
}
.hover-shadow {
  transition: box-shadow 0.3s ease;
}
.hover-shadow:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}
</style>
