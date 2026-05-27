export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T | null
  errors: Record<string, string[]> | null
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count?: number
  next?: string | null
  previous?: string | null
}
