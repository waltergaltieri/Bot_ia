import { useState, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

interface UseApiOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
}

export function useApi<T = any>(
  options: UseApiOptions = {
    showSuccessToast: false,
    showErrorToast: true,
  }
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(
    async (apiCall: () => Promise<any>) => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await apiCall()
        setData(response.data)
        
        if (options.showSuccessToast) {
          toast.success(options.successMessage || 'Operación exitosa')
        }
        
        return response.data
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Error inesperado'
        setError(errorMessage)
        
        if (options.showErrorToast) {
          toast.error(errorMessage)
        }
        
        throw err
      } finally {
        setLoading(false)
      }
    },
    [options.showSuccessToast, options.showErrorToast, options.successMessage]
  )

  return { loading, error, data, execute }
} 