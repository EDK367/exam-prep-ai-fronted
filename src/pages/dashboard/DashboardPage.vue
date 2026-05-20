<template>
  <v-container class="max-w-7xl mx-auto px-4 px-md-8 py-12" fluid>
    <header class="mb-12">
      <h1 class="text-h3 font-weight-bold mb-2">Welcome back, {{ authStore.user?.name || 'User' }}</h1>
      <p class="text-body-1 text-on-surface-variant">Your AI-generated revision tracks are ready for review.</p>
    </header>

    <v-row>
      <v-col cols="12" lg="8" class="d-flex flex-column ga-6">
        <RecentFilesWidget />
        <RecentResultsWidget />
      </v-col>

      <v-col cols="12" lg="4" class="d-flex flex-column ga-6">
        <UpcomingExamsWidget />
        <WeeklyProgressWidget />
        <StudyTipWidget />
      </v-col>
    </v-row>
  </v-container>
  
  <div class="d-md-none position-fixed bottom-0 right-0 mb-6 mr-6" style="z-index: 10;">
    <v-btn icon color="primary-container" class="text-on-primary-container" size="large" elevation="8" to="/dashboard/exams">
      <v-icon size="x-large">mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/authStore'
import RecentFilesWidget from '@/components/dashboard/RecentFilesWidget.vue'
import RecentResultsWidget from '@/components/dashboard/RecentResultsWidget.vue'
import UpcomingExamsWidget from '@/components/dashboard/UpcomingExamsWidget.vue'
import WeeklyProgressWidget from '@/components/dashboard/WeeklyProgressWidget.vue'
import StudyTipWidget from '@/components/dashboard/StudyTipWidget.vue'

const authStore = useAuthStore()
</script>

<style scoped>
.max-w-7xl {
  max-width: 1280px;
}
</style>