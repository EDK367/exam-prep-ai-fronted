export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

export interface PaginatedApiResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface ApiError {
    status: number
    message: string
    error?: string
}