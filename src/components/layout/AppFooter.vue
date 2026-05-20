<template>
  <v-footer class="border-t py-6" border-color="outline-variant" :class="isDark ? 'bg-inverse-surface' : 'bg-surface-container-low'">
    <v-container class="d-flex flex-column flex-md-row justify-space-between align-center ga-4 px-4 px-md-8 max-w-7xl mx-auto">
      <div class="d-flex flex-column align-center align-md-start ga-2">
        <span class="text-h5 font-weight-bold" :class="isDark ? 'text-primary-container' : 'text-primary'">
          EXAM PREP AI
        </span>
        <p class="text-label-sm text-on-surface-variant opacity-80 mb-0">
          © 2024 Exam Prep AI. All rights reserved.
        </p>
      </div>

      <div class="d-flex flex-wrap justify-center ga-6">
        <router-link to="/about" class="text-decoration-none">
          <span class="text-label-sm text-on-surface-variant text-decoration-underline opacity-80 transition-opacity hover:opacity-100">About</span>
        </router-link>
        <router-link to="/contact" class="text-decoration-none">
          <span class="text-label-sm text-on-surface-variant text-decoration-underline opacity-80 transition-opacity hover:opacity-100">Contact</span>
        </router-link>
        <router-link to="/privacy" class="text-decoration-none">
          <span class="text-label-sm text-on-surface-variant text-decoration-underline opacity-80 transition-opacity hover:opacity-100">Privacy Policy</span>
        </router-link>
        <router-link to="/terms" class="text-decoration-none">
          <span class="text-label-sm text-on-surface-variant text-decoration-underline opacity-80 transition-opacity hover:opacity-100">Terms of Service</span>
        </router-link>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
</script>
