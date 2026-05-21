<template>
  <v-container class="max-w-7xl mx-auto px-4 px-md-8 py-12" fluid>
    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row align-md-end justify-space-between ga-6 mb-12">
      <div class="d-flex flex-column ga-1">
        <h1 class="text-h3 font-weight-bold text-on-surface">My Exams</h1>
        <p class="text-body-1 text-on-surface-variant max-w-2xl">
          Manage and access your personalized AI-generated exam materials and study guides.
        </p>
      </div>
      <v-btn color="primary" class="text-on-primary px-6" size="large" elevation="2" @click="createExamDialog = true">
        <v-icon icon="mdi-plus" class="mr-2"></v-icon>
        Create New Exam
      </v-btn>
    </div>

    <!-- Exam Grid -->
    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="exam in mappedExams" :key="exam.id">
        <ExamCard 
          v-bind="exam" 
          @click="$router.push(exam.progress === 100 ? `/dashboard/results/${exam.id}` : `/dashboard/exams/${exam.id}/session`)"
          @delete="handleDeleteExam"
          class="cursor-pointer"
        />
      </v-col>

      <!-- Empty State / Add New Placeholder -->
      <v-col cols="12" md="6" lg="4">
        <v-card 
          class="border-dashed border-2 bg-transparent rounded-lg pa-6 d-flex flex-column align-center justify-center ga-4 hover-bg transition-colors h-100 group cursor-pointer"
          elevation="0"
          @click="createExamDialog = true"
        >
          <div class="pa-6 bg-surface-container rounded-circle transition-transform group-hover-scale">
            <v-icon icon="mdi-plus-circle" color="primary" size="40"></v-icon>
          </div>
          <div class="text-center">
            <p class="text-h6 font-weight-bold text-on-surface-variant mb-1">Generate New</p>
            <p class="text-caption text-outline mb-0">Upload syllabus or notes</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
    
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

const mappedExams = computed(() => {
  return examStore.tests.map(test => {
    return {
      id: test.id,
      title: test.title,
      category: 'Exam',
      icon: 'mdi-file-document-edit-outline',
      date: new Date(test.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      progress: test.status === 'completed' ? 100 : (test.status === 'in_progress' ? 50 : 0)
    }
  })
})

onMounted(() => {
  examStore.fetchTests()
})

async function handleDeleteExam(id: string) {
  const confirmed = await uiStore.showConfirm({
    title: '¿Eliminar examen?',
    message: '¿Estás seguro de que quieres eliminar este examen? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    color: 'error'
  })
  if (confirmed) {
    await examStore.deleteTest(id)
  }
}
</script>

<style scoped>
.max-w-7xl {
  max-width: 1280px;
}
.border-dashed {
  border-style: dashed !important;
  border-color: rgb(var(--v-theme-outline-variant)) !important;
}
.hover-bg:hover {
  background-color: rgba(var(--v-theme-surface-container-low), 0.5) !important;
}
.transition-transform {
  transition: transform 0.3s ease;
}
.group:hover .group-hover-scale {
  transform: scale(1.1);
}
.max-w-2xl {
  max-width: 42rem;
}
</style>
