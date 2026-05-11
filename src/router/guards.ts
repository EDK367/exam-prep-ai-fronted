import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "@/store/authStore";

export function requiresAuth(
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    const auth = useAuthStore();
    if (auth.isAuthenticated) {
        next();
    } else {
        next("/home");
    }
}

export function redirectIfAuthenticated(
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    const auth = useAuthStore();
    if (auth.isAuthenticated) {
        next("/dashboard");
    } else {
        next();
    }
}
