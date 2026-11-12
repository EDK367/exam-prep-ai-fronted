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

    const confirmState = ref<{
        show: boolean
        title: string
        message: string
        confirmText: string
        cancelText: string
        color: string
        resolve: ((value: boolean) => void) | null
    }>({
        show: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        color: 'primary',
        resolve: null
    })

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

    function showSuccess(message: string) {
        addNotification('success', message)
    }

    function showError(message: string) {
        addNotification('error', message)
    }

    function removeNotification(id: string) {
        notifications.value = notifications.value.filter((n) => n.id !== id)
    }

    function showConfirm(options: {
        title: string
        message: string
        confirmText?: string
        cancelText?: string
        color?: string
    }): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            confirmState.value = {
                show: true,
                title: options.title,
                message: options.message,
                confirmText: options.confirmText || 'Confirmar',
                cancelText: options.cancelText !== undefined ? options.cancelText : 'Cancelar',
                color: options.color || 'primary',
                resolve
            }
        })
    }

    function handleConfirm(value: boolean) {
        if (confirmState.value.resolve) {
            confirmState.value.resolve(value)
        }
        confirmState.value.show = false
    }

    return {
        isDarkMode,
        sidebarOpen,
        globalLoading,
        notifications,
        confirmState,
        toggleDarkMode,
        toggleSideBar,
        addNotification,
        showSuccess,
        showError,
        removeNotification,
        showConfirm,
        handleConfirm
    }
})