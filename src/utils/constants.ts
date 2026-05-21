export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Exam Prep AI'

export const LOGO_SRC = '/logo-exam.png'

export const ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROFILE: '/dashboard/profile',
    EXAMS: '/exams',
    EXAM_DETAIL: (id: string) => `/exams/${id}`,
    EXAM_SESSION: (id: string) => `/exams/${id}/session`,
    RESULTS: '/results',
  } as const



export const PAGINATION_DEFAULTS = {
    page: 1,
    limit: 10,
}