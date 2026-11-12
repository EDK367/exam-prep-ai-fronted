<template>
  <div>
    <v-app-bar flat class="border-b" border-color="outline-variant" :color="isDark ? 'surface-container-high' : 'surface'" height="64">
      <v-container class="d-flex align-center justify-space-between px-3 px-md-8" fluid>
        
        <!-- Left: Hamburger (Mobile) + Logo + Nav Links (Desktop) -->
        <div class="d-flex align-center ga-2 ga-md-6">
          <!-- Mobile Menu Button -->
          <v-btn 
            icon="mdi-menu" 
            variant="text" 
            class="d-md-none mr-1" 
            aria-label="Abrir menú de navegación"
            @click="drawer = !drawer"
          ></v-btn>

          <AppLogo to="/dashboard" :size="42" :max-width="170" text-class="text-subtitle-1 font-weight-bold" />

          <!-- Desktop Navigation -->
          <nav class="d-none d-md-flex align-center ga-1 ml-4" aria-label="Navegación principal">
            <v-btn 
              variant="text" 
              size="small" 
              to="/dashboard"
              :class="route.path === '/dashboard' ? 'text-primary font-weight-bold' : 'text-on-surface-variant'"
              class="rounded-lg px-3"
            >
              <v-icon icon="mdi-view-dashboard-outline" class="mr-1" size="18"></v-icon>
              Dashboard
            </v-btn>

            <v-btn 
              variant="text" 
              size="small" 
              to="/dashboard/files"
              :class="route.path.startsWith('/dashboard/files') ? 'text-primary font-weight-bold' : 'text-on-surface-variant'"
              class="rounded-lg px-3"
            >
              <v-icon icon="mdi-file-document-multiple-outline" class="mr-1" size="18"></v-icon>
              Archivos
            </v-btn>

            <v-btn 
              variant="text" 
              size="small" 
              to="/dashboard/exams"
              :class="route.path.startsWith('/dashboard/exams') ? 'text-primary font-weight-bold' : 'text-on-surface-variant'"
              class="rounded-lg px-3"
            >
              <v-icon icon="mdi-school-outline" class="mr-1" size="18"></v-icon>
              Exámenes
            </v-btn>
          </nav>
        </div>

        <!-- Right: Actions & User Menu -->
        <div class="d-flex align-center ga-2 ga-sm-3">
          <!-- Create Exam CTA -->
          <v-btn 
            color="primary-container" 
            class="text-on-primary-container rounded-lg px-3 d-none d-sm-flex font-weight-bold text-caption" 
            elevation="0" 
            to="/dashboard/exams"
          >
            <v-icon icon="mdi-plus" class="mr-1" size="18"></v-icon>
            Nuevo Examen
          </v-btn>

          <!-- Plan Badge -->
          <v-tooltip location="bottom" text="Plan activo y cuota de IA">
            <template v-slot:activator="{ props }">
              <v-chip 
                v-bind="props" 
                size="small" 
                variant="tonal" 
                :color="planColor" 
                class="font-weight-bold d-none d-sm-inline-flex cursor-pointer"
                to="/dashboard/profile"
              >
                <v-icon icon="mdi-shield-star" size="14" class="mr-1"></v-icon>
                {{ userPlan }}
              </v-chip>
            </template>
          </v-tooltip>

          <!-- Theme Toggle -->
          <v-tooltip location="bottom" :text="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
            <template v-slot:activator="{ props }">
              <v-btn 
                v-bind="props" 
                icon 
                variant="text" 
                size="small" 
                @click="toggleTheme" 
                class="text-on-surface-variant"
                :aria-label="isDark ? 'Modo claro' : 'Modo oscuro'"
              >
                <v-icon size="20">{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <!-- User Menu Dropdown -->
          <v-menu location="bottom end" offset="8">
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" variant="text" class="ml-1" aria-label="Menú de usuario">
                <v-avatar size="36" class="border border-primary-fixed bg-primary-container text-on-primary-container font-weight-bold text-caption">
                  <v-img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url" alt="Avatar"></v-img>
                  <span v-else>{{ userInitials }}</span>
                </v-avatar>
              </v-btn>
            </template>
            <v-card min-width="220" class="rounded-xl border border-outline-variant bg-surface" elevation="4">
              <div class="px-4 py-3 border-b">
                <p class="text-subtitle-2 font-weight-bold mb-0 text-truncate">{{ authStore.fullName || 'Usuario' }}</p>
                <p class="text-caption text-on-surface-variant mb-0 text-truncate">{{ authStore.user?.email }}</p>
                <v-chip size="x-small" color="primary" variant="flat" class="mt-1 font-weight-bold">
                  PLAN {{ userPlan }}
                </v-chip>
              </div>
              <v-list density="compact" class="pa-1 bg-transparent">
                <v-list-item link to="/dashboard/profile" class="rounded-lg">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-account-circle-outline" size="18" class="mr-2"></v-icon>
                  </template>
                  <v-list-item-title class="text-caption font-weight-medium">Mi Perfil y Cuota</v-list-item-title>
                </v-list-item>
                <v-list-item link to="/dashboard/files" class="rounded-lg">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-folder-outline" size="18" class="mr-2"></v-icon>
                  </template>
                  <v-list-item-title class="text-caption font-weight-medium">Mis Archivos</v-list-item-title>
                </v-list-item>
                <v-list-item link to="/dashboard/exams" class="rounded-lg">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-text-box-outline" size="18" class="mr-2"></v-icon>
                  </template>
                  <v-list-item-title class="text-caption font-weight-medium">Mis Exámenes</v-list-item-title>
                </v-list-item>
                <v-divider class="my-1"></v-divider>
                <v-list-item link @click="handleLogout" class="rounded-lg text-error hover:bg-error-container">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-logout" size="18" class="mr-2" color="error"></v-icon>
                  </template>
                  <v-list-item-title class="text-caption font-weight-bold text-error">Cerrar Sesión</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </v-container>

      <!-- Global Notifications Snackbar -->
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
          <v-btn icon="mdi-close" variant="text" size="small" @click="uiStore.removeNotification(notification.id)"></v-btn>
        </template>
      </v-snackbar>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      temporary 
      location="left" 
      class="d-md-none bg-surface"
    >
      <div class="pa-4 border-b d-flex align-center justify-space-between">
        <AppLogo to="/dashboard" :size="36" :max-width="150" text-class="text-subtitle-1 font-weight-bold" />
        <v-btn icon="mdi-close" variant="text" size="small" @click="drawer = false"></v-btn>
      </div>

      <div class="px-4 py-3 bg-surface-container-low mb-2">
        <div class="d-flex align-center ga-3">
          <v-avatar size="38" color="primary-container" class="text-on-primary-container font-weight-bold">
            <v-img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url" alt="Avatar"></v-img>
            <span v-else>{{ userInitials }}</span>
          </v-avatar>
          <div class="min-w-0">
            <p class="text-caption font-weight-bold mb-0 text-truncate">{{ authStore.fullName || 'Usuario' }}</p>
            <v-chip size="x-small" :color="planColor" variant="flat" class="font-weight-bold">
              PLAN {{ userPlan }}
            </v-chip>
          </div>
        </div>
      </div>

      <v-list density="compact" class="pa-2">
        <v-list-item link to="/dashboard" @click="drawer = false" class="rounded-lg mb-1" :active="route.path === '/dashboard'">
          <template v-slot:prepend><v-icon icon="mdi-view-dashboard-outline" class="mr-2"></v-icon></template>
          <v-list-item-title class="text-body-2 font-weight-medium">Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/dashboard/files" @click="drawer = false" class="rounded-lg mb-1" :active="route.path.startsWith('/dashboard/files')">
          <template v-slot:prepend><v-icon icon="mdi-file-document-multiple-outline" class="mr-2"></v-icon></template>
          <v-list-item-title class="text-body-2 font-weight-medium">Archivos</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/dashboard/exams" @click="drawer = false" class="rounded-lg mb-1" :active="route.path.startsWith('/dashboard/exams')">
          <template v-slot:prepend><v-icon icon="mdi-school-outline" class="mr-2"></v-icon></template>
          <v-list-item-title class="text-body-2 font-weight-medium">Exámenes</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/dashboard/profile" @click="drawer = false" class="rounded-lg mb-1" :active="route.path === '/dashboard/profile'">
          <template v-slot:prepend><v-icon icon="mdi-account-circle-outline" class="mr-2"></v-icon></template>
          <v-list-item-title class="text-body-2 font-weight-medium">Mi Perfil</v-list-item-title>
        </v-list-item>

        <v-divider class="my-3"></v-divider>

        <v-list-item link @click="handleLogout" class="rounded-lg text-error">
          <template v-slot:prepend><v-icon icon="mdi-logout" class="mr-2" color="error"></v-icon></template>
          <v-list-item-title class="text-body-2 font-weight-bold text-error">Cerrar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import AppLogo from '@/components/common/AppLogo.vue'

const theme = useTheme()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const drawer = ref(false)
const isDark = computed(() => theme.global.name.value === 'dark')

const userPlan = computed(() => {
  return (authStore.user as any)?.subscription?.plan?.name || 'FREE'
})

const planColor = computed(() => {
  const p = userPlan.value.toUpperCase()
  if (p === 'PRO') return 'amber-darken-2'
  if (p === 'PLUS') return 'purple'
  return 'primary'
})

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

async function handleLogout() {
  drawer.value = false
  await authStore.logout()
  router.push('/login')
}
</script>
