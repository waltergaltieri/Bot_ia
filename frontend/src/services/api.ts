import axios, { AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import mockApi from './mockApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

console.log('[API] VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
console.log('[API] USE_MOCK_DATA:', USE_MOCK_DATA)

if (!import.meta.env.VITE_USE_MOCK_DATA) {
  console.warn('[API] ⚠️ La variable VITE_USE_MOCK_DATA no está definida. Se recomienda definirla en .env.local')
}

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Wrapper para usar mock o API real
const createApiWrapper = () => {
  return {
    async get(url: string, config?: any) {
      if (USE_MOCK_DATA) {
        console.log('[API] Usando mockApi para GET', url)
        return mockApi.get(url, config)
      }
      return api.get(url, config)
    },

    async post(url: string, data?: any, config?: any) {
      if (USE_MOCK_DATA) {
        console.log('[API] Usando mockApi para POST', url)
        return mockApi.post(url, data)
      }
      return api.post(url, data, config)
    },

    async put(url: string, data?: any, config?: any) {
      if (USE_MOCK_DATA) {
        console.log('[API] Usando mockApi para PUT', url)
        return mockApi.put(url, data)
      }
      return api.put(url, data, config)
    },

    async delete(url: string, config?: any) {
      if (USE_MOCK_DATA) {
        console.log('[API] Usando mockApi para DELETE', url)
        return mockApi.delete(url)
      }
      return api.delete(url, config)
    },

    async patch(url: string, data?: any, config?: any) {
      if (USE_MOCK_DATA) {
        console.log('[API] Usando mockApi para PATCH', url)
        return mockApi.patch(url, data)
      }
      return api.patch(url, data, config)
    },
  }
}

// Interceptor para agregar token de autenticación (solo para API real)
api.interceptors.request.use(
  (config) => {
    if (!USE_MOCK_DATA) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas (solo para API real)
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (!USE_MOCK_DATA) {
      // Manejar errores globalmente
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.')
      } else if (error.response?.status === 403) {
        toast.error('No tienes permisos para realizar esta acción.')
      } else if (error.response?.status >= 500) {
        toast.error('Error del servidor. Intenta nuevamente más tarde.')
      }
    }
    return Promise.reject(error)
  }
)

// Exportar el wrapper como API principal
export default createApiWrapper() 