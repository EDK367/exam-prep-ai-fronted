export const APP_NAME = import.meta.env.VITE_APP_NAME

export const ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    EXAMS: '/exams',
    EXAM_DETAIL: (id: string) => `/exams/${id}`,
    EXAM_SESSION: (id: string) => `/exams/${id}/session`,
    RESULTS: '/results',
    SETTINGS: '/settings',
  } as const



export const PAGINATION_DEFAULTS = {
    page: 1,
    limit: 10,
}