import { useAuthStore } from "@/store/authStore";

export function requiresAuth() {
    const auth = useAuthStore();
    if (!auth.isAuthenticated) {
        return "/login";
    }
    return true;
}

export function redirectIfAuthenticated() {
    const auth = useAuthStore();
    if (auth.isAuthenticated) {
        return "/dashboard";
    }
    return true;
}
