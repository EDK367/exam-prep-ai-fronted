import axios from 'axios'
import { supabase } from './supabase'
import type { AxiosError, AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30_000,
})

// Request interceptor: always inject the current Supabase token
api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const token = session?.access_token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Session expired — sign out from Supabase and let the auth listener handle it
      await supabase.auth.signOut()
    }
    return Promise.reject(error)
  },
)

export default api
