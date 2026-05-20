<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
authStore.initializeAuthListener()
</script>