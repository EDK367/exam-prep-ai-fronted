<template>
  <v-footer class="border-t footer py-6" border-color="outline-variant" :class="isDark ? 'bg-surface-container-low' : 'bg-surface'">
    <v-container class="d-flex flex-column flex-md-row justify-space-between align-center ga-4 max-w-7xl mx-auto px-4 px-md-8">
      <div class="text-center text-md-start d-flex flex-column align-center align-md-start ga-1">
        <AppLogo to="/home" :size="36" :max-width="150" text-class="text-subtitle-1" />
        <p class="text-caption text-on-surface-variant opacity-80 mb-0">
          © {{ new Date().getFullYear() }} Exam Prep AI. Preparación inteligente para certificaciones y exámenes.
        </p>
      </div>

      <div class="d-flex flex-wrap justify-center ga-4">
        <v-btn variant="text" size="small" class="text-caption text-on-surface-variant footer-link" to="/home">Inicio</v-btn>
        <v-btn variant="text" size="small" class="text-caption text-on-surface-variant footer-link" to="/login">Acceso</v-btn>
        <v-btn variant="text" size="small" class="text-caption text-on-surface-variant footer-link" to="/register">Registro</v-btn>
      </div>

      <div class="d-flex align-center ga-2 text-caption text-on-surface-variant">
        <v-chip size="small" variant="tonal" color="primary" class="font-weight-medium">
          FastAPI + Supabase + RAG
        </v-chip>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import AppLogo from '@/components/common/AppLogo.vue'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
</script>

<style scoped>
.footer {
  transition: all 0.2s ease;
}

.footer-link {
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--v-theme-primary);
}

.max-w-7xl {
  max-width: 1280px;
}
</style>
