<template>
  <v-container class="max-w-4xl mx-auto px-4 py-8" fluid>
    <div v-if="examStore.loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="test && test.questions && test.questions.length > 0" class="d-flex flex-column h-100">
      
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-8 pb-4 border-b">
        <div>
          <v-btn variant="text" color="on-surface-variant" size="small" class="px-0 mb-1" @click="confirmExit" prepend-icon="mdi-arrow-left">
            Save & Exit
          </v-btn>
          <h1 class="text-h5 font-weight-bold text-on-surface">{{ test.title }}</h1>
        </div>
        
        <div v-if="timeRemaining !== null" class="text-center mx-4">
          <div class="text-h5 font-weight-bold" :class="timeRemaining < 60 ? 'text-error' : 'text-primary'">
            {{ formatTime(timeRemaining) }}
          </div>
          <div class="text-caption text-on-surface-variant">Time Remaining</div>
        </div>

        <div class="text-right">
          <div class="text-h6 font-weight-bold text-primary">{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</div>
          <div class="text-caption text-on-surface-variant">Question Progress</div>
        </div>
      </div>

      <v-progress-linear 
        :model-value="progressPercent" 
        color="primary" 
        bg-color="surface-container-highest"
        height="6" 
        rounded
        class="mb-8"
      ></v-progress-linear>

      <!-- Question Card -->
      <v-card v-if="currentQuestion" class="bg-surface-container-lowest rounded-xl pa-8 border flex-grow-1" elevation="0">
        <div class="mb-8">
          <v-chip size="small" color="secondary-container" class="text-secondary-container-on font-weight-bold text-uppercase mb-4 letter-spacing-wide">
            {{ currentQuestion?.questions_type?.replace('_', ' ') || 'Question' }}
          </v-chip>
          
          <h2 class="text-h5 font-weight-medium text-on-surface line-height-relaxed">
            {{ currentQuestion?.content?.question || 'Question content not available' }}
          </h2>
        </div>

        <!-- Multiple Choice Options -->
        <div v-if="currentQuestion?.questions_type === 'multiple_choice' && currentQuestion?.content?.options" class="d-flex flex-column ga-3">
          <v-card
            v-for="(option, idx) in currentQuestion.content.options"
            :key="idx"
            class="pa-4 border cursor-pointer rounded-lg transition-colors d-flex align-center"
            :class="answers[currentQuestion?.id] === option ? 'bg-primary-container border-primary text-primary-container-on' : 'bg-surface hover-bg-low'"
            elevation="0"
            @click="selectAnswer(option)"
          >
            <div 
              class="rounded-circle border d-flex align-center justify-center mr-4 transition-colors"
              style="width: 24px; height: 24px;"
              :class="answers[currentQuestion?.id] === option ? 'bg-primary border-primary' : 'bg-transparent border-outline'"
            >
              <div v-if="answers[currentQuestion?.id] === option" class="bg-on-primary rounded-circle" style="width: 10px; height: 10px;"></div>
            </div>
            <span class="text-body-1">{{ option }}</span>
          </v-card>
        </div>

        <!-- True / False Options -->
        <div v-else-if="currentQuestion?.questions_type === 'true_false'" class="d-flex flex-column ga-3">
          <v-card
            v-for="val in ['True', 'False']"
            :key="val"
            class="pa-4 border cursor-pointer rounded-lg transition-colors d-flex align-center"
            :class="answers[currentQuestion?.id] === val ? 'bg-primary-container border-primary text-primary-container-on' : 'bg-surface hover-bg-low'"
            elevation="0"
            @click="selectAnswer(val)"
          >
            <div 
              class="rounded-circle border d-flex align-center justify-center mr-4 transition-colors"
              style="width: 24px; height: 24px;"
              :class="answers[currentQuestion?.id] === val ? 'bg-primary border-primary' : 'bg-transparent border-outline'"
            >
              <div v-if="answers[currentQuestion?.id] === val" class="bg-on-primary rounded-circle" style="width: 10px; height: 10px;"></div>
            </div>
            <span class="text-body-1">{{ val }}</span>
          </v-card>
        </div>

        <!-- Open Question -->
        <div v-else>
          <v-textarea
            v-model="answers[currentQuestion?.id]"
            placeholder="Type your answer here..."
            variant="outlined"
            bg-color="surface-bright"
            rows="6"
            auto-grow
          ></v-textarea>
        </div>
      </v-card>

      <!-- Navigation -->
      <div class="d-flex justify-space-between align-center mt-8">
        <v-btn 
          variant="outlined" 
          color="on-surface-variant" 
          size="large" 
          class="px-6 rounded-lg font-weight-bold"
          :disabled="currentQuestionIndex === 0"
          @click="prevQuestion"
        >
          Previous
        </v-btn>
        
        <v-btn 
          v-if="currentQuestionIndex < totalQuestions - 1"
          color="primary" 
          size="large" 
          class="px-8 rounded-lg font-weight-bold"
          elevation="2"
          @click="nextQuestion"
        >
          Next
        </v-btn>
        
        <v-btn 
          v-else
          color="success" 
          size="large" 
          class="px-8 rounded-lg font-weight-bold"
          elevation="2"
          :loading="submitting"
          @click="submitExam"
        >
          Submit Exam
        </v-btn>
      </div>

    </div>

    <div v-else class="text-center py-12">
      <v-icon icon="mdi-alert-circle-outline" size="48" color="error" class="mb-4"></v-icon>
      <h2 class="text-h5 font-weight-bold text-on-surface mb-2">Could not load exam</h2>
      <p class="text-body-1 text-on-surface-variant mb-6">The exam questions are not available.</p>
      <v-btn color="primary" to="/dashboard/exams">Return to Exams</v-btn>
    </div>
    
    <!-- Submit Dialog -->
    <v-dialog v-model="submitDialog" max-width="400">
      <v-card class="rounded-xl pa-4">
        <div class="text-center mb-4">
          <v-icon icon="mdi-check-circle-outline" color="success" size="64"></v-icon>
        </div>
        <h3 class="text-h6 font-weight-bold text-center mb-2">Submit Exam?</h3>
        <p class="text-body-2 text-center text-on-surface-variant mb-6">
          Are you sure you want to submit your exam? You won't be able to change your answers after submission.
        </p>
        <div class="d-flex ga-3">
          <v-btn variant="outlined" class="flex-grow-1 rounded-lg" @click="submitDialog = false">Cancel</v-btn>
          <v-btn color="success" class="flex-grow-1 rounded-lg" @click="confirmSubmitExam" :loading="submitting">Submit</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Exit Dialog -->
    <v-dialog v-model="exitDialog" max-width="400">
      <v-card class="rounded-xl pa-4">
        <div class="text-center mb-4">
          <v-icon icon="mdi-exit-to-app" color="warning" size="64"></v-icon>
        </div>
        <h3 class="text-h6 font-weight-bold text-center mb-2">Save & Exit?</h3>
        <p class="text-body-2 text-center text-on-surface-variant mb-6">
          Are you sure you want to exit? Your progress will be saved but you'll have to resume later.
        </p>
        <div class="d-flex ga-3">
          <v-btn variant="outlined" class="flex-grow-1 rounded-lg" @click="exitDialog = false">Cancel</v-btn>
          <v-btn color="warning" class="flex-grow-1 rounded-lg" @click="confirmExitDialog">Exit</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '@/store/examStore'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()

const examId = route.params.id as string

const currentQuestionIndex = ref(0)
const answers = ref<Record<string, any>>({})
const submitting = ref(false)
const timeRemaining = ref<number | null>(null)
let timerInterval: any = null
const submitDialog = ref(false)
const exitDialog = ref(false)

const test = computed(() => examStore.currentTest)
const totalQuestions = computed(() => test.value?.questions?.length || 0)
const currentQuestion = computed(() => test.value?.questions?.[currentQuestionIndex.value])
const progressPercent = computed(() => {
  if (totalQuestions.value === 0) return 0
  return ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100
})

onMounted(async () => {
  if (examId) {
    if (!test.value || test.value.id !== examId) {
      await examStore.fetchTestDetail(examId)
    }
    
    const savedTimer = localStorage.getItem(`exam_timer_${examId}`)
    if (savedTimer) {
      timeRemaining.value = parseInt(savedTimer, 10)
      timerInterval = setInterval(() => {
        if (timeRemaining.value !== null && timeRemaining.value > 0) {
          timeRemaining.value--
          localStorage.setItem(`exam_timer_${examId}`, timeRemaining.value.toString())
          if (timeRemaining.value <= 0) {
            clearInterval(timerInterval)
            submitExam(true)
          }
        }
      }, 1000)
    }
  }
})

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function selectAnswer(val: any) {
  if (!currentQuestion.value) return
  answers.value[currentQuestion.value.id] = val
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
  }
}

async function submitExam(autoSubmit = false) {
  if (!test.value) return
  
  if (autoSubmit !== true) {
    submitDialog.value = true
    return
  }

  await confirmSubmitExam()
}

async function confirmSubmitExam() {
  if (!test.value) return
  submitDialog.value = false
  submitting.value = true
  try {
    const formattedAnswers = Object.entries(answers.value).map(([qId, val]) => ({
      question_id: qId,
      response_text: val
    }))
    
    await examStore.submitTest(test.value.id, formattedAnswers)
    localStorage.removeItem(`exam_timer_${examId}`)
    router.push(`/dashboard/results/${test.value.id}`)
  } catch (error) {
    console.error("Failed to submit exam", error)
    submitting.value = false
  }
}

function confirmExit() {
  exitDialog.value = true
}

function confirmExitDialog() {
  exitDialog.value = false
  router.push(`/dashboard/exams/${examId}`)
}
</script>

<style scoped>
.max-w-4xl {
  max-width: 1024px;
}
.letter-spacing-wide {
  letter-spacing: 0.05em;
}
.line-height-relaxed {
  line-height: 1.6;
}
.hover-bg-low:hover {
  background-color: rgba(var(--v-theme-surface-container-low), 0.5) !important;
}
</style>
