<template>
  <v-card 
    class="bg-surface-container-lowest rounded-lg pa-6 hover-shadow d-flex flex-column justify-space-between h-100 group position-relative overflow-hidden" 
    border 
    elevation="0"
    :class="{'border-l-4 border-l-primary-container': premium}"
  >
    <div v-if="backgroundIcon" class="position-absolute right-0 top-0 pa-6 opacity-10">
      <v-icon :icon="backgroundIcon" size="80" color="on-surface"></v-icon>
    </div>

    <div>
      <div class="d-flex justify-space-between align-start mb-4">
        <div class="pa-2 bg-primary-container bg-opacity-10 rounded-lg d-flex align-center justify-center">
          <v-icon :icon="icon" color="primary"></v-icon>
        </div>
        <div class="d-flex align-center ga-2">
          <v-chip color="secondary-container" class="text-on-secondary-container font-weight-medium" size="small" variant="flat">
            {{ category }}
          </v-chip>
          <v-btn icon="mdi-delete" variant="text" size="small" color="error" class="position-relative z-10" @click.stop="$emit('delete', id)"></v-btn>
        </div>
      </div>
      
      <h3 class="text-h6 font-weight-bold mb-1 text-on-surface position-relative z-10">{{ title }}</h3>
      <p class="text-caption text-on-surface-variant d-flex align-center ga-1 mb-6 position-relative z-10">
        <v-icon icon="mdi-calendar-today" size="small"></v-icon>
        {{ date }}
      </p>
    </div>

    <div class="d-flex flex-column ga-2 position-relative z-10">
      <v-progress-linear
        :model-value="progress"
        color="primary-container"
        bg-color="surface-container-highest"
        height="4"
        rounded
      ></v-progress-linear>
      
      <div class="d-flex justify-space-between align-center mb-4">
        <span class="text-caption text-on-surface-variant">Progress</span>
        <span class="text-caption text-primary font-weight-bold">{{ progress === 100 ? 'Completed' : `${progress}%` }}</span>
      </div>

      <v-btn color="primary-container" class="text-on-primary-container w-100 font-weight-bold text-button" rounded="lg" elevation="0">
        Open Exam
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  title: string;
  category: string;
  icon: string;
  date: string;
  progress: number;
  premium?: boolean;
  backgroundIcon?: string;
}>()
</script>

<style scoped>
.hover-shadow {
  transition: all 0.3s ease;
}
.hover-shadow:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  transform: translateY(-2px);
}
.bg-opacity-10 {
  background-color: rgba(var(--v-theme-primary-container), 0.1) !important;
}
.z-10 {
  z-index: 10;
}
.border-l-4 {
  border-left-width: 4px !important;
  border-left-style: solid !important;
}
.border-l-primary-container {
  border-left-color: rgb(var(--v-theme-primary-container)) !important;
}
</style>
