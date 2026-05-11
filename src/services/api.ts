import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'

// uso de api
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// adjuntar el token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// manejo de error centralizado
api.interceptors.response.use((response) => response,
    (error: AxiosError) => {

        // si el token expira limpiar y redirigir
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'

        }
        return Promise.reject(error)
    }
)

export default api