import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'
import { authService } from '@/services/authService'
import type { User, LoginPayload, RegisterPayload } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem('token'))
    const loading = ref(false)
    // Prevents onAuthStateChange from calling fetchProfile when login/register already does
    const _skipNextAuthEvent = ref(false)
    const _fetchingProfile = ref(false)

    const isAuthenticated = computed(() => !!token.value)

    const fullName = computed(() => {
        if (!user.value) return ''
        return user.value.name || user.value.email || ''
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

    async function fetchProfile() {
        if (!token.value || _fetchingProfile.value) return
        _fetchingProfile.value = true
        try {
            const profile = await authService.getProfile()
            user.value = profile
        } catch (error) {
            console.error('Error fetching profile:', error)
            clearSession()
        } finally {
            _fetchingProfile.value = false
        }
    }

    async function login(payload: LoginPayload) {
        loading.value = true
        _skipNextAuthEvent.value = true
        try {
            const data = await authService.login(payload)
            if (data.session) {
                setToken(data.session.access_token)
                await fetchProfile()
            }
            return data
        } finally {
            loading.value = false
        }
    }

    async function register(payload: RegisterPayload) {
        loading.value = true
        _skipNextAuthEvent.value = true
        try {
            const data = await authService.register(payload)
            if (data.session) {
                setToken(data.session.access_token)
                await fetchProfile()
            }
            return data
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        loading.value = true
        try {
            await authService.logout()
        } finally {
            clearSession()
            loading.value = false
        }
    }

    async function loginWithGoogle() {
        loading.value = true
        try {
            await authService.loginWithGoogle()
        } finally {
            loading.value = false
        }
    }

    // Initialize listener for Supabase auth state changes
    function initializeAuthListener() {
        // Fetch current session on app start
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setToken(session.access_token)
                fetchProfile()
            } else {
                clearSession()
            }
        })

        // Listen for changes (token refresh, sign out from another tab, etc.)
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('Supabase Auth Event:', event)

            // Skip if login/register already handled this event
            if (_skipNextAuthEvent.value) {
                _skipNextAuthEvent.value = false
                return
            }

            if (event === 'SIGNED_OUT') {
                clearSession()
            } else if (event === 'TOKEN_REFRESHED' && session) {
                // Update the token when Supabase refreshes it
                setToken(session.access_token)
            } else if (event === 'SIGNED_IN' && session && !user.value) {
                // Only fetch profile if we don't already have a user
                // (e.g. OAuth redirect, page refresh with existing session)
                setToken(session.access_token)
                fetchProfile()
            }
        })
    }

    return {
        user,
        token,
        loading,
        isAuthenticated,
        fullName,
        setToken,
        clearSession,
        fetchProfile,
        login,
        register,
        logout,
        loginWithGoogle,
        initializeAuthListener
    }
})