<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="d-flex align-center text-decoration-none logo-container"
    :class="[{ 'ga-3': showText }, linkClass]"
  >
    <v-img
      :src="LOGO_SRC"
      :height="size"
      :max-width="maxWidth"
      alt="Exam Prep AI"
      class="flex-shrink-0 logo-img"
      :class="isDark ? 'logo-dark' : 'logo-light'"
      contain
    />
    <span
      v-if="showText"
      class="font-weight-black logo-text"
      :class="[textClass, isDark ? 'text-primary' : 'text-primary']"
    >
      {{ APP_NAME }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { APP_NAME, LOGO_SRC } from '@/utils/constants'

const props = withDefaults(
  defineProps<{
    to?: string
    size?: number
    showText?: boolean
    textClass?: string
    linkClass?: string
    maxWidth?: number
  }>(),
  {
    size: 52,
    showText: true,
    textClass: 'text-h6',
    linkClass: '',
  },
)

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')

const maxWidth = computed(() => props.maxWidth ?? Math.round(props.size * 4.5))
</script>

<style scoped>
.logo-container {
  transition: all 0.3s ease;
}

.logo-img {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-light {
  filter: drop-shadow(0 2px 6px rgba(0, 101, 141, 0.15)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05));
}

.logo-dark {
  /* High contrast neon-glow outline for dark mode to make it pop beautifully on black background */
  filter: drop-shadow(0 0 8px rgba(130, 207, 255, 0.45)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.75));
}

.logo-text {
  font-family: 'Outfit', 'Inter', 'Roboto', sans-serif;
  letter-spacing: -0.02em;
  transition: all 0.3s ease;
}

/* Premium micro-animations on hover */
.logo-container:hover .logo-img {
  transform: scale(1.08) rotate(-3deg);
}

.logo-container:hover .logo-light {
  filter: drop-shadow(0 4px 10px rgba(0, 101, 141, 0.25)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-container:hover .logo-dark {
  filter: drop-shadow(0 0 12px rgba(130, 207, 255, 0.75)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.9));
}

.logo-container:hover .logo-text {
  opacity: 0.95;
  text-shadow: 0 0 8px rgba(130, 207, 255, 0.25);
}
</style>
