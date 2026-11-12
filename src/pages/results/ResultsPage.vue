<template>
  <v-container class="max-w-4xl mx-auto px-4 py-8" fluid>
    <div class="d-flex align-center justify-space-between mb-6">
      <v-btn variant="text" color="on-surface-variant" class="px-0" to="/dashboard/exams" prepend-icon="mdi-arrow-left">
        Volver a Exámenes
      </v-btn>

      <div v-if="result" class="d-flex align-center ga-2 d-print-none">
        <v-btn 
          variant="outlined" 
          size="small" 
          color="primary" 
          class="rounded-lg font-weight-bold"
          prepend-icon="mdi-printer"
          @click="handlePrint"
        >
          Imprimir / PDF
        </v-btn>
        <v-btn 
          variant="tonal" 
          size="small" 
          color="primary" 
          class="rounded-lg font-weight-bold"
          prepend-icon="mdi-download"
          @click="exportMarkdown"
        >
          Exportar Notas (.md)
        </v-btn>
      </div>
    </div>

    <div v-if="examStore.loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="result" class="d-flex flex-column ga-8 print-container">
      
      <!-- Score Header Card -->
      <v-card class="bg-surface-container-lowest rounded-2xl pa-8 border text-center" elevation="0">
        <h1 class="text-h4 font-weight-bold mb-2">{{ result.title }} - Resultados</h1>
        <p class="text-body-2 text-on-surface-variant mb-6">Evaluación completada con análisis asistido por IA.</p>
        
        <div class="d-flex flex-column align-center justify-center">
          <div class="position-relative d-flex align-center justify-center mb-4" style="width: 150px; height: 150px;">
            <v-progress-circular 
              :model-value="result.score_percent" 
              :color="result.passed ? 'success' : 'error'" 
              size="150" 
              width="14"
              bg-color="surface-container-highest"
            ></v-progress-circular>
            <div class="position-absolute d-flex flex-column align-center">
              <span class="text-h3 font-weight-bold" :class="result.passed ? 'text-success' : 'text-error'">
                {{ result.score_percent.toFixed(0) }}%
              </span>
            </div>
          </div>
          
          <h2 class="text-h5 font-weight-bold" :class="result.passed ? 'text-success' : 'text-error'">
            {{ result.passed ? '¡Aprobado con Éxito!' : 'Requiere Refuerzo' }}
          </h2>
        </div>

        <v-row class="mt-6 mx-auto" style="max-width: 580px;">
          <v-col cols="4">
            <div class="bg-surface-container-low rounded-xl pa-3 border">
              <div class="text-h5 font-weight-bold text-success">{{ result.correct_answers }}</div>
              <div class="text-caption text-on-surface-variant text-uppercase font-weight-medium">Correctas</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="bg-surface-container-low rounded-xl pa-3 border">
              <div class="text-h5 font-weight-bold text-error">{{ result.incorrect_answers }}</div>
              <div class="text-caption text-on-surface-variant text-uppercase font-weight-medium">Incorrectas</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="bg-surface-container-low rounded-xl pa-3 border">
              <div class="text-h5 font-weight-bold text-warning">{{ result.unanswered }}</div>
              <div class="text-caption text-on-surface-variant text-uppercase font-weight-medium">Omitidas</div>
            </div>
          </v-col>
        </v-row>

        <div class="d-flex justify-center mt-6 ga-3 d-print-none flex-wrap">
          <v-btn color="primary" variant="outlined" class="px-5 rounded-lg font-weight-bold" @click="handleRetake" :loading="retaking">
            <v-icon icon="mdi-refresh" class="mr-1"></v-icon>
            Rehacer Examen
          </v-btn>
          <v-btn color="primary" class="px-5 rounded-lg font-weight-bold" to="/dashboard/exams">
            Volver a Exámenes
          </v-btn>
        </div>
      </v-card>

      <!-- Detailed Review with Filters -->
      <div>
        <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3 mb-4">
          <h3 class="text-h5 font-weight-bold mb-0">Revisión Detallada de Preguntas</h3>
          
          <div class="d-print-none">
            <v-chip-group v-model="filterReview" mandatory color="primary">
              <v-chip value="all" filter size="small" variant="tonal" class="font-weight-medium">
                Todas ({{ result.questions?.length || 0 }})
              </v-chip>
              <v-chip value="incorrect" filter size="small" variant="tonal" class="font-weight-medium text-error">
                Solo Errores ({{ result.incorrect_answers || 0 }})
              </v-chip>
              <v-chip value="correct" filter size="small" variant="tonal" class="font-weight-medium text-success">
                Correctas ({{ result.correct_answers || 0 }})
              </v-chip>
            </v-chip-group>
          </div>
        </div>
        
        <div class="d-flex flex-column ga-5">
          <v-card 
            v-for="(q, idx) in filteredQuestions" 
            :key="q.id"
            class="bg-surface-container-lowest rounded-xl pa-5 border question-review-card"
            :class="q.is_correct ? 'border-success' : 'border-error'"
            elevation="0"
          >
            <div class="d-flex align-start ga-3 mb-3">
              <div 
                class="rounded-circle d-flex align-center justify-center shrink-0"
                style="width: 28px; height: 28px;"
                :class="q.is_correct ? 'bg-success-container text-success' : 'bg-error-container text-error'"
              >
                <v-icon :icon="q.is_correct ? 'mdi-check' : 'mdi-close'" size="16"></v-icon>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="text-caption font-weight-bold text-on-surface-variant">PREGUNTA {{ idx + 1 }}</span>
                  <v-chip size="x-small" :color="q.is_correct ? 'success' : 'error'" variant="tonal" class="font-weight-bold text-uppercase">
                    {{ q.is_correct ? 'Correcta' : 'Incorrecta' }}
                  </v-chip>
                </div>
                <h4 class="text-body-1 font-weight-medium line-height-relaxed">{{ q.content?.question || 'Contenido no disponible' }}</h4>
              </div>
            </div>

            <div class="ml-10 pl-3 border-s-2" :class="q.is_correct ? 'border-success' : 'border-error'">
              <div class="mb-3">
                <span class="text-caption text-on-surface-variant d-block mb-0.5">Tu respuesta:</span>
                <span class="text-body-2 font-weight-bold" :class="q.is_correct ? 'text-success' : 'text-error'">
                  {{ formatAnswer(q.user_answer, q) || 'Sin responder' }}
                </span>
              </div>
              
              <div v-if="!q.is_correct && q.content?.correct_answer" class="mb-3">
                <span class="text-caption text-on-surface-variant d-block mb-0.5">Respuesta correcta:</span>
                <span class="text-body-2 font-weight-bold text-success">
                  {{ formatAnswer(q.content.correct_answer, q) }}
                </span>
              </div>

              <div v-if="q.explanation" class="bg-surface-container-low rounded-lg pa-3 mt-2">
                <span class="text-caption text-primary font-weight-bold d-flex align-center ga-1 mb-1">
                  <v-icon icon="mdi-lightbulb-on-outline" size="16"></v-icon>
                  Explicación de la IA
                </span>
                <p class="text-body-2 text-on-surface mb-0 line-height-relaxed">{{ q.explanation }}</p>
              </div>
            </div>
          </v-card>
        </div>
      </div>
      
    </div>

    <div v-else class="text-center py-12">
      <v-icon icon="mdi-alert-circle-outline" size="48" color="error" class="mb-4"></v-icon>
      <h2 class="text-h5 font-weight-bold text-on-surface mb-2">Resultados no encontrados</h2>
      <p class="text-body-1 text-on-surface-variant mb-6">No se pudieron cargar los resultados solicitados.</p>
      <v-btn color="primary" to="/dashboard/exams">Volver a Exámenes</v-btn>
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
const filterReview = ref<'all' | 'incorrect' | 'correct'>('all')

