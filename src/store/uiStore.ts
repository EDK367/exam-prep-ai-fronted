import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Notification {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
}

export const useUiStore = defineStore('ui', () => {
    const isDarkMode = ref(false)
    const sidebarOpen = ref(true)
    const globalLoading = ref(false)
    const notifications = ref<Notification[]>([])

    function toggleDarkMode() {
        isDarkMode.value = !isDarkMode.value
    }

    function toggleSideBar() {
        sidebarOpen.value = !sidebarOpen.value
    }

    function addNotification(type: Notification['type'], message: string) {
        const id = crypto.randomUUID()
        notifications.value.push({
            id, type, message
        })
        setTimeout(() => removeNotification(id), 4000)
    }

    function removeNotification(id: string) {
        notifications.value = notifications.value.filter((n) => n.id !== id)
    }

    return {
        isDarkMode,
        sidebarOpen,
        globalLoading,
        notifications,
        toggleDarkMode,
        toggleSideBar,
        addNotification,
        removeNotification
    }
})