// Frontend type definitions for authentication and users
// Matches backend UserResponse schema

export interface User {
  id: string
  email: string
  name: string | null
  last_names: string | null
  avatar_url: string | null
  is_active: boolean
  supabase_id: string
  type_user_id: string | null
  created_at: string
  updated_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}