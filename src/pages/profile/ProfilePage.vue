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
                <v-chip color="primary-container" class="text-on-primary-container text-uppercase font-weight-bold">
                  {{ usage?.plan || 'Free' }}
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
            <h2 class="text-h6 font-weight-bold mb-1">Mejorar plan</h2>
            <p class="text-body-2 text-on-surface-variant mb-0">
              Obtén más tokens, archivos y exámenes según tus necesidades de estudio.
            </p>
          </div>
          <v-chip v-if="usage?.plan && usage.plan !== 'Free'" color="success" variant="flat" size="small">
            Plan activo
          </v-chip>
        </div>

        <v-row>
          <v-col v-for="plan in availablePlans" :key="plan.name" cols="12" sm="6" md="4">
            <v-card
              class="rounded-xl pa-4 h-100 d-flex flex-column"
              :class="plan.name === usage?.plan ? 'border-md border-primary bg-surface-container' : 'bg-surface-container-lowest border'"
              elevation="0"
            >
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-h6 font-weight-bold">{{ plan.name }}</span>
                <v-chip v-if="plan.name === usage?.plan" size="x-small" color="primary">Actual</v-chip>
              </div>
              <ul class="text-caption text-on-surface-variant mb-4 flex-grow-1 ps-4">
                <li>{{ formatNumber(plan.max_tokens) }} tokens / mes</li>
                <li>{{ plan.max_uploads }} archivos</li>
                <li>{{ plan.max_test }} exámenes</li>
              </ul>
              <v-btn
                block
                :variant="plan.name === usage?.plan ? 'outlined' : 'flat'"
                :color="plan.name === 'Free' ? 'primary' : 'primary-container'"
                :class="plan.name !== 'Free' && plan.name !== usage?.plan ? 'text-on-primary-container' : ''"
                :disabled="plan.name === usage?.plan"
                @click="onPlanAction(plan.name)"
              >
                {{ plan.name === usage?.plan ? 'Plan actual' : plan.name === 'Free' ? 'Cambiar a Free' : 'Actualizar' }}
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
const availablePlans = ref<BillingPlan[]>([])

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
  if (planName === usage.value?.plan) return

  await uiStore.showConfirm({
    title: 'Cambio de plan no disponible',
    message:
      'Por el momento no es posible cambiar de plan. Esta función estará disponible en un futuro cercano.',
    confirmText: 'Entendido',
    cancelText: '',
    color: 'primary',
  })
}

onMounted(() => {
  loadUsage()
})
</script>
