<template>
  <v-dialog v-model="visible" max-width="820" scrollable transition="dialog-bottom-transition">
    <v-card class="rounded-2xl bg-surface" elevation="8">
      <!-- Toolbar Header -->
      <v-toolbar color="transparent" class="px-4 border-b" density="comfortable">
        <div class="d-flex align-center ga-2 min-w-0">
          <div class="bg-primary-container pa-2 rounded-lg text-on-primary-container">
            <v-icon icon="mdi-text-box-search-outline" size="20"></v-icon>
          </div>
          <div class="min-w-0">
            <h3 class="text-subtitle-1 font-weight-bold mb-0 text-truncate">Resumen Ejecutivo & Conceptos Clave</h3>
            <p class="text-caption text-on-surface-variant mb-0 text-truncate">{{ filename }}</p>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn 
          v-if="summary" 
          icon="mdi-content-copy" 
          variant="text" 
          size="small" 
          title="Copiar texto"
          @click="copySummary"
          class="mr-1"
        ></v-btn>
        <v-btn 
          v-if="summary" 
          icon="mdi-printer" 
          variant="text" 
          size="small" 
          title="Imprimir resumen"
          @click="printSummary"
          class="mr-1"
        ></v-btn>
        <v-btn icon="mdi-close" variant="text" size="small" @click="visible = false"></v-btn>
      </v-toolbar>

      <v-card-text class="pa-6" style="max-height: 70vh;">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="56" width="4" class="mb-4"></v-progress-circular>
          <h4 class="text-subtitle-2 font-weight-bold">Analizando documento con IA...</h4>
          <p class="text-caption text-on-surface-variant">Sintetizando ideas principales y glosario técnico</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <v-icon icon="mdi-alert-circle-outline" color="error" size="48" class="mb-3"></v-icon>
          <p class="text-body-2 text-error mb-4">{{ error }}</p>
          <v-btn color="primary" variant="outlined" size="small" @click="loadSummary">Reintentar</v-btn>
        </div>

        <!-- Content State -->
        <div v-else-if="summary" class="d-flex flex-column ga-6 print-content">
          <!-- Overview Box -->
          <v-card class="bg-surface-container-low rounded-xl pa-5 border" elevation="0">
            <div class="d-flex align-center ga-2 mb-2 text-primary">
              <v-icon icon="mdi-lightbulb-on-outline" size="18"></v-icon>
              <h4 class="text-subtitle-2 font-weight-bold text-uppercase letter-spacing-wide">Sinopsis General</h4>
            </div>
            <p class="text-body-1 line-height-relaxed text-on-surface mb-0">
              {{ summary.summary }}
            </p>
          </v-card>

          <!-- Key Points -->
          <div v-if="summary.key_points && summary.key_points.length > 0">
            <h4 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center ga-2">
              <v-icon icon="mdi-check-decagram-outline" color="primary" size="20"></v-icon>
              Puntos Clave a Recordar
            </h4>
            <v-card class="rounded-xl border pa-4 bg-surface-container-lowest" elevation="0">
              <v-list density="compact" class="bg-transparent pa-0">
                <v-list-item 
                  v-for="(point, idx) in summary.key_points" 
                  :key="idx"
                  class="px-2 py-1 align-start"
                >
                  <template v-slot:prepend>
                    <v-badge dot color="primary" inline class="mr-3 mt-1"></v-badge>
                  </template>
                  <v-list-item-title class="text-body-2 text-wrap font-weight-regular line-height-relaxed">
                    {{ point }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </div>

          <!-- Concepts / Glossary -->
          <div v-if="summary.concepts && summary.concepts.length > 0">
            <h4 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center ga-2">
              <v-icon icon="mdi-book-open-page-variant-outline" color="primary" size="20"></v-icon>
              Conceptos y Definiciones
            </h4>
            <v-row>
              <v-col cols="12" sm="6" v-for="(item, idx) in summary.concepts" :key="idx">
                <v-card class="bg-surface-container-lowest border rounded-xl pa-4 h-100" elevation="0">
                  <h5 class="text-subtitle-2 font-weight-bold text-primary mb-1">{{ item.term }}</h5>
                  <p class="text-caption text-on-surface-variant mb-0 line-height-relaxed">{{ item.definition }}</p>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Conclusion -->
          <div v-if="summary.conclusion">
            <h4 class="text-subtitle-2 font-weight-bold text-on-surface-variant mb-2">Conclusión del Material</h4>
            <p class="text-body-2 text-on-surface-variant font-italic border-s-4 pl-3 py-1 mb-0 border-primary">
              "{{ summary.conclusion }}"
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { examService } from '@/services/examService'
import { useUiStore } from '@/store/uiStore'
import type { Summary } from '@/types/exam.types'

const props = defineProps<{
  modelValue: boolean
  documentId: string
  filename: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const uiStore = useUiStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const loading = ref(false)
const error = ref('')
const summary = ref<Summary | null>(null)

watch(visible, (newVal) => {
  if (newVal && props.documentId && !summary.value) {
    loadSummary()
  }
})

async function loadSummary() {
  if (!props.documentId) return
  loading.value = true
  error.value = ''
  try {
    const res = await examService.generateSummary(props.documentId)
    if (res.data?.success && res.data.data) {
      summary.value = res.data.data
    } else {
      error.value = 'No se pudo generar el resumen de este documento.'
    }
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Error al conectar con el servicio de IA.'
  } finally {
    loading.value = false
  }
}

async function copySummary() {
  if (!summary.value) return
  const text = `RESUMEN: ${summary.value.title || props.filename}\n\n${summary.value.summary}\n\nPUNTOS CLAVE:\n${summary.value.key_points?.map(p => `• ${p}`).join('\n')}\n\nCONCLUSIÓN:\n${summary.value.conclusion}`
  try {
    await navigator.clipboard.writeText(text)
    uiStore.showSuccess('Resumen copiado al portapapeles')
  } catch {
    uiStore.showError('No se pudo copiar automáticamente')
  }
}

function printSummary() {
  window.print()
}
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .print-content, .print-content * {
    visibility: visible;
  }
  .print-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>

