<template>
  <v-container class="max-w-5xl mx-auto px-4 py-8" fluid>
    <div class="d-flex align-center ga-4 mb-8">
      <v-avatar size="72" class="border-md border-primary bg-primary-container text-on-primary-container font-weight-bold text-h4">
        <v-img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url" alt="Avatar" />
        <span v-else>{{ userInitials }}</span>
      </v-avatar>
      <div>
        <h1 class="text-h4 font-weight-bold text-on-surface mb-1">Mi perfil</h1>
        <p class="text-body-2 text-on-surface-variant mb-0">{{ authStore.user?.email }}</p>
      </div>
    </div>

    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="rounded-xl pa-6 bg-surface-container-low border h-100" elevation="0">
            <h2 class="text-h6 font-weight-bold mb-4">Información de cuenta</h2>
            <div class="d-flex flex-column ga-4">
              <div>
                <span class="text-caption text-on-surface-variant d-block mb-1">Nombre</span>
                <span class="text-body-1 font-weight-medium">{{ displayName }}</span>
              </div>
              <div>
                <span class="text-caption text-on-surface-variant d-block mb-1">Correo</span>
                <span class="text-body-1">{{ authStore.user?.email }}</span>
              </div>
              <div>
                <span class="text-caption text-on-surface-variant d-block mb-1">Miembro desde</span>
                <span class="text-body-1">
                  {{ authStore.user?.created_at ? formatDate(authStore.user.created_at) : 'N/A' }}
                </span>
              </div>
              <div>
                <span class="text-caption text-on-surface-variant d-block mb-1">Plan actual</span>
                <v-chip color="primary" variant="flat" class="text-uppercase font-weight-bold">
                  <v-icon start size="16">mdi-shield-star</v-icon>
                  {{ currentPlanDisplay }}
                </v-chip>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="rounded-xl pa-6 bg-surface-container-low border h-100" elevation="0">
            <h2 class="text-h6 font-weight-bold mb-4">Uso y límites</h2>

            <v-alert type="info" variant="tonal" density="compact" class="mb-4 rounded-lg">
              <span class="text-body-2">
                Hoy has consumido <strong>{{ formatNumber(usage?.tokens?.today ?? 0) }}</strong> tokens.
              </span>
            </v-alert>

            <div class="d-flex flex-column ga-5">
              <div v-for="bar in usageBars" :key="bar.label">
                <div class="d-flex justify-space-between text-caption mb-1">
                  <span class="text-on-surface-variant font-weight-medium">{{ bar.label }}</span>
                  <span class="font-weight-bold">{{ formatNumber(bar.used) }} / {{ formatNumber(bar.max) }}</span>
                </div>
                <v-progress-linear
                  :model-value="bar.percent"
                  :color="bar.color"
                  bg-color="surface-container-highest"
                  rounded
                  height="8"
                />
              </div>
            </div>

            <v-divider class="my-4" />
            <div class="d-flex justify-space-between text-caption text-on-surface-variant">
              <span>Solicitudes IA</span>
              <span class="font-weight-bold text-on-surface">{{ usage?.cost?.request_count ?? 0 }}</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="rounded-xl pa-6 bg-surface-container-low border mt-6" elevation="0">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center ga-4 mb-6">
          <div>
            <h2 class="text-h6 font-weight-bold mb-1">Planes de suscripción</h2>
            <p class="text-body-2 text-on-surface-variant mb-0">
              Selecciona el plan que mejor se adapte a tus necesidades. Puedes cambiarlo en cualquier momento.
            </p>
          </div>
          <v-chip
            v-if="currentPlanDisplay.toUpperCase() !== 'FREE'"
            color="success"
            variant="tonal"
            size="small"
            class="font-weight-medium"
          >
            <v-icon start size="14">mdi-check-circle</v-icon>
            Plan {{ currentPlanDisplay }} activo
          </v-chip>
        </div>

        <v-row>
          <v-col v-for="plan in availablePlans" :key="plan.name" cols="12" sm="6" md="4">
            <v-card
              class="rounded-xl pa-5 h-100 d-flex flex-column transition-swing"
              :class="isCurrentPlan(plan.name) ? 'border-md border-primary bg-surface-container' : 'bg-surface-container-lowest border'"
              elevation="0"
            >
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-h6 font-weight-bold">{{ plan.name }}</span>
                <v-chip v-if="isCurrentPlan(plan.name)" size="x-small" color="primary" variant="flat">
                  Actual
                </v-chip>
              </div>
              <p class="text-caption text-on-surface-variant mb-3">
                {{ getPlanDescription(plan.name) }}
              </p>
              <ul class="text-caption text-on-surface-variant mb-5 flex-grow-1 ps-4 d-flex flex-column ga-1">
                <li><strong>{{ formatNumber(plan.max_tokens) }}</strong> tokens / mes</li>
                <li><strong>{{ plan.max_uploads }}</strong> archivos permitidos</li>
                <li><strong>{{ plan.max_test }}</strong> exámenes generados</li>
                <li v-if="plan.name.toUpperCase() !== 'FREE'">
                  <strong>Modelo:</strong> GPT-4o avanzado
                </li>
                <li v-else>
                  <strong>Modelo:</strong> Liquid LFM Flash (IA Rápida)
                </li>
              </ul>
              <v-btn
                block
                :variant="isCurrentPlan(plan.name) ? 'outlined' : 'flat'"
                :color="isCurrentPlan(plan.name) ? 'primary' : plan.name.toUpperCase() === 'FREE' ? 'surface-variant' : 'primary'"
                :loading="changingPlan === plan.name"
                :disabled="isCurrentPlan(plan.name) || changingPlan !== null"
                @click="onPlanAction(plan.name)"
              >
                <v-icon start size="18" v-if="!isCurrentPlan(plan.name)">mdi-lightning-bolt</v-icon>
                {{ isCurrentPlan(plan.name) ? 'Plan actual' : `Cambiar a ${plan.name}` }}
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import { examService } from '@/services/examService'
import api from '@/services/api'
import type { PlanUsage, BillingPlan } from '@/types/exam.types'

