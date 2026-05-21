<template>
  <v-app class="bg-background">
    <AppNavbar />

    <v-main class="flex-grow-1 min-h-screen d-flex flex-column">
      <router-view />
    </v-main>

    <AppFooter />
    <ConfirmDialog />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
</script>
