<template>
  <v-app-bar flat class="border-b" border-color="outline-variant" :color="isDark ? 'surface-container-high' : 'surface'">
    <v-container class="d-flex align-center justify-space-between px-4 px-md-8" fluid>
      <div class="d-flex align-center ga-4 ga-md-8">
        <div class="d-flex align-center ga-4">
          <AppLogo to="/dashboard" :size="56" :max-width="220" text-class="text-h5" />
          <router-link
            :to="ROUTES.PROFILE"
            class="text-body-1 font-weight-bold text-decoration-none transition-colors duration-200"
            :class="isActive(ROUTES.PROFILE) ? (isDark ? 'text-primary-container border-b-2' : 'text-primary border-b-2 border-primary') : (isDark ? 'text-on-surface-variant hover:text-primary-container' : 'text-on-surface-variant hover:text-primary')"
          >
            Profile
          </router-link>
        </div>

        <div class="d-none d-md-flex align-center ga-6">
          <router-link 
            to="/dashboard/files" 
            class="text-body-1 font-weight-bold text-decoration-none transition-colors duration-200"
            :class="isActive('/dashboard/files') ? (isDark ? 'text-primary-container border-b-2' : 'text-primary border-b-2 border-primary') : (isDark ? 'text-on-surface-variant hover:text-primary-container' : 'text-on-surface-variant hover:text-primary')"
          >
            Files
          </router-link>
          <router-link 
            to="/dashboard/exams" 
            class="text-body-1 font-weight-bold text-decoration-none transition-colors duration-200"
            :class="isActive('/dashboard/exams') ? (isDark ? 'text-primary-container border-b-2' : 'text-primary border-b-2 border-primary') : (isDark ? 'text-on-surface-variant hover:text-primary-container' : 'text-on-surface-variant hover:text-primary')"
          >
            Exams
          </router-link>
        </div>
      </div>

      <div class="d-flex align-center ga-4">
        <v-btn color="primary-container" class="text-on-primary-container rounded-lg px-4 d-none d-sm-flex" elevation="0" to="/dashboard/exams">
          <v-icon icon="mdi-plus" class="mr-1"></v-icon>
          Create Exam
        </v-btn>

        <v-menu location="bottom end" offset="8">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="ml-2" variant="text">
              <v-avatar size="40" class="border-md border-primary-fixed hover:border-primary transition-colors bg-primary-container text-on-primary-container font-weight-bold text-h6">
                <v-img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url" alt="Profile"></v-img>
                <span v-else>{{ userInitials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-list class="bg-surface-container-lowest border border-outline-variant rounded-xl mt-2" elevation="4">
            <v-list-item>
              <v-list-item-title class="text-subtitle-2 font-weight-bold">{{ authStore.fullName }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ authStore.user?.email }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item link :to="ROUTES.PROFILE" class="hover:bg-surface-container transition-colors">
              <template v-slot:prepend>
                <v-icon icon="mdi-account-circle" class="mr-2"></v-icon>
              </template>
              <v-list-item-title class="text-label-sm font-weight-medium">Mi perfil</v-list-item-title>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item link @click="handleLogout" class="hover:bg-error-container text-error transition-colors">
              <template v-slot:prepend>
                <v-icon icon="mdi-logout" class="mr-2" color="error"></v-icon>
              </template>
              <v-list-item-title class="text-label-sm font-weight-medium text-error">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn icon variant="text" size="small" @click="toggleTheme" class="text-on-surface-variant ml-2">
          <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </div>
    </v-container>

    <v-snackbar
      v-for="(notification, index) in uiStore.notifications"
      :key="notification.id"
      :model-value="true"
      :color="notification.type"
      location="top right"
      :style="{ marginTop: `${index * 60}px` }"
      timeout="-1"
    >
      {{ notification.message }}
      <template v-slot:actions>
        <v-btn icon="mdi-close" variant="text" @click="uiStore.removeNotification(notification.id)"></v-btn>
      </template>
    </v-snackbar>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import { ROUTES } from '@/utils/constants'
import AppLogo from '@/components/common/AppLogo.vue'

const theme = useTheme()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const isDark = computed(() => theme.global.name.value === 'dark')

const userInitials = computed(() => {
  if (!authStore.user) return '?'
  const name = authStore.user.name || ''
  const lastName = authStore.user.last_names || ''
  if (name && lastName) return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  if (name) return name.substring(0, 2).toUpperCase()
  if (authStore.user.email) return authStore.user.email.substring(0, 2).toUpperCase()
  return 'U'
})

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

function isActive(path: string) {
  return route.path.startsWith(path)
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
