import api from './api'
import type { LoginPayload, RegisterPayload, AuthTokens, User } from '@/types/auth.types'
import type { ApiResponse } from '@/types/api.types'

export const authService = {
    login(payload: LoginPayload) {
        return api.post<ApiResponse<AuthTokens>>('/auth/login', payload)
    },

    register(payload: RegisterPayload) {
        return api.post<ApiResponse<User>>('/auth/register', payload)
    },

    logout() {
        return api.post('/auth/logout')
    },

    getProfile() {
        return api.get<ApiResponse<User>>('/auth/me')
    },

    refreshToken(refreshToken: string) {
        return api.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken })
    },
}
