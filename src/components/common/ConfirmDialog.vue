<template>
  <v-dialog
    v-model="uiStore.confirmState.show"
    max-width="450"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl border pa-6 bg-surface-container-lowest" elevation="8">
      <div class="d-flex flex-column align-center text-center">
        <!-- Dynamic Header Icon Container with soft background color -->
        <div :class="iconBgClass" class="rounded-circle pa-4 mb-4 transition-all duration-300">
          <v-icon :icon="dialogIcon" :color="uiStore.confirmState.color" size="44"></v-icon>
        </div>

        <h3 class="text-h5 font-weight-bold text-on-surface mb-2">
          {{ uiStore.confirmState.title }}
        </h3>
        
        <p class="text-body-1 text-on-surface-variant line-height-relaxed mb-6 px-2">
          {{ uiStore.confirmState.message }}
        </p>

        <div class="d-flex w-100 ga-3 justify-center">
          <!-- Cancel Button (rendered only if cancelText is provided) -->
          <v-btn
            v-if="uiStore.confirmState.cancelText"
            variant="outlined"
            color="on-surface-variant"
            size="large"
            class="flex-grow-1 rounded-lg font-weight-bold text-button border-outline-variant"
            @click="uiStore.handleConfirm(false)"
          >
            {{ uiStore.confirmState.cancelText }}
          </v-btn>
          
          <!-- Confirm Button -->
          <v-btn
            :color="uiStore.confirmState.color"
            size="large"
            class="flex-grow-1 rounded-lg font-weight-bold text-button text-white"
            elevation="0"
            @click="uiStore.handleConfirm(true)"
          >
            {{ uiStore.confirmState.confirmText }}
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/store/uiStore'

const uiStore = useUiStore()

const dialogIcon = computed(() => {
  const color = uiStore.confirmState.color
  const title = uiStore.confirmState.title.toLowerCase()
  if (color === 'error' || color === 'red' || title.includes('eliminar') || title.includes('delete') || title.includes('borrar')) {
    return 'mdi-delete-empty-outline'
  }
  if (color === 'warning' || color === 'orange' || title.includes('alert') || title.includes('advertencia')) {
    return 'mdi-alert-circle-outline'
  }
  if (color === 'success' || color === 'green' || title.includes('exito') || title.includes('success')) {
    return 'mdi-check-circle-outline'
  }
  return 'mdi-help-circle-outline'
})

const iconBgClass = computed(() => {
  const color = uiStore.confirmState.color
  if (color === 'error' || color === 'red') return 'bg-error-container-light'
  if (color === 'warning' || color === 'orange') return 'bg-warning-container-light'
  if (color === 'success' || color === 'green') return 'bg-success-container-light'
  return 'bg-primary-container-light'
})
</script>

<style scoped>
.line-height-relaxed {
  line-height: 1.6;
}
.bg-error-container-light {
  background-color: rgba(var(--v-theme-error), 0.12) !important;
}
.bg-warning-container-light {
  background-color: rgba(var(--v-theme-warning), 0.12) !important;
}
.bg-success-container-light {
  background-color: rgba(var(--v-theme-success), 0.12) !important;
}
.bg-primary-container-light {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
}
.border-outline-variant {
  border-color: rgba(var(--v-theme-outline-variant), 0.6) !important;
}
</style>
