<template>
  <v-container class="max-w-4xl mx-auto px-4 py-8" fluid>
    <v-btn variant="text" color="on-surface-variant" class="mb-6 px-0" to="/dashboard/exams" prepend-icon="mdi-arrow-left">
      Back to Exams
    </v-btn>

    <div v-if="examStore.loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="result" class="d-flex flex-column ga-8">
      
      <!-- Score Header Card -->
      <v-card class="bg-surface-container-lowest rounded-xl pa-8 border text-center" elevation="0">
        <h1 class="text-h4 font-weight-bold mb-2">{{ result.title }} - Results</h1>
        <p class="text-body-1 text-on-surface-variant mb-8">You've completed the exam. Here's how you did.</p>
        
        <div class="d-flex flex-column align-center justify-center">
          <div class="position-relative d-flex align-center justify-center mb-4" style="width: 160px; height: 160px;">
            <v-progress-circular 
              :model-value="result.score_percent" 
              :color="result.passed ? 'success' : 'error'" 
              size="160" 
              width="16"
              bg-color="surface-container-highest"
            ></v-progress-circular>
            <div class="position-absolute d-flex flex-column align-center">
              <span class="text-h3 font-weight-bold" :class="result.passed ? 'text-success' : 'text-error'">
                {{ result.score_percent.toFixed(0) }}%
              </span>
            </div>
          </div>
          
          <h2 class="text-h5 font-weight-bold" :class="result.passed ? 'text-success' : 'text-error'">
            {{ result.passed ? 'Passed!' : 'Needs Improvement' }}
          </h2>
        </div>

        <v-row class="mt-8 mx-auto" style="max-width: 600px;">
          <v-col cols="4">
            <div class="bg-surface-container-low rounded-lg pa-4 border">
              <div class="text-h5 font-weight-bold text-success">{{ result.correct_answers }}</div>
              <div class="text-caption text-on-surface-variant text-uppercase">Correct</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="bg-surface-container-low rounded-lg pa-4 border">
              <div class="text-h5 font-weight-bold text-error">{{ result.incorrect_answers }}</div>
              <div class="text-caption text-on-surface-variant text-uppercase">Incorrect</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="bg-surface-container-low rounded-lg pa-4 border">
              <div class="text-h5 font-weight-bold text-warning">{{ result.unanswered }}</div>
              <div class="text-caption text-on-surface-variant text-uppercase">Skipped</div>
            </div>
          </v-col>
        </v-row>

        <div class="d-flex justify-center mt-8 ga-4">
          <v-btn color="primary" variant="outlined" class="px-6 rounded-lg font-weight-bold" @click="handleRetake" :loading="retaking">
            <v-icon icon="mdi-refresh" class="mr-2"></v-icon>
            Retake Exam
          </v-btn>
          <v-btn color="primary" class="px-6 rounded-lg font-weight-bold" to="/dashboard/exams">
            Back to Exams
          </v-btn>
        </div>
      </v-card>

      <!-- Detailed Review -->
      <div>
        <h3 class="text-h5 font-weight-bold mb-6">Detailed Review</h3>
        
        <div class="d-flex flex-column ga-6">
          <v-card 
            v-for="(q, idx) in result.questions" 
            :key="q.id"
            class="bg-surface-container-lowest rounded-xl pa-6 border"
            :class="q.is_correct ? 'border-success' : 'border-error'"
            elevation="0"
          >
            <div class="d-flex align-start ga-4 mb-4">
              <div 
                class="rounded-circle d-flex align-center justify-center shrink-0"
                style="width: 32px; height: 32px;"
                :class="q.is_correct ? 'bg-success-container text-success' : 'bg-error-container text-error'"
              >
                <v-icon :icon="q.is_correct ? 'mdi-check' : 'mdi-close'" size="small"></v-icon>
              </div>
              <div>
                <div class="text-caption font-weight-bold mb-1 text-on-surface-variant">QUESTION {{ idx + 1 }}</div>
                <h4 class="text-body-1 font-weight-medium line-height-relaxed">{{ q.content?.question || 'Question content missing' }}</h4>
              </div>
            </div>

            <div class="ml-12 pl-2 border-s-2" :class="q.is_correct ? 'border-success' : 'border-error'">
              <div class="mb-4">
                <span class="text-caption text-on-surface-variant d-block mb-1">Your Answer:</span>
                <span class="text-body-2 font-weight-bold" :class="q.is_correct ? 'text-success' : 'text-error'">
                  {{ q.user_answer || 'No answer provided' }}
                </span>
              </div>
              
              <div v-if="!q.is_correct && q.content?.correct_answer" class="mb-4">
                <span class="text-caption text-on-surface-variant d-block mb-1">Correct Answer:</span>
                <span class="text-body-2 font-weight-bold text-success">
                  {{ q.content.correct_answer }}
                </span>
              </div>

              <div v-if="q.explanation" class="bg-surface-container-low rounded-lg pa-4">
                <span class="text-caption text-on-surface-variant font-weight-bold d-flex align-center ga-1 mb-1">
                  <v-icon icon="mdi-lightbulb-outline" size="small"></v-icon>
                  Explanation
                </span>
                <p class="text-body-2 mb-0">{{ q.explanation }}</p>
              </div>
            </div>
          </v-card>
        </div>
      </div>
      
    </div>

    <div v-else class="text-center py-12">
      <v-icon icon="mdi-alert-circle-outline" size="48" color="error" class="mb-4"></v-icon>
      <h2 class="text-h5 font-weight-bold text-on-surface mb-2">Results Not Found</h2>
      <p class="text-body-1 text-on-surface-variant mb-6">The requested results could not be loaded.</p>
      <v-btn color="primary" to="/dashboard/exams">Return to Exams</v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '@/store/examStore'
import { useUiStore } from '@/store/uiStore'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()
const uiStore = useUiStore()

const examId = route.params.id as string
const retaking = ref(false)

const result = computed(() => examStore.currentResult)

onMounted(async () => {
  if (examId) {
    await examStore.fetchTestResults(examId)
  }
})

async function handleRetake() {
  const confirmed = await uiStore.showConfirm({
    title: '¿Rehacer examen?',
    message: '¿Estás seguro de que quieres volver a realizar este examen? Esto borrará tus respuestas y puntaje actuales.',
    confirmText: 'Volver a realizar',
    cancelText: 'Cancelar',
    color: 'warning'
  })
  if (confirmed) {
    retaking.value = true
    try {
      await examStore.retakeTest(examId)
      router.push(`/dashboard/exams/${examId}/session`)
    } catch (e) {
      console.error(e)
      retaking.value = false
    }
  }
}
</script>

<style scoped>
.max-w-4xl {
  max-width: 1024px;
}
.line-height-relaxed {
  line-height: 1.6;
}
.shrink-0 {
  flex-shrink: 0;
}
.border-s-2 {
  border-left-width: 2px !important;
  border-left-style: solid !important;
}
</style>
