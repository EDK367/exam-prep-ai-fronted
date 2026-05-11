import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem('token'))

    const loading = ref(false)


    const isAuthenticated = computed(() => !!user.value && !!token.value)

    const fullName = computed(() => {
        user.value ? `${user.value.name} ${user.value.lastName}` : ''
    })

    function setToken(newToken: string) {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    function clearSession() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
    }

    return {
        user,
        token,
        loading,
        isAuthenticated,
        fullName,
        setToken,
        clearSession
    }
})