<template>
  <v-container class="max-w-7xl mx-auto px-4 px-md-8 py-8" fluid>
    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4 mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold text-on-surface mb-1">Mis Exámenes</h1>
        <p class="text-body-2 text-on-surface-variant mb-0">
          Evaluaciones dinámicas, cuestionarios interactivos y simulaciones de examen generadas por IA.
        </p>
      </div>
      <v-btn 
        color="primary" 
        class="text-on-primary px-5 rounded-lg font-weight-bold" 
        size="default" 
        elevation="1" 
        @click="createExamDialog = true"
      >
        <v-icon icon="mdi-plus" class="mr-1"></v-icon>
        Nuevo Examen
      </v-btn>
    </div>

    <!-- Search & Filter Controls -->
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3 mb-6">
      <div class="flex-grow-1" style="max-width: 420px;">
        <v-text-field
          v-model="searchQuery"
          placeholder="Buscar examen por título..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          bg-color="surface"
          clearable
          hide-details
          class="rounded-lg"
        ></v-text-field>
      </div>

      <div class="d-flex align-center ga-2 flex-wrap">
        <v-chip-group v-model="selectedStatus" mandatory color="primary">
          <v-chip value="all" filter size="small" variant="tonal" class="font-weight-medium">
            Todos ({{ examStore.tests.length }})
          </v-chip>
          <v-chip value="completed" filter size="small" variant="tonal" class="font-weight-medium">
            Completados ({{ countByStatus('completed') }})
          </v-chip>
          <v-chip value="in_progress" filter size="small" variant="tonal" class="font-weight-medium">
            En Progreso ({{ countByStatus('in_progress') }})
          </v-chip>
          <v-chip value="pending" filter size="small" variant="tonal" class="font-weight-medium">
            Pendientes ({{ countByStatus('pending') }})
          </v-chip>
        </v-chip-group>
      </div>
    </div>

    <!-- Skeleton Loading -->
    <v-row v-if="examStore.loading">
      <v-col cols="12" md="6" lg="4" v-for="n in 6" :key="n">
        <v-card class="rounded-xl pa-5 border bg-surface-container-lowest" elevation="0">
          <v-skeleton-loader type="article, actions"></v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>

    <!-- Exam Grid -->
    <v-row v-else-if="filteredExams.length > 0">
      <v-col cols="12" md="6" lg="4" v-for="exam in filteredExams" :key="exam.id">
        <ExamCard 
          v-bind="exam" 
          @click="navigateToExam(exam)"
          @delete="handleDeleteExam"
          class="cursor-pointer"
        />
      </v-col>

      <!-- New Exam Placeholder Card -->
      <v-col cols="12" md="6" lg="4">
        <v-card 
          class="border-dashed border-2 bg-surface-container-low rounded-xl pa-6 d-flex flex-column align-center justify-center ga-3 hover-bg transition-all h-100 min-h-240 group cursor-pointer"
          elevation="0"
          @click="createExamDialog = true"
        >
          <div class="pa-4 bg-surface-container-highest rounded-circle transition-transform group-hover-scale">
            <v-icon icon="mdi-plus" color="primary" size="32"></v-icon>
          </div>
          <div class="text-center">
            <h4 class="text-body-1 font-weight-bold text-on-surface mb-1">Crear Nueva Evaluación</h4>
            <p class="text-caption text-on-surface-variant mb-0">Selecciona o sube un documento</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-surface-container-lowest rounded-xl border pa-8">
      <v-icon icon="mdi-school-outline" size="52" color="on-surface-variant" class="mb-3 opacity-60"></v-icon>
      <h3 class="text-subtitle-1 font-weight-bold mb-1">No se encontraron exámenes</h3>
      <p class="text-caption text-on-surface-variant mb-4" v-if="searchQuery">
        Ningún examen coincide con "{{ searchQuery }}"
      </p>
      <p class="text-caption text-on-surface-variant mb-4" v-else>
        Todavía no has generado ningún examen. ¡Crea el primero a partir de tus notas o PDFs!
      </p>
      <v-btn color="primary" size="small" class="rounded-lg px-4" @click="createExamDialog = true">
        Crear Examen
      </v-btn>
    </div>
    
    <CreateExamDialog v-model="createExamDialog" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExamCard from '@/components/exams/ExamCard.vue'
import CreateExamDialog from '@/components/exams/CreateExamDialog.vue'
import { useExamStore } from '@/store/examStore'
import { useUiStore } from '@/store/uiStore'

const router = useRouter()
const examStore = useExamStore()
const uiStore = useUiStore()

const createExamDialog = ref(false)
const searchQuery = ref('')
const selectedStatus = ref<'all' | 'completed' | 'in_progress' | 'pending'>('all')

function countByStatus(status: string) {
  return examStore.tests.filter(t => t.status === status).length
}

const mappedExams = computed(() => {
  return examStore.tests.map(test => {
    return {
      id: test.id,
      title: test.title,
      category: 'Examen IA',
      icon: 'mdi-file-document-edit-outline',
      rawStatus: test.status,
      date: new Date(test.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      progress: test.status === 'completed' ? 100 : (test.status === 'in_progress' ? 50 : 0)
    }
  })
})

const filteredExams = computed(() => {
  return mappedExams.value.filter(exam => {
    // Text search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!exam.title.toLowerCase().includes(q)) return false
    }
    // Status filter
    if (selectedStatus.value !== 'all') {
      if (exam.rawStatus !== selectedStatus.value) return false
    }
    return true
  })
})

function navigateToExam(exam: any) {
  if (exam.progress === 100) {
    router.push(`/dashboard/results/${exam.id}`)
  } else {
    router.push(`/dashboard/exams/${exam.id}`)
  }
}

async function handleDeleteExam(id: string) {
  const confirmed = await uiStore.showConfirm({
    title: '¿Eliminar examen?',
    message: 'Esta acción no se puede deshacer. Se borrarán todas las preguntas y respuestas registradas.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    color: 'error'
  })

  if (confirmed) {
    try {
      await examStore.deleteTest(id)
      uiStore.showSuccess('Examen eliminado correctamente')
    } catch {
      uiStore.showError('No se pudo eliminar el examen')
    }
  }
}

onMounted(() => {
  examStore.fetchTests()
})
</script>

<style scoped>
.max-w-7xl {
  max-width: 1280px;
}

.min-h-240 {
  min-height: 240px;
}

.border-dashed {
  border-style: dashed !important;
}

.group:hover .group-hover-scale {
  transform: scale(1.15);
}
</style>
