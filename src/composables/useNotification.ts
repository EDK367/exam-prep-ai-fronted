import { useUiStore } from '@/store/uiStore'

export function userNotification() {
    const ui = useUiStore()

    return {
        success: (message: string) => ui.addNotification('succes', message),
        error: (message: string) => ui.addNotification('error', message),
        warning: (message: string) => ui.addNotification('warning', message),
        info: (message: string) => ui.addNotification('info', message),
    }   
}