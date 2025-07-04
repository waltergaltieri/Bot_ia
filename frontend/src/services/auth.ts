import api from './api'
import { User } from '../types'

interface LoginResponse {
  token: string
  user: User
}

interface RegisterData {
  email: string
  password: string
  name: string
  companyName: string
  phone?: string
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(data: RegisterData): Promise<void> {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async validateToken(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.data.user
  },

  async forgotPassword(email: string): Promise<void> {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  },
} 