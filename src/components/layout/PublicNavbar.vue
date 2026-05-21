<template>
  <v-app-bar flat class="border-b app-bar" border-color="outline-variant" :color="isDark ? 'surface-container-high' : 'surface'">
    <v-container class="d-flex align-center justify-space-between px-4 px-md-8 max-w-7xl mx-auto" fluid>
      <div class="d-flex align-center ga-8">
        <AppLogo to="/home" :size="52" :max-width="200" text-class="text-h6" link-class="logo-link" />

        <div class="d-none d-md-flex ga-4">
          <v-btn variant="text" class="text-body-1 text-on-surface-variant text-primary nav-item" rounded="0">
            Features
            <v-divider class="nav-underline"></v-divider>
          </v-btn>
          <v-btn variant="text" class="text-body-1 text-on-surface-variant text-primary nav-item" rounded="0">
            Library
            <v-divider class="nav-underline"></v-divider>
          </v-btn>
          <v-btn variant="text" class="text-body-1 text-on-surface-variant text-primary nav-item" rounded="0">
            Resources
            <v-divider class="nav-underline"></v-divider>
          </v-btn>
        </div>
      </div>

      <div class="d-flex align-center ga-3">
        <v-btn icon variant="text" size="small" @click="toggleTheme" class="theme-btn">
          <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>

        <div class="d-none d-sm-flex ga-3">
          <v-btn variant="text" class="text-button" @click="login">Login</v-btn>
          <v-btn variant="flat" color="primary-container" class="text-on-primary-container rounded-lg" @click="register">
            Registrarse
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import AppLogo from '@/components/common/AppLogo.vue'

const theme = useTheme()
const router = useRouter()
const isDark = computed(() => theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

function login() {
  router.push('/login')
}

function register() {
  router.push('/register')
}
</script>

<style scoped>
.app-bar {
  transition: all 0.3s ease;
}

:deep(.logo-link span) {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-primary-container)));
  -webkit-background-clip: text;
  background-clip: text;
}

.nav-item {
  position: relative;
  transition: all 0.3s ease;
}

.nav-item:hover {
  transform: translateY(-2px);
}

.nav-underline {
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 0;
  transition: all 0.3s ease;
  border-width: 2px !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  opacity: 1 !important;
}

.nav-item:hover .nav-underline {
  width: 80%;
  left: 10%;
}

.theme-btn {
  transition: transform 0.3s ease;
}

.theme-btn:hover {
  transform: rotate(15deg);
}

.max-w-7xl {
  max-width: 1280px;
}
</style>
