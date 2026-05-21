<template>
  <v-dialog
    :model-value="modelValue"
    max-width="960"
    scrollable
    transition="dialog-bottom-transition"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="rounded-xl bg-surface-container-lowest" elevation="8">
      <v-toolbar density="comfortable" class="border-b" border-color="outline-variant">
        <v-toolbar-title class="text-body-1 font-weight-bold text-truncate">
          {{ filename }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon variant="text" @click="close">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>

      <div class="pdf-viewer-area position-relative">
        <div v-if="loading" class="d-flex align-center justify-center py-16">
          <v-progress-circular indeterminate color="primary" size="48" />
        </div>
        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          class="ma-4 rounded-lg"
        >
          {{ error }}
        </v-alert>
        <iframe
          v-else-if="pdfUrl"
          :src="pdfUrl"
          :title="filename"
          class="pdf-iframe"
        />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { documentService } from '@/services/documentService'

const props = defineProps<{
  modelValue: boolean
  documentId: string | null
  filename: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const loading = ref(false)
const error = ref('')
const pdfUrl = ref<string | null>(null)

function revokeUrl() {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value)
    pdfUrl.value = null
  }
}

function close() {
  emit('update:modelValue', false)
}

async function loadPdf() {
  if (!props.documentId) return
  revokeUrl()
  loading.value = true
  error.value = ''
  try {
    const { data } = await documentService.getFile(props.documentId)
    pdfUrl.value = URL.createObjectURL(
      data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' }),
    )
  } catch {
    error.value = 'No se pudo cargar el PDF. Intenta de nuevo más tarde.'
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.modelValue, props.documentId] as const,
  ([open, id]) => {
    if (open && id) {
      loadPdf()
    } else if (!open) {
      revokeUrl()
      error.value = ''
    }
  },
)

onBeforeUnmount(revokeUrl)
</script>

<style scoped>
.pdf-viewer-area {
  min-height: 70vh;
  max-height: 80vh;
}

.pdf-iframe {
  width: 100%;
  height: 75vh;
  border: none;
  display: block;
}
</style>
