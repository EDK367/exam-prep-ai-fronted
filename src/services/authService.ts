import { supabase } from './supabase'
import api from './api'
import type { LoginPayload, RegisterPayload, User } from '@/types/auth.types'
import type { ApiResponse } from '@/types/api.types'

export const authService = {
    async login(payload: LoginPayload) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: payload.email,
            password: payload.password
        })
        if (error) throw error
        return data
    },

    async register(payload: RegisterPayload) {
        const fullName = `${payload.firstName} ${payload.lastName}`.trim()
        const { data, error } = await supabase.auth.signUp({
            email: payload.email,
            password: payload.password,
            options: {
                data: {
                    name: fullName,
                    full_name: fullName,
                    first_name: payload.firstName,
                    last_name: payload.lastName
                }
            }
        })
        if (error) throw error
        return data
    },

    async logout() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    async getProfile() {
        const response = await api.get<User>('/users/me')
        return response.data
    },

    async loginWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        })
        if (error) throw error
        return data
    }
}
