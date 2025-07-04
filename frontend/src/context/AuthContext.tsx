import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/auth'
import { User } from '../types'
import { mockUsers } from '../services/mockData'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: RegisterData) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  name: string
  companyName: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      // En modo mock y API real, verificar token
      try {
        const userData = await authService.validateToken()
        setUser(userData)
      } catch (error) {
        console.error('Error validando token:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('current_user_id')
      }
    } catch (error) {
      console.error('Error inicializando autenticación:', error)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user_id')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { user: userData, token } = await authService.login(email, password)
      
      localStorage.setItem('auth_token', token)
      setUser(userData)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true)
      await authService.register(data)
      // Después del registro, podrías redirigir al login o hacer login automático
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user_id')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
} 