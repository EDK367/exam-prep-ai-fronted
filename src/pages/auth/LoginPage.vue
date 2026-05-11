<template>
  <v-app>
    <!-- Header / TopNavBar -->
    <v-app-bar flat class="border-b" border-color="outline-variant">
      <v-container class="d-flex align-center justify-space-between px-4 px-md-8" fluid>
        <div class="d-flex align-center ga-6">
          <v-app-bar-title class="text-h4 font-weight-bold text-primary">
            EXAM PREP AI
          </v-app-bar-title>
        </div>

        <div class="d-flex align-center ga-3">
          <v-btn icon variant="text" size="small" @click="toggleTheme">
            <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="min-h-screen d-flex align-center justify-center px-4 py-12">
      <v-container class="fill-height">
        <v-row class="fill-height align-center justify-center">
          <v-col cols="12" md="6" lg="5" xl="4">
            <!-- Authentication Card -->
            <v-card class="pa-6 pa-md-8" border rounded="xl">
              <div class="text-center mb-8">
                <h1 class="text-h2 mb-2">Welcome Back</h1>
                <p class="text-body-md text-on-surface-variant">Sign in to continue your preparation.</p>
              </div>

              <v-form @submit.prevent="handleLogin">
                <!-- Email Field -->
                <v-text-field v-model="email" label="Email" type="email" placeholder="name@example.com"
                  variant="outlined" density="comfortable" class="mb-4" :rules="emailRules" />

                <!-- Password Field -->
                <v-text-field v-model="password" label="Password" type="password" placeholder="••••••••"
                  variant="outlined" density="comfortable" class="mb-2" :rules="passwordRules">
                  <template #append-inner>
                    <a href="#" class="text-label-sm text-primary text-decoration-none">Forgot?</a>
                  </template>
                </v-text-field>

                <div class="mt-6">
                  <v-btn type="submit" color="primary-container" class="text-on-primary-container w-100" size="large"
                    :loading="loading">
                    Login
                  </v-btn>

                  <div class="d-flex align-center my-4">
                    <v-divider class="flex-grow-1" />
                    <span class="px-4 text-label-sm text-on-surface-variant">OR</span>
                    <v-divider class="flex-grow-1" />
                  </div>

                  <v-btn variant="outlined" class="w-100" size="large" @click="loginWithGoogle">
                    <v-icon icon="mdi-google" class="mr-2" />
                    Login with Google
                  </v-btn>
                </div>
              </v-form>

              <div class="text-center mt-6">
                <p class="text-body-md text-on-surface-variant">
                  Don't have an account?
                  <router-link to="/register" class="text-primary font-weight-bold text-decoration-none">
                    Create Account
                  </router-link>
                </p>
              </div>
            </v-card>

            <!-- Trust / Social Proof Area -->
            <div class="mt-8 text-center">
              <p class="text-label-sm text-on-surface-variant opacity-70 mb-4">TRUSTED BY STUDENTS FROM</p>
              <div class="d-flex flex-wrap justify-center ga-4 opacity-40 grayscale">
                <div class="font-weight-bold text-on-surface-variant">EDU-GLOBAL</div>
                <div class="font-weight-bold text-on-surface-variant">TECH-UNI</div>
                <div class="font-weight-bold text-on-surface-variant">PREP-PATH</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="bg-surface-container-low border-t ga-4" border-color="outline-variant">
      <v-container class="d-flex flex-column flex-md-row justify-space-between align-center ga-4">
        <div class="text-center text-md-start">
          <span class="text-h3 font-weight-bold text-primary">EXAM PREP AI</span>
          <p class="text-label-sm text-on-surface-variant opacity-80 mt-1 mb-0">
            © 2024 Exam Prep AI. All rights reserved.
          </p>
        </div>

        <div class="d-flex flex-wrap justify-center ga-4">
          <router-link to="/about" class="text-decoration-none">
            <v-btn variant="text" class="text-label-sm text-on-surface-variant">About</v-btn>
          </router-link>
          <router-link to="/contact" class="text-decoration-none">
            <v-btn variant="text" class="text-label-sm text-on-surface-variant">Contact</v-btn>
          </router-link>
          <router-link to="/privacy" class="text-decoration-none">
            <v-btn variant="text" class="text-label-sm text-on-surface-variant">Privacy Policy</v-btn>
          </router-link>
          <router-link to="/terms" class="text-decoration-none">
            <v-btn variant="text" class="text-label-sm text-on-surface-variant">Terms of Service</v-btn>
          </router-link>
        </div>
      </v-container>
    </v-footer>

    <!-- Background Decoration -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'

const theme = useTheme()
const router = useRouter()
const isDark = computed(() => theme.global.name.value === 'dark')

const email = ref('')
const password = ref('')
const loading = ref(false)

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 6) || 'Password must be at least 6 characters',
]

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

async function handleLogin() {
  loading.value = true
  try {
    // Lógica de login aquí
    console.log('Login:', { email: email.value, password: password.value })
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}

function loginWithGoogle() {
  console.log('Login with Google')
  // Lógica de Google login
}
</script>

<style scoped>
.grayscale {
  filter: grayscale(100%);
}

.grayscale:hover {
  filter: grayscale(0%);
}

.background-blobs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.15;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
}

.blob-1 {
  width: 40%;
  height: 40%;
  background: var(--v-primary-container-base);
  top: -10%;
  right: -10%;
}

.blob-2 {
  width: 30%;
  height: 30%;
  background: var(--v-secondary-base);
  bottom: -10%;
  left: -10%;
}
</style>