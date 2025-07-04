import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { initMockData } from './utils/initMockData'
import './styles/globals.css'

// Limpiar cualquier token corrupto al iniciar
const cleanupAuth = () => {
  const token = localStorage.getItem('auth_token')
  const userId = localStorage.getItem('current_user_id')
  
  // Si hay token pero no hay user_id, limpiar todo
  if (token && !userId) {
    console.log('[Cleanup] Limpiando tokens corruptos...')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user_id')
  }
}

// Limpiar autenticación corrupta
cleanupAuth()

// Inicializar datos mock si está habilitado
initMockData()

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
) 