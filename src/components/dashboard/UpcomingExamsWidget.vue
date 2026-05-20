<template>
  <v-card color="primary" class="rounded-xl pa-6 text-on-primary upcoming-card overflow-hidden" elevation="6">
    <div class="position-relative z-10">
      <h3 class="text-h6 font-weight-bold mb-4">Upcoming Exams</h3>
      
      <div class="d-flex flex-column ga-4">
        <div v-for="exam in upcomingExams" :key="exam.id" class="blur-bg rounded-lg pa-4 border border-white-20">
          <div class="d-flex justify-space-between align-start mb-2">
            <span class="text-caption text-uppercase font-weight-medium opacity-80 letter-spacing-wide">{{ exam.status }}</span>
            <span v-if="exam.test_template_id" class="bg-white-20 text-caption px-2 py-1 rounded text-white">Template</span>
          </div>
          <p class="text-body-2 font-weight-bold mb-0">{{ exam.title }}</p>
          <p class="text-caption opacity-90 mt-1 mb-0">{{ exam.question_count || 0 }} Questions</p>
        </div>
        <div v-if="upcomingExams.length === 0" class="text-center">
          <p class="text-body-2 mb-0 opacity-80">No upcoming exams.</p>
        </div>
      </div>

      <v-btn color="white" class="text-primary w-100 mt-6 font-weight-bold" rounded="lg" elevation="0" to="/dashboard/exams">
        Manage Exams
      </v-btn>
    </div>

    <!-- Abstract Background Pattern -->
    <div class="bg-pattern blur-3xl rounded-circle position-absolute"></div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExamStore } from '@/store/examStore'

const examStore = useExamStore()

const upcomingExams = computed(() => {
  return examStore.tests.filter(t => t.status !== 'completed' && t.status !== 'failed').slice(0, 2)
})
</script>

<style scoped>
.upcoming-card {
  position: relative;
}
.z-10 {
  z-index: 10;
}
.blur-bg {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}
.border-white-20 {
  border-color: rgba(255, 255, 255, 0.2) !important;
}
.bg-white-20 {
  background-color: rgba(255, 255, 255, 0.2);
}
.letter-spacing-wide {
  letter-spacing: 0.05em;
}
.bg-pattern {
  width: 160px;
  height: 160px;
  background-color: rgba(255, 255, 255, 0.1);
  filter: blur(48px);
  bottom: -40px;
  right: -40px;
}
</style>
