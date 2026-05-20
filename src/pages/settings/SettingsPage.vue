<template>
  <v-container class="max-w-4xl mx-auto px-4 py-8" fluid>
    <h1 class="text-h3 font-weight-bold text-on-surface mb-8">User Profile & Settings</h1>

    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card class="rounded-xl pa-6 bg-surface-container-low border h-100" elevation="0">
          <h2 class="text-h5 font-weight-bold mb-4">Account Information</h2>
          <div class="d-flex flex-column ga-4">
            <div>
              <span class="text-caption text-on-surface-variant d-block mb-1">Email</span>
              <span class="text-body-1 font-weight-medium">{{ user?.email }}</span>
            </div>
            <div>
              <span class="text-caption text-on-surface-variant d-block mb-1">Account Created</span>
              <span class="text-body-1">{{ user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' }}</span>
            </div>
            <div>
              <span class="text-caption text-on-surface-variant d-block mb-1">Role</span>
              <v-chip size="small" color="primary-container" class="text-on-primary-container text-uppercase">
                {{ (user as any)?.is_superuser ? 'Admin' : 'User' }}
              </v-chip>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="rounded-xl pa-6 bg-surface-container-low border h-100 d-flex flex-column" elevation="0">
          <h2 class="text-h5 font-weight-bold mb-4">Current Plan</h2>
          
          <div class="d-flex justify-space-between align-center mb-6">
            <span class="text-h4 font-weight-black text-primary">{{ usage?.plan || 'Free' }}</span>
            <v-chip v-if="usage?.plan !== 'Free'" color="success" size="small" variant="flat">Active</v-chip>
          </div>

          <div class="d-flex flex-column ga-4 mb-8">
            <div>
              <div class="d-flex justify-space-between text-caption mb-1">
                <span class="text-on-surface-variant font-weight-medium">Token Usage</span>
                <span class="font-weight-bold">{{ usage?.tokens?.used }} / {{ usage?.tokens?.max }}</span>
              </div>
              <v-progress-linear
                :model-value="(usage?.tokens?.used / usage?.tokens?.max) * 100"
                color="primary"
                bg-color="surface-container-highest"
                rounded
                height="8"
              ></v-progress-linear>
            </div>
            <div>
              <div class="d-flex justify-space-between text-caption mb-1">
                <span class="text-on-surface-variant font-weight-medium">Exams Generated</span>
                <span class="font-weight-bold">{{ usage?.tests?.used }} / {{ usage?.tests?.max }}</span>
              </div>
              <v-progress-linear
                :model-value="(usage?.tests?.used / usage?.tests?.max) * 100"
                color="secondary"
                bg-color="surface-container-highest"
                rounded
                height="8"
              ></v-progress-linear>
            </div>
          </div>

          <div class="mt-auto">
            <h3 class="text-subtitle-2 font-weight-bold mb-2">Simulate Plan Upgrade</h3>
            <div class="d-flex ga-2 flex-wrap">
              <v-btn 
                v-for="p in availablePlans" 
                :key="p.name"
                :variant="p.name === 'Free' ? 'outlined' : 'flat'" 
                :color="p.name === 'Free' ? 'primary' : (p.name === 'Pro' ? 'secondary' : 'primary-container')" 
                class="flex-grow-1" 
                :class="p.name !== 'Free' && p.name !== 'Pro' ? 'text-on-primary-container' : ''"
                @click="simulatePlanChange(p.name)" 
                :loading="simulating === p.name"
              >
                {{ p.name }}
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { examService } from '@/services/examService'
import api from '@/services/api'

const authStore = useAuthStore()
const user = authStore.user

const usage = ref<any>(null)
const loading = ref(true)
const simulating = ref('')
const availablePlans = ref<any[]>([])

async function loadUsage() {
  loading.value = true
  try {
    const { data } = await examService.getFullUsage()
    usage.value = data.data
    
    const plansResponse = await api.get('/billing/plans')
    availablePlans.value = plansResponse.data.data
  } catch (error) {
    console.error("Failed to load usage", error)
  } finally {
    loading.value = false
  }
}

async function simulatePlanChange(planName: string) {
  simulating.value = planName
  try {
    await api.post(`/billing/plan/${planName}`)
    await loadUsage()
  } catch (error) {
    console.error("Failed to change plan", error)
  } finally {
    simulating.value = ''
  }
}

onMounted(() => {
  loadUsage()
})
</script>
