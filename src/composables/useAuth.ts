import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import { ROUTES } from '@/utils/constants'

export function useAuth() {
    const authStore = useAuthStore()
    const router = useRouter()   

    function requireAuth() {
        if (!authStore.isAuthenticated) {
            router.push(ROUTES.LOGIN)
        }
    }

    return {
        user: authStore.user,
        isAuthenticated: authStore.isAuthenticated,
        fullName: authStore.fullName,
        requireAuth
    }

}