const authStore = useAuthStore()
const uiStore = useUiStore()

const usage = ref<PlanUsage | null>(null)
const loading = ref(true)
const changingPlan = ref<string | null>(null)
const availablePlans = ref<BillingPlan[]>([])

const currentPlanDisplay = computed(() => {
  return usage.value?.plan || authStore.user?.subscription?.plan?.name || 'FREE'
})

function isCurrentPlan(planName: string) {
  const current = currentPlanDisplay.value.trim().toUpperCase()
  return planName.trim().toUpperCase() === current
}

function getPlanDescription(planName: string) {
  const p = planName.toUpperCase()
  if (p === 'FREE') return 'Para comenzar a estudiar tus apuntes con IA y exámenes básicos.'
  if (p === 'PLUS') return 'Para estudiantes que necesitan mayor capacidad de análisis y modelos avanzados.'
  if (p === 'PRO') return 'Acceso de máxima potencia para preparación exhaustiva y oposiciones.'
  return 'Plan de estudio personalizado.'
}

const userInitials = computed(() => {
  if (!authStore.user) return '?'
  const name = authStore.user.name || ''
  const lastName = authStore.user.last_names || ''
  if (name && lastName) return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  if (name) return name.substring(0, 2).toUpperCase()
  if (authStore.user.email) return authStore.user.email.substring(0, 2).toUpperCase()
  return 'U'
})

const displayName = computed(() => {
  const u = authStore.user
  if (!u) return ''
  const parts = [u.name, u.last_names].filter(Boolean)
  return parts.length ? parts.join(' ') : u.email
})

const usageBars = computed(() => {
  const u = usage.value
  const bars = [
    { label: 'Tokens del periodo', used: u?.tokens?.used ?? 0, max: u?.tokens?.max ?? 1, color: 'primary' },
    { label: 'Archivos subidos', used: u?.uploads?.used ?? 0, max: u?.uploads?.max ?? 1, color: 'secondary' },
    { label: 'Exámenes generados', used: u?.tests?.used ?? 0, max: u?.tests?.max ?? 1, color: 'tertiary' },
  ]
  return bars.map((b) => ({
    ...b,
    percent: b.max > 0 ? Math.min(100, (b.used / b.max) * 100) : 0,
  }))
})

function formatNumber(n: number) {
  return new Intl.NumberFormat('es').format(n)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function loadUsage() {
  loading.value = true
  try {
    const { data } = await examService.getFullUsage()
    usage.value = data.data
    const plansResponse = await api.get<{ success: boolean; data: BillingPlan[] }>('/billing/plans')
    availablePlans.value = plansResponse.data.data
  } catch {
    uiStore.addNotification('error', 'No se pudo cargar la información del perfil.')
  } finally {
    loading.value = false
  }
}

async function onPlanAction(planName: string) {
  if (isCurrentPlan(planName)) return

  const confirmed = await uiStore.showConfirm({
    title: `Cambiar a plan ${planName}`,
    message: `¿Deseas cambiar tu suscripción al plan ${planName}? Tus nuevos límites de tokens, exámenes y modelo de IA se aplicarán de inmediato en tu cuenta.`,
    confirmText: 'Sí, cambiar plan',
    cancelText: 'Cancelar',
    color: 'primary',
  })

  if (!confirmed) return

  changingPlan.value = planName
  try {
    const res = await examService.changePlan(planName)
    uiStore.showSuccess(res.data.message || `Plan cambiado exitosamente a ${planName}`)
    // Refresh limits from DB and auth profile to update Navbar and usage bars
    await Promise.all([
      loadUsage(),
      authStore.fetchProfile(),
    ])
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.error?.message ||
      error.response?.data?.detail ||
      'Error al cambiar de plan'
    uiStore.showError(errorMsg)
  } finally {
    changingPlan.value = null
  }
}

onMounted(() => {
  loadUsage()
})
</script>