const result = computed(() => examStore.currentResult)

const filteredQuestions = computed(() => {
  if (!result.value?.questions) return []
  if (filterReview.value === 'incorrect') {
    return result.value.questions.filter((q: any) => !q.is_correct)
  }
  if (filterReview.value === 'correct') {
    return result.value.questions.filter((q: any) => q.is_correct)
  }
  return result.value.questions
})

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

function handlePrint() {
  window.print()
}

function exportMarkdown() {
  if (!result.value) return
  let md = `# Resultados: ${result.value.title}\n\n`
  md += `- **Puntaje:** ${result.value.score_percent.toFixed(0)}% (${result.value.passed ? 'APROBADO' : 'REQUIERE REFUERZO'})\n`
  md += `- **Correctas:** ${result.value.correct_answers}\n`
  md += `- **Incorrectas:** ${result.value.incorrect_answers}\n`
  md += `- **Omitidas:** ${result.value.unanswered}\n\n`
  md += `## Preguntas y Respuestas\n\n`

  result.value.questions?.forEach((q: any, i: number) => {
    md += `### ${i + 1}. ${q.content?.question || 'Pregunta'}\n`
    md += `- **Estado:** ${q.is_correct ? '✅ Correcta' : '❌ Incorrecta'}\n`
    md += `- **Tu respuesta:** ${formatAnswer(q.user_answer, q) || 'Sin respuesta'}\n`
    if (!q.is_correct && q.content?.correct_answer) {
      md += `- **Respuesta correcta:** ${formatAnswer(q.content.correct_answer, q)}\n`
    }
    if (q.explanation) {
      md += `- **Explicación:** ${q.explanation}\n`
    }
    md += `\n`
  })

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `examen-${result.value.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-resultados.md`
  a.click()
  URL.revokeObjectURL(url)
  uiStore.showSuccess('Reporte descargado correctamente en Markdown')
}

function formatAnswer(ans: any, q: any) {
  if (ans == null) return ''
  if (Array.isArray(ans)) {
    if (ans.length > 0 && typeof ans[0] === 'number' && q.content?.options) {
      return ans.map((idx: number) => q.content.options[idx]).join(', ')
    }
    return ans.join(', ')
  }
  if (typeof ans === 'number' && q.content?.options) {
    return q.content.options[ans]
  }
  return String(ans)
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

@media print {
  .d-print-none {
    display: none !important;
  }
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .question-review-card {
    page-break-inside: avoid;
    border: 1px solid #ccc !important;
  }
}
</style>
