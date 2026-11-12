  <template>
  <v-app>
    <v-app-bar flat class="border-b app-bar" border-color="outline-variant">
      <v-container class="d-flex align-center justify-space-between px-4 px-md-8" fluid>
        <div class="d-flex align-center ga-8">
          <AppLogo to="/home" :size="52" :max-width="200" text-class="text-h6" link-class="logo" />

          <div class="d-none d-md-flex ga-4">
            <v-btn variant="text" class="text-body-1 text-on-surface-variant text-primary nav-item" rounded="0">
              Features
              <v-divider class="nav-underline"></v-divider>
            </v-btn>
            <v-btn variant="text" class="text-body-1 text-on-surface-variant text-primary  nav-item"> Library
              <v-divider class="nav-underline"></v-divider>

            </v-btn>
            <v-btn variant="text" class="text-body-1 text-on-surface-variant text-primary nav-item"> Resources
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
            <v-btn variant="flat" color="primary-container" class="text-on-primary-container" @click="register">Registrarse</v-btn>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <section class="position-relative pt-16 pb-24 overflow-hidden hero-section">
        <v-container class="position-relative z-1">
          <div class="text-center mx-auto fade-up" style="max-width: 900px">
            <h1 class="text-h1 font-weight-bold mb-4">What is Exam Prep AI?</h1>
            <p class="text-body-lg text-on-surface-variant mb-6 mx-auto fade-up-delay-1" style="max-width: 700px">
              A professional, tech-focused platform designed to streamline your exam preparation
              with AI-driven insights and high-precision analytics.
            </p>
            <div class="d-flex flex-column flex-sm-row justify-center ga-3 fade-up-delay-2">
              <v-btn color="primary" size="large" class="px-8 glow-btn" rounded="lg">Get Started Free</v-btn>
              <v-btn variant="outlined" size="large" class="px-8" rounded="lg">View Demo</v-btn>
            </div>
          </div>
        </v-container>

        <div class="position-absolute top-0 start-50 w-100 h-100 pointer-events-none">
          <div class="animated-blob blob-1"></div>
          <div class="animated-blob blob-2"></div>
          <div class="animated-blob blob-3"></div>
        </div>

        <div class="floating-particles">
          <div class="particle" v-for="i in 20" :key="i" :style="particleStyle(i)"></div>
        </div>
      </section>

      <section class="py-12 features-section">
        <v-container>
          <div class="text-center text-md-start mb-8 fade-up">
            <h2 class="text-h2 mb-2">Features and Benefits</h2>
            <p class="text-body-md text-on-surface-variant">Precision tools for the modern high-stakes learner.</p>
          </div>

          <v-row>
            <v-col cols="12" md="8">
              <v-card class="pa-6 h-100 feature-card hover-lift" border flat>
                <v-avatar class="mb-3 bg-primary-container bg-opacity-10 rounded-lg feature-icon">
                  <v-icon icon="mdi-brain" color="primary" size="28"></v-icon>
                </v-avatar>
                <h3 class="text-h3 mb-2">AI Study Plans</h3>
                <p class="text-body-md text-on-surface-variant mb-4" style="max-width: 400px">
                  Our neural network analyzes your curriculum and learning pace to generate an
                  adaptive schedule that evolves with your progress.
                </p>
                <v-img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoCasLZo_GWCduE0xowchKDOrDHaePXyZ5hv-DG1Y7MZAcLKX4NMHMDPyqf8ojPyZEqsXmaDmO7s2bgEjmCTpN1AmMi8CRGc3TTxHb5zewDGk0xzol49F6okwQP-o6F5DvA7pexdaedrLPD4Vs-XkyQ9xncdXKTk28p44WUXsspGO_bO0pBCUeSJDCQf8zchQR4TerwrSSnqAGEbe7N9zVHDotkl9WUCeF5XP6W8KwQDK44Ja6Uz9XnbFZOhhtf7Opyqndy3VxDDo"
                  height="200" cover class="rounded-lg feature-img" />
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="pa-6 h-100 feature-card hover-lift" border flat>
                <v-avatar class="mb-3 bg-primary-container bg-opacity-10 rounded-lg feature-icon">
                  <v-icon icon="mdi-chart-line" color="primary" size="28"></v-icon>
                </v-avatar>
                <h3 class="text-h3 mb-2">Smart Analytics</h3>
                <p class="text-body-md text-on-surface-variant mb-4">
                  Identify knowledge gaps with pinpoint accuracy using our deep-dive performance metrics.
                </p>
                <v-divider class="mb-3"></v-divider>
                <div class="d-flex flex-column ga-2">
                  <div class="d-flex align-center ga-2 check-item">
                    <v-icon icon="mdi-check-circle" color="primary" size="18"></v-icon>
                    <span class="text-label-sm">Time-per-question analysis</span>
                  </div>
                  <div class="d-flex align-center ga-2 check-item">
                    <v-icon icon="mdi-check-circle" color="primary" size="18"></v-icon>
                    <span class="text-label-sm">Confidence mapping</span>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section class="bg-surface-container-low py-16 border-y pricing-section">
        <v-container>
          <div class="text-center mb-8 fade-up">
            <h2 class="text-h2 mb-2">Choose Your Plan</h2>
            <p class="text-body-md text-on-surface-variant">Scale your preparation with a plan that fits your ambition.
            </p>
          </div>

          <v-row>
            <v-col cols="12" md="4" v-for="plan in dbPlans" :key="plan.id">
              <v-card class="pa-6 text-center pricing-card hover-scale" border flat :class="{'popular-card': plan.name.toLowerCase() === 'plus' || plan.name.toLowerCase() === 'pro'}">
                <h3 class="text-h3 mb-2">{{ plan.name }}</h3>
                <div class="d-flex align-baseline justify-center ga-1 mb-4">
                  <span class="text-h2 font-weight-bold">{{ plan.name.toLowerCase() === 'free' || plan.name.toLowerCase() === 'gratuito' ? '$0' : (plan.name.toLowerCase() === 'plus' ? '$9.99' : '$4.99') }}</span>
                  <span class="text-label-sm">/ {{ plan.name.toLowerCase() === 'free' || plan.name.toLowerCase() === 'gratuito' ? 'forever' : 'month' }}</span>
                </div>
                <v-divider class="mb-4"></v-divider>
                <div class="d-flex flex-column ga-3 mb-6 text-left">
                  <div class="d-flex align-center ga-2 check-item">
                    <v-icon icon="mdi-check" color="primary" size="20"></v-icon>
                    <span class="text-body-md">{{ plan.max_tokens.toLocaleString() }} Tokens</span>
                  </div>
                  <div class="d-flex align-center ga-2 check-item">
                    <v-icon icon="mdi-check" color="primary" size="20"></v-icon>
                    <span class="text-body-md">{{ plan.max_test }} Exams Generated</span>
                  </div>
                  <div class="d-flex align-center ga-2 check-item">
                    <v-icon icon="mdi-check" color="primary" size="20"></v-icon>
                    <span class="text-body-md">{{ plan.max_uploads }} Document Uploads</span>
                  </div>
                  <div class="d-flex align-center ga-2 check-item">
                    <v-icon icon="mdi-check" color="primary" size="20"></v-icon>
                    <span class="text-body-md text-truncate" style="max-width: 100%;">Model: {{ plan.model }}</span>
                  </div>
                </div>
                <v-btn :variant="plan.name.toLowerCase() === 'free' ? 'outlined' : 'flat'" :color="plan.name.toLowerCase() === 'free' ? 'primary' : 'primary-container'" :class="plan.name.toLowerCase() !== 'free' ? 'text-on-primary-container pulse-btn' : 'pricing-btn'" block @click="login">
                  {{ plan.name.toLowerCase() === 'free' ? 'Get Started' : `Get ${plan.name}` }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section class="py-16 cta-section">
        <v-container>
          <v-card color="inverse-surface" class="pa-8 pa-md-12 text-center rounded-xl cta-card fade-up">
            <h2 class="text-h2 text-inverse-on-surface mb-3">Ready to transform your learning journey?</h2>
            <p class="text-body-lg text-inverse-on-surface opacity-80 mb-6 mx-auto" style="max-width: 600px">
              Join over 50,000 professionals using Exam Prep AI to master their certifications.
            </p>
            <div class="d-flex flex-column flex-sm-row justify-center ga-3 mx-auto" style="max-width: 500px">
              <v-text-field placeholder="Enter your email" variant="outlined" class="flex-grow-1 email-input"
                bg-color="surface" hide-details />
              <v-btn color="primary-container" class="text-on-primary-container px-6 pulse-btn" size="large">
                Start Free Trial
              </v-btn>
            </div>
          </v-card>
        </v-container>
      </section>
    </v-main>

    <PublicFooter />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import AppLogo from '@/components/common/AppLogo.vue'
import PublicFooter from '@/components/layout/PublicFooter.vue'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
const router = useRouter();

const dbPlans = ref<any[]>([])

onMounted(async () => {
  try {
    const { data } = await api.get('/billing/plans')
    dbPlans.value = data.data
  } catch (e) {
    console.error('Failed to load plans:', e)
    // Fallback if API fails
    dbPlans.value = [
      { id: '1', name: 'FREE', max_tokens: 50000, max_test: 10, max_uploads: 5, model: 'deepseek-free' },
      { id: '2', name: 'PLUS', max_tokens: 250000, max_test: 50, max_uploads: 50, model: 'gpt-4o' },
      { id: '3', name: 'PRO', max_tokens: 500000, max_test: 100, max_uploads: 100, model: 'gpt-4o' }
    ]
  }
})

const login = () => {
  router.push('/login')
}

const register = () => {
  router.push('/register')
}

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

function particleStyle(i: number) {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${5 + Math.random() * 10}s`,
    width: `${3 + Math.random() * 6}px`,
    height: `${3 + Math.random() * 6}px`
  }
}
</script>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }
}

@keyframes blob {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

@keyframes particleFloat {

  0%,
  100% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    transform: translateY(-100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.fade-up {
  animation: fadeUp 0.8s ease-out forwards;
}

.fade-up-delay-1 {
  animation: fadeUp 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

.fade-up-delay-2 {
  animation: fadeUp 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

.app-bar {
  transition: all 0.3s ease;
}

.logo {
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-container-base));
  -webkit-background-clip: text;
  background-clip: text;
  color: rgb(var(--v-theme-on-background));
  transition: all 0.3s ease;
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

.hero-section {
  position: relative;
  overflow: hidden;
}

.gradient-text {
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-container-base), var(--v-secondary-base));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradientShift 3s ease infinite;
}

.pulse-chip {
  animation: pulse 2s infinite;
}

.glow-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.glow-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 101, 141, 0.3);
}

.glow-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.glow-btn:hover::before {
  left: 100%;
}

.animated-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
  animation: blob 20s infinite ease-in-out;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: var(--v-primary-container-base);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: var(--v-secondary-base);
  bottom: 10%;
  right: 10%;
  animation-delay: -5s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: var(--v-tertiary-base);
  top: 50%;
  left: 50%;
  animation-delay: -10s;
}

.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-container-base));
  border-radius: 50%;
  animation: particleFloat 15s infinite linear;
  opacity: 0;
}

.features-section {
  position: relative;
  z-index: 2;
}

.feature-card {
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  overflow: hidden;
}

.hover-lift:hover {
  transform: translateY(-8px);
}

.feature-icon {
  transition: all 0.4s ease;
}

.feature-card:hover .feature-icon {
  transform: rotate(360deg) scale(1.1);
}

.feature-img {
  transition: all 0.5s ease;
  opacity: 0.7;
}

.feature-card:hover .feature-img {
  opacity: 1;
  transform: scale(1.02);
}

.check-item {
  transition: all 0.3s ease;
}

.check-item:hover {
  transform: translateX(5px);
}

.animated-bars {
  width: 100%;
  padding: 16px;
}

.bar {
  height: 8px;
  border-radius: 20px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
  position: relative;
}

.bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  animation: shimmer 2s infinite;
}

.bar-1 {
  width: 75%;
}

.bar-2 {
  width: 100%;
}

.bar-3 {
  width: 50%;
}

.bar-1::before {
  animation-delay: 0s;
}

.bar-2::before {
  animation-delay: 0.3s;
}

.bar-3::before {
  animation-delay: 0.6s;
}

.gradient-card {
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-primary-dark, #004c6b));
  position: relative;
  overflow: hidden;
}

.gradient-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.gradient-card:hover::before {
  left: 100%;
}

.pulse-btn {
  animation: pulse 2s infinite;
}

.pricing-section {
  position: relative;
  z-index: 2;
}

.pricing-card {
  transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.hover-scale:hover {
  transform: scale(1.02);
}

.popular-card {
  border: 2px solid var(--v-primary-container-base);
  position: relative;
  overflow: hidden;
}

.popular-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--v-primary-base), var(--v-primary-container-base));
}

.popular-badge {
  animation: pulse 2s infinite;
}

.pricing-btn {
  transition: all 0.3s ease;
}

.pricing-btn:hover {
  transform: translateY(-2px);
}

.cta-section {
  position: relative;
  z-index: 2;
}

.cta-card {
  transition: all 0.5s ease;
}

.cta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.email-input {
  transition: all 0.3s ease;
}

.email-input:focus-within {
  transform: translateX(5px);
}

.footer {
  transition: all 0.3s ease;
}

.footer-logo {
  transition: all 0.3s ease;
}

.footer-logo:hover {
  opacity: 0.8;
}

.footer-link {
  transition: all 0.3s ease;
  position: relative;
}

.footer-link:hover {
  transform: translateY(-2px);
}

.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: rotate(360deg) scale(1.1);
}

@media (max-width: 960px) {

  .blob-1,
  .blob-2,
  .blob-3 {
    width: 200px;
    height: 200px;
  }
}
</style>