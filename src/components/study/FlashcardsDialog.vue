<template>
  <v-dialog v-model="visible" max-width="640" transition="dialog-bottom-transition">
    <v-card class="rounded-2xl bg-surface pa-6" elevation="8">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-4 pb-3 border-b">
        <div class="d-flex align-center ga-2 min-w-0">
          <div class="bg-primary-container pa-2 rounded-lg text-on-primary-container">
            <v-icon icon="mdi-cards-outline" size="22"></v-icon>
          </div>
          <div class="min-w-0">
            <h3 class="text-subtitle-1 font-weight-bold mb-0 text-truncate">Tarjetas de Estudio IA</h3>
            <p class="text-caption text-on-surface-variant mb-0 text-truncate">{{ filename }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="visible = false" aria-label="Cerrar"></v-btn>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="56" width="4" class="mb-4"></v-progress-circular>
        <h4 class="text-subtitle-2 font-weight-bold">Generando flashcards con IA...</h4>
        <p class="text-caption text-on-surface-variant">Extrayendo conceptos clave de tu documento</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <v-icon icon="mdi-alert-circle-outline" color="error" size="48" class="mb-3"></v-icon>
        <p class="text-body-2 text-error mb-4">{{ error }}</p>
        <v-btn color="primary" variant="outlined" size="small" @click="loadFlashcards">Reintentar</v-btn>
      </div>

      <!-- Flashcards Content -->
      <div v-else-if="flashcards.length > 0" class="d-flex flex-column align-center">
        <!-- Progress and Actions -->
        <div class="w-100 d-flex align-center justify-space-between mb-3 text-caption text-on-surface-variant">
          <span class="font-weight-bold text-primary">Tarjeta {{ currentIndex + 1 }} de {{ flashcards.length }}</span>
          <div class="d-flex align-center ga-2">
            <v-btn 
              variant="text" 
              size="x-small" 
              prepend-icon="mdi-shuffle-variant" 
              @click="shuffleCards"
              class="text-caption"
            >
              Mezclar
            </v-btn>
          </div>
        </div>

        <v-progress-linear
          :model-value="((currentIndex + 1) / flashcards.length) * 100"
          color="primary"
          bg-color="surface-container-highest"
          height="6"
          rounded
          class="mb-6 w-100"
        ></v-progress-linear>

        <!-- 3D Flippable Card -->
        <div class="card-scene w-100 mb-6" @click="isFlipped = !isFlipped">
          <div class="card-object rounded-xl pa-8 cursor-pointer border" :class="{ 'is-flipped': isFlipped }">
            <!-- Front Face: Question / Concept -->
            <div class="card-face card-front bg-surface-container-lowest d-flex flex-column justify-space-between align-center text-center">
              <v-chip size="x-small" color="primary" variant="tonal" class="mb-3 text-uppercase font-weight-bold">
                {{ currentCard?.category || 'Pregunta / Concepto' }}
              </v-chip>
              <p class="text-h6 font-weight-medium my-auto line-height-relaxed px-4">
                {{ currentCard?.front }}
              </p>
              <span class="text-caption text-on-surface-variant opacity-60 mt-3 d-flex align-center ga-1">
                <v-icon icon="mdi-gesture-tap" size="14"></v-icon> Toca la tarjeta para ver la respuesta
              </span>
            </div>

            <!-- Back Face: Answer / Definition -->
            <div class="card-face card-back bg-primary-container text-on-primary-container d-flex flex-column justify-space-between align-center text-center">
              <v-chip size="x-small" color="on-primary-container" variant="outlined" class="mb-3 text-uppercase font-weight-bold">
                Respuesta
              </v-chip>
              <p class="text-body-1 font-weight-medium my-auto line-height-relaxed px-4">
                {{ currentCard?.back }}
              </p>
              <span class="text-caption opacity-70 mt-3 d-flex align-center ga-1">
                <v-icon icon="mdi-gesture-tap" size="14"></v-icon> Toca para volver a la pregunta
              </span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="d-flex align-center justify-space-between w-100 ga-3">
          <v-btn
            variant="outlined"
            size="small"
            prepend-icon="mdi-arrow-left"
            :disabled="currentIndex === 0"
            @click="prevCard"
            class="rounded-lg font-weight-bold"
          >
            Anterior
          </v-btn>

          <v-btn
            color="primary"
            variant="text"
            size="small"
            prepend-icon="mdi-flip-horizontal"
            @click="isFlipped = !isFlipped"
            class="font-weight-bold"
          >
            Voltear
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            size="small"
            append-icon="mdi-arrow-right"
            :disabled="currentIndex === flashcards.length - 1"
            @click="nextCard"
            class="rounded-lg font-weight-bold"
          >
            Siguiente
          </v-btn>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8 text-on-surface-variant">
        No se encontraron tarjetas para este documento.
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { examService } from '@/services/examService'
import type { Flashcard } from '@/types/exam.types'

const props = defineProps<{
  modelValue: boolean
  documentId: string
  filename: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const loading = ref(false)
const error = ref('')
const flashcards = ref<Flashcard[]>([])
const currentIndex = ref(0)
const isFlipped = ref(false)

const currentCard = computed(() => flashcards.value[currentIndex.value] || null)

watch(visible, (newVal) => {
  if (newVal && props.documentId && flashcards.value.length === 0) {
    loadFlashcards()
  }
})

async function loadFlashcards() {
  if (!props.documentId) return
  loading.value = true
  error.value = ''
  try {
    const res = await examService.generateFlashcards(props.documentId, 12)
    if (res.data?.success && res.data.data?.flashcards) {
      flashcards.value = res.data.data.flashcards
      currentIndex.value = 0
      isFlipped.value = false
    } else {
      error.value = 'No se pudieron generar las tarjetas de este documento.'
    }
  } catch (err: any) {
    error.value = err?.response?.data?.detail || 'Error al conectar con el servicio de IA.'
  } finally {
    loading.value = false
  }
}

function nextCard() {
  if (currentIndex.value < flashcards.value.length - 1) {
    isFlipped.value = false
    currentIndex.value++
  }
}

function prevCard() {
  if (currentIndex.value > 0) {
    isFlipped.value = false
    currentIndex.value--
  }
}

function shuffleCards() {
  isFlipped.value = false
  flashcards.value = [...flashcards.value].sort(() => Math.random() - 0.5)
  currentIndex.value = 0
}
</script>

<style scoped>
.card-scene {
  perspective: 1000px;
  min-height: 260px;
}

.card-object {
  width: 100%;
  height: 260px;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-object.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 1rem;
  padding: 1.5rem;
}

.card-back {
  transform: rotateY(180deg);
}
</style>
