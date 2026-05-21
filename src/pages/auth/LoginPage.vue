<template>
  <div>
    <!-- Authentication Card -->
    <v-card 
      class="bg-surface-container-lowest pa-6 pa-md-12 rounded-xl hover-shadow transition-shadow" 
      border="outline-variant" 
      elevation="0"
    >
      <div class="text-center mb-8">
        <div class="d-flex justify-center mb-4">
          <AppLogo :size="80" :max-width="280" :show-text="false" />
        </div>
        <h1 class="text-h4 font-weight-bold text-on-surface mb-2">Welcome Back</h1>
        <p class="text-body-1 text-on-surface-variant mb-0">Sign in to continue your preparation.</p>
      </div>

      <v-alert
        v-if="errorMsg"
        type="error"
        variant="tonal"
        class="mb-4 rounded-lg"
        closable
        @click:close="errorMsg = ''"
      >
        {{ errorMsg }}
      </v-alert>

      <v-form @submit.prevent="handleLogin" class="d-flex flex-column ga-4">
        <!-- Email Field -->
        <div>
          <label class="text-caption font-weight-medium text-on-surface-variant ml-1 mb-1 d-block" for="email">Email</label>
          <v-text-field 
            id="email"
            v-model="email" 
            placeholder="name@example.com"
            type="email"
            variant="outlined" 
            bg-color="surface-bright"
            hide-details
            density="comfortable"
            class="rounded-lg"
          />
        </div>

        <!-- Password Field -->
        <div>
          <div class="d-flex justify-space-between align-center px-1 mb-1">
            <label class="text-caption font-weight-medium text-on-surface-variant" for="password">Password</label>
            <a href="#" class="text-caption text-primary text-decoration-none hover-underline transition-all">Forgot?</a>
          </div>
          <v-text-field 
            id="password"
            v-model="password" 
            placeholder="••••••••"
            type="password"
            variant="outlined" 
            bg-color="surface-bright"
            hide-details
            density="comfortable"
            class="rounded-lg"
          />
        </div>

        <div class="pt-4 d-flex flex-column ga-4">
          <v-btn 
            type="submit" 
            color="primary-container" 
            class="text-on-primary-container text-button font-weight-bold w-100 rounded-lg hover-brightness active-scale" 
            size="x-large"
            elevation="0"
            :loading="loading"
          >
            Login
          </v-btn>

          <div class="d-flex align-center py-2">
            <v-divider class="flex-grow-1 border-outline-variant"></v-divider>
            <span class="mx-4 text-caption text-on-surface-variant">OR</span>
            <v-divider class="flex-grow-1 border-outline-variant"></v-divider>
          </div>

          <v-btn 
            type="button" 
            class="bg-surface-bright text-on-surface text-button font-weight-bold w-100 rounded-lg hover-bg-container active-scale d-flex align-center justify-center ga-2" 
            border="outline"
            size="x-large"
            elevation="0"
            @click="loginWithGoogle"
          >
            <v-icon icon="mdi-google" size="small"></v-icon>
            Login with Google
          </v-btn>
        </div>
      </v-form>

      <div class="mt-8 text-center">
        <p class="text-body-2 text-on-surface-variant mb-0">
          Don't have an account? 
          <router-link to="/register" class="text-primary font-weight-bold text-decoration-none hover-underline active-scale d-inline-block transition-all">
            Create Account
          </router-link>
        </p>
      </div>
    </v-card>

    <!-- Trust / Social Proof Area -->
    <div class="mt-12 d-flex flex-column align-center ga-4">
      <p class="text-caption text-on-surface-variant opacity-70 mb-0 font-weight-medium">TRUSTED BY STUDENTS FROM</p>
      <div class="d-flex flex-wrap justify-center ga-6 opacity-40 grayscale-filter">
        <div class="d-flex align-center justify-center font-weight-bold text-on-surface-variant bg-surface-container-highest rounded pa-2 min-w-100">EDU-GLOBAL</div>
        <div class="d-flex align-center justify-center font-weight-bold text-on-surface-variant bg-surface-container-highest rounded pa-2 min-w-100">TECH-UNI</div>
        <div class="d-flex align-center justify-center font-weight-bold text-on-surface-variant bg-surface-container-highest rounded pa-2 min-w-100">PREP-PATH</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import AppLogo from '@/components/common/AppLogo.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMsg.value = 'Por favor, ingresa tu correo y contraseña.'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Login failed:', error)
    errorMsg.value = error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
  } finally {
    loading.value = false
  }
}

async function loginWithGoogle() {
  errorMsg.value = ''
  try {
    await authStore.loginWithGoogle()
  } catch (error: any) {
    console.error('Google login failed:', error)
    errorMsg.value = error.message || 'Error al iniciar sesión con Google.'
  }
}
</script>

<style scoped>
.hover-shadow {
  transition: box-shadow 0.3s ease;
}
.hover-shadow:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}
.hover-underline:hover {
  text-decoration: underline !important;
}
.hover-brightness:hover {
  filter: brightness(1.1);
}
.active-scale:active {
  transform: scale(0.98);
}
.hover-bg-container:hover {
  background-color: rgb(var(--v-theme-surface-container)) !important;
}
.grayscale-filter {
  filter: grayscale(100%);
}
.min-w-100 {
  min-width: 96px;
}
</style>