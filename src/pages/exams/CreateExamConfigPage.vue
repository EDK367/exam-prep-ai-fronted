<template>
  <v-container class="max-w-4xl mx-auto px-4 py-8" fluid>
    <v-btn variant="text" color="on-surface-variant" class="mb-6 px-0" to="/dashboard/exams" prepend-icon="mdi-arrow-left">
      Back to Exams
    </v-btn>

    <h1 class="text-h4 font-weight-bold mb-8">Create New Exam</h1>

    <v-row>
      <!-- Configuration Panel -->
      <v-col cols="12" md="7" class="d-flex flex-column ga-6">
        <v-card class="rounded-xl pa-6 bg-surface-container-lowest border" elevation="0">
          <h2 class="text-h6 font-weight-bold mb-6 d-flex align-center ga-2">
            <v-icon icon="mdi-cog" color="primary"></v-icon>
            Exam Configuration
          </h2>

          <v-form ref="form" @submit.prevent="handleCreateExam" class="d-flex flex-column ga-4">
            <div>
              <label class="text-caption font-weight-medium text-on-surface-variant ml-1 mb-1 d-block">Exam Title</label>
              <v-text-field
                v-model="config.title"
                placeholder="e.g. Midterm Practice"
                variant="outlined"
                bg-color="surface-bright"
                hide-details
              ></v-text-field>
            </div>

            <v-row>
              <v-col cols="12" sm="4">
                <label class="text-caption font-weight-medium text-on-surface-variant ml-1 mb-1 d-block">Number of Questions</label>
                <v-select
                  v-model="config.question_count"
                  :items="availableQuestionCounts"
                  variant="outlined"
                  bg-color="surface-bright"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <label class="text-caption font-weight-medium text-on-surface-variant ml-1 mb-1 d-block">Difficulty</label>
                <v-select
                  v-model="config.difficulty"
                  :items="[
                    { title: 'Easy', value: 'easy' },
                    { title: 'Medium', value: 'medium' },
                    { title: 'Hard', value: 'hard' }
                  ]"
                  variant="outlined"
                  bg-color="surface-bright"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <label class="text-caption font-weight-medium text-on-surface-variant ml-1 mb-1 d-block">Time Limit</label>
                <v-select
                  v-model="config.time_limit"
                  :items="[
                    { title: 'No Limit', value: 0 },
                    { title: '5 mins', value: 5 },
                    { title: '15 mins', value: 15 },
                    { title: '30 mins', value: 30 },
                    { title: '60 mins', value: 60 },
                    { title: '120 mins', value: 120 }
                  ]"
                  variant="outlined"
                  bg-color="surface-bright"
                  hide-details
                ></v-select>
              </v-col>
            </v-row>

            <div class="mt-2">
              <v-checkbox
                v-model="config.include_flashcards"
                label="Generate Flashcards (Optional)"
                color="primary"
                hide-details
                density="compact"
              ></v-checkbox>
              <v-checkbox
                v-model="config.include_summary"
                label="Generate Summary (Optional)"
                color="primary"
                hide-details
                density="compact"
              ></v-checkbox>
            </div>
            
            <v-divider class="my-2"></v-divider>
            
            <div class="d-flex flex-column ga-2">
              <div class="d-flex align-center justify-space-between">
                <h3 class="text-subtitle-1 font-weight-bold text-on-surface">PLUS MODE <v-icon v-if="!canUseHardMode" icon="mdi-lock" size="small" color="error"></v-icon></h3>
                <v-switch 
                  v-model="config.hard_mode" 
                  color="error" 
                  hide-details
                  :disabled="!canUseHardMode"
                  @change="handleHardModeChange"
                ></v-switch>
              </div>
              <p v-if="!canUseHardMode" class="text-caption text-error mb-2">PLUS MODE requires Plus plan.</p>
              
              <v-expand-transition>
                <div v-if="config.hard_mode" class="bg-surface-container-low pa-4 rounded-lg border">
                  <p class="text-caption text-on-surface-variant mb-3">
                    Enabling PLUS MODE requires a minimum of 10 questions.
                  </p>
                  <v-checkbox
                    v-model="config.concept_mode"
                    label="Concept Mode (Open Questions with AI Grading)"
                    color="error"
                    hide-details
                    density="compact"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="config.multiple_answers"
                    label="Multiple Answers (Select all correct options)"
                    color="error"
                    hide-details
                    density="compact"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="config.no_go_back"
                    label="No Go Back (Cannot return to previous questions)"
                    color="error"
                    hide-details
                    density="compact"
                  ></v-checkbox>
                </div>
              </v-expand-transition>
            </div>
            
            <div class="mt-4">
              <v-btn 
                type="submit" 
                color="primary-container" 
                class="text-on-primary-container font-weight-bold w-100 rounded-lg" 
                size="large"
                :loading="examStore.generating"
                :disabled="selectedDocument?.status !== 'completed'"
                elevation="0"
              >
                {{ selectedDocument?.status !== 'completed' ? 'Processing Document...' : 'Create Exam' }}
              </v-btn>
              <p v-if="selectedDocument?.status !== 'completed'" class="text-caption text-center text-warning mt-2">
                Please wait for the document to finish processing before creating an exam.
              </p>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <!-- Document Preview Panel -->
      <v-col cols="12" md="5">
        <v-card class="rounded-xl pa-6 bg-surface-container-low border border-outline-variant" elevation="0">
          <h2 class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center ga-2 text-on-surface-variant">
            <v-icon icon="mdi-file-document-outline"></v-icon>
            Selected Document
          </h2>

          <div v-if="documentStore.loading" class="d-flex justify-center py-8">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          
          <div v-else-if="selectedDocument" class="d-flex flex-column ga-4">
            <div class="d-flex align-center justify-center bg-surface-container-highest rounded-lg py-12 px-4 mb-2">
              <v-icon icon="mdi-file-pdf-box" size="64" color="error"></v-icon>
            </div>
            
            <div>
              <h3 class="text-body-1 font-weight-bold text-on-surface mb-1">{{ selectedDocument.filename }}</h3>
              <div class="d-flex flex-column ga-1 mt-3">
                <div class="d-flex justify-space-between text-caption">
                  <span class="text-on-surface-variant">Status</span>
                  <span class="font-weight-medium text-success text-capitalize">{{ selectedDocument.status }}</span>
                </div>
                <div class="d-flex justify-space-between text-caption">
                  <span class="text-on-surface-variant">Size</span>
                  <span class="font-weight-medium">{{ formatSize(selectedDocument.size_types) }}</span>
                </div>
                <div class="d-flex justify-space-between text-caption">
                  <span class="text-on-surface-variant">Pages/Chunks</span>
                  <span class="font-weight-medium">{{ selectedDocument.chunk_count || 0 }}</span>
                </div>
                <div class="d-flex justify-space-between text-caption">
                  <span class="text-on-surface-variant">Uploaded</span>
                  <span class="font-weight-medium">{{ formatDate(selectedDocument.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-on-surface-variant">
            <v-icon icon="mdi-alert-circle-outline" size="32" class="mb-2"></v-icon>
            <p>Document not found.</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentStore } from '@/store/documentStore'
import { useExamStore } from '@/store/examStore'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const documentStore = useDocumentStore()
const examStore = useExamStore()

const currentPlan = ref('free')
const loadingPlan = ref(true)

const canUseHardMode = computed(() => {
  return currentPlan.value.toLowerCase() === 'plus'
})

const maxQuestions = computed(() => {
  return currentPlan.value.toLowerCase() === 'free' ? 10 : 30
})

const availableQuestionCounts = computed(() => {
  const counts = [5, 10, 15, 20, 25, 30]
  let validCounts = counts.filter(c => c <= maxQuestions.value)
  if (config.value.hard_mode) {
    validCounts = validCounts.filter(c => c >= 10)
  }
  return validCounts
})

const documentId = route.params.documentId as string

const config = ref({
  title: '',
  question_count: 10,
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  time_limit: 0,
  include_flashcards: false,
  include_summary: false,
  hard_mode: false,
  concept_mode: false,
  multiple_answers: false,
  no_go_back: false
})

function handleHardModeChange() {
  if (config.value.hard_mode && config.value.question_count < 10) {
    config.value.question_count = 10
  }
}

const selectedDocument = computed(() => documentStore.currentDocument)

onMounted(async () => {
  try {
    const planRes = await api.get('/billing/plan')
    currentPlan.value = planRes.data.data.plan_name || planRes.data.data.plan || 'free'
  } catch (e) {
    console.error('Failed to get plan', e)
  } finally {
    loadingPlan.value = false
  }

  if (documentId) {
    await documentStore.fetchDocument(documentId)
    if (documentStore.currentDocument) {
      config.value.title = `${documentStore.currentDocument.filename.replace('.pdf', '')} - Exam`
    }
  }
})

async function handleCreateExam() {
  if (!documentId) return
  
  try {
    const exam = await examStore.createTest({
      document_id: documentId,
      title: config.value.title,
      question_count: config.value.question_count,
      difficulty: config.value.difficulty,
      include_flashcards: config.value.include_flashcards,
      include_summary: config.value.include_summary,
      hard_mode: config.value.hard_mode,
      concept_mode: config.value.concept_mode,
      multiple_answers: config.value.multiple_answers,
      no_go_back: config.value.no_go_back
    })
    
    if (config.value.time_limit > 0) {
      localStorage.setItem(`exam_timer_${exam.id}`, (config.value.time_limit * 60).toString())
    }
    
    // Once created, redirect to the exam detail page
    router.push(`/dashboard/exams/${exam.id}`)
  } catch (error) {
    console.error("Failed to create exam", error)
  }
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
.max-w-4xl {
  max-width: 1024px;
}
</style>
