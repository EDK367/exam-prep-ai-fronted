export interface User {
    id: string
    email: string
    name: string
    lastName: string
    createdAt: string
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