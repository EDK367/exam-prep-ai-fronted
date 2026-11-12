<template>
  <v-container class="max-w-4xl mx-auto px-4 py-8" fluid>
    <v-btn variant="text" color="on-surface-variant" class="mb-6 px-0" to="/dashboard/exams" prepend-icon="mdi-arrow-left">
      Volver a Exámenes
    </v-btn>

    <div v-if="examStore.loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="test" class="d-flex flex-column ga-6">
      <div class="d-flex flex-column flex-md-row align-md-start justify-space-between ga-4">
        <div>
          <div class="d-flex align-center ga-3 mb-2">
            <v-chip :color="statusColor" size="small" variant="flat" class="text-uppercase font-weight-bold letter-spacing-wide">
              {{ test.status === 'completed' ? 'Completado' : (test.status === 'in_progress' ? 'En Progreso' : 'Pendiente') }}
            </v-chip>
            <span class="text-caption text-on-surface-variant">{{ formatDate(test.created_at) }}</span>
          </div>
          <h1 class="text-h4 font-weight-bold text-on-surface mb-2">{{ test.title }}</h1>
          <p class="text-body-2 text-on-surface-variant">
            {{ test.question_count || (test.questions ? test.questions.length : 0) }} Preguntas • Evaluado con IA
          </p>
        </div>
        
        <div class="d-flex align-center ga-3">
          <v-btn 
            v-if="test.status === 'completed'"
            color="primary" 
            size="large" 
            class="px-8 font-weight-bold rounded-lg"
            elevation="2"
            :to="`/dashboard/results/${test.id}`"
          >
            Ver Resultados
          </v-btn>
          <v-btn 
            v-else
            color="primary" 
            class="text-on-primary px-8 font-weight-bold rounded-lg" 
            size="large" 
            elevation="2"
            @click="startOrResumeExam"
            :loading="starting"
          >
            {{ test.status === 'in_progress' ? 'Reanudar Examen' : 'Comenzar Examen' }}
          </v-btn>
        </div>
      </div>

      <!-- Quick Study Mode Cards (If document attached) -->
      <v-card v-if="test.document_id" class="rounded-xl pa-5 bg-surface-container-low border" elevation="0">
        <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3">
          <div>
            <h3 class="text-subtitle-1 font-weight-bold mb-1 d-flex align-center ga-2 text-primary">
              <v-icon icon="mdi-book-education-outline" size="22"></v-icon>
              Preparación previa al examen
            </h3>
            <p class="text-caption text-on-surface-variant mb-0">
              Repasa los puntos clave y conceptos técnicos antes de iniciar la evaluación con temporizador.
            </p>
          </div>
          <div class="d-flex align-center ga-2">
            <v-btn 
              variant="tonal" 
              color="primary" 
              size="small" 
              class="font-weight-bold text-caption rounded-lg"
              prepend-icon="mdi-cards-outline"
              @click="showFlashcards = true"
            >
              Flashcards
            </v-btn>
            <v-btn 
              variant="tonal" 
              color="secondary" 
              size="small" 
              class="font-weight-bold text-caption rounded-lg"
              prepend-icon="mdi-text-box-search-outline"
              @click="showSummary = true"
            >
              Resumen
            </v-btn>
          </div>
        </div>
      </v-card>

      <!-- Exam Overview Card -->
      <v-card class="bg-surface-container-lowest rounded-xl pa-6 border" elevation="0">
        <h3 class="text-h6 font-weight-bold mb-4">Detalles del Examen</h3>
        <p class="text-body-2 text-on-surface-variant mb-4">
          Esta evaluación fue diseñada para medir tu retención conceptual y habilidades prácticas basadas en tu documento de estudio.
        </p>
        <v-list class="bg-transparent pa-0">
          <v-list-item class="px-0">
            <template v-slot:prepend>
              <v-icon icon="mdi-format-list-checks" color="primary" class="mr-3"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">Estructura</v-list-item-title>
            <v-list-item-subtitle>Opción múltiple, Verdadero/Falso y Preguntas Abiertas</v-list-item-subtitle>
          </v-list-item>
          <v-list-item class="px-0">
            <template v-slot:prepend>
              <v-icon icon="mdi-timer-outline" color="primary" class="mr-3"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">Límite de Tiempo</v-list-item-title>
            <v-list-item-subtitle>{{ test.config?.time_limit ? `${test.config.time_limit} minutos` : 'Sin límite (a tu propio ritmo)' }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item class="px-0">
            <template v-slot:prepend>
              <v-icon icon="mdi-auto-fix" color="primary" class="mr-3"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">Retroalimentación Instantánea</v-list-item-title>
            <v-list-item-subtitle>El análisis de aciertos, fallos y explicaciones se calcula al instante</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card>
    </div>

    <div v-else class="text-center py-12">
      <v-icon icon="mdi-alert-circle-outline" size="48" color="error" class="mb-4"></v-icon>
      <h2 class="text-h5 font-weight-bold text-on-surface mb-2">Examen no encontrado</h2>
      <p class="text-body-1 text-on-surface-variant mb-6">El examen solicitado no existe o no se pudo cargar.</p>
      <v-btn color="primary" to="/dashboard/exams">Volver a Exámenes</v-btn>
    </div>

    <!-- Modals for Pre-Study -->
    <FlashcardsDialog
      v-if="test?.document_id"
      v-model="showFlashcards"
      :document-id="test.document_id"
      :filename="test.title"
    />

    <DocumentSummaryDialog
      v-if="test?.document_id"
      v-model="showSummary"
      :document-id="test.document_id"
      :filename="test.title"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '@/store/examStore'
import FlashcardsDialog from '@/components/study/FlashcardsDialog.vue'
import DocumentSummaryDialog from '@/components/study/DocumentSummaryDialog.vue'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()

const examId = route.params.id as string
const starting = ref(false)
const showFlashcards = ref(false)
const showSummary = ref(false)

const test = computed(() => examStore.currentTest)

const statusColor = computed(() => {
  if (!test.value) return 'grey'
  switch (test.value.status) {
    case 'completed': return 'success'
    case 'in_progress': return 'primary'
    default: return 'surface-variant'
  }
})

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

async function startOrResumeExam() {
  if (!test.value) return
  starting.value = true
  try {
    if (test.value.status === 'ready') {
      await examStore.startTest(test.value.id)
    }
    router.push(`/dashboard/exams/${test.value.id}/session`)
  } catch (e) {
    console.error(e)
  } finally {
    starting.value = false
  }
}

onMounted(async () => {
  if (examId) {
    await examStore.fetchTestDetail(examId)
  }
})
</script>

<style scoped>
.max-w-4xl {
  max-width: 1024px;
}
</style>
