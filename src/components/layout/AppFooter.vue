<template>
  <v-footer 
    v-if="!isExamSession"
    class="border-t py-2 px-4 px-md-8 app-footer" 
    border-color="outline-variant" 
    :class="isDark ? 'bg-surface-container-low text-on-surface' : 'bg-surface text-on-surface'"
    elevation="0"
  >
    <v-container class="d-flex flex-column flex-sm-row justify-space-between align-center ga-2 max-w-7xl mx-auto pa-0" fluid>
      <!-- Left: Brand & Copyright -->
      <div class="d-flex align-center ga-2 text-caption text-on-surface-variant">
        <v-img
          src="/logo-exam.png"
          height="22"
          width="22"
          alt="Exam Prep AI"
          class="flex-shrink-0"
          contain
        />
        <span class="font-weight-bold text-on-surface">Exam Prep AI</span>
        <span class="opacity-40">•</span>
        <span>© {{ new Date().getFullYear() }}</span>
        <v-chip size="x-small" variant="flat" color="surface-container-high" class="text-caption font-weight-medium px-2 py-0 ml-1">
          v1.0.0
        </v-chip>
      </div>

      <!-- Center: Operational Status (Accessible) -->
      <div class="d-none d-md-flex align-center ga-2 text-caption text-on-surface-variant" role="status" aria-live="polite">
        <span class="status-dot"></span>
        <span class="text-caption">Sistema Operativo • IA Conectada</span>
      </div>

      <!-- Right: Discreet Links -->
      <div class="d-flex align-center ga-4 text-caption">
        <router-link to="/home" class="footer-link text-on-surface-variant">Inicio</router-link>
        <span class="opacity-30">•</span>
        <a href="#features" class="footer-link text-on-surface-variant">Características</a>
        <span class="opacity-30">•</span>
        <span class="footer-link text-on-surface-variant cursor-pointer" @click="showShortcuts = true">
          <v-icon icon="mdi-keyboard-outline" size="14" class="mr-1"></v-icon>Atajos
        </span>
      </div>
    </v-container>

    <!-- Keyboard Shortcuts Dialog -->
    <v-dialog v-model="showShortcuts" max-width="460">
      <v-card class="rounded-xl pa-5 bg-surface" elevation="6">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center ga-2">
            <v-icon icon="mdi-keyboard" color="primary"></v-icon>
            <h3 class="text-subtitle-1 font-weight-bold">Atajos de teclado</h3>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="showShortcuts = false"></v-btn>
        </div>
        <v-list density="compact" class="bg-transparent pa-0">
          <v-list-item class="px-0 py-1">
            <template v-slot:prepend><v-kbd class="mr-3 font-weight-bold">Ctrl / Cmd + K</v-kbd></template>
            <v-list-item-title class="text-body-2">Búsqueda rápida</v-list-item-title>
          </v-list-item>
          <v-list-item class="px-0 py-1">
            <template v-slot:prepend><v-kbd class="mr-3 font-weight-bold">1 - 4</v-kbd></template>
            <v-list-item-title class="text-body-2">Seleccionar opción en examen</v-list-item-title>
          </v-list-item>
          <v-list-item class="px-0 py-1">
            <template v-slot:prepend><v-kbd class="mr-3 font-weight-bold">Flechas ← / →</v-kbd></template>
            <v-list-item-title class="text-body-2">Navegar entre preguntas / flashcards</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'

const theme = useTheme()
const route = useRoute()
const showShortcuts = ref(false)

const isDark = computed(() => theme.global.name.value === 'dark')
const isExamSession = computed(() => route.name === 'ExamSession')
</script>

<style scoped>
.app-footer {
  transition: all 0.2s ease;
  min-height: 44px;
}

.max-w-7xl {
  max-width: 1280px;
}

.footer-link {
  text-decoration: none;
  font-size: 0.8125rem;
  transition: color 0.15s ease, opacity 0.15s ease;
  opacity: 0.8;
}

.footer-link:hover {
  opacity: 1;
  color: var(--v-theme-primary);
  text-decoration: underline;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
  display: inline-block;
  animation: pulse-dot 2.5s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}
</style>
