// Función para inicializar datos mock en localStorage
export const initMockData = () => {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.VITE_USE_MOCK_DATA === undefined) {
    // NO simular que el usuario está logueado automáticamente
    // El usuario debe hacer login manualmente
    console.log('[InitMockData] Modo mock activado - Se requiere login manual')
  }
}

// Función para limpiar datos mock
export const clearMockData = () => {
  localStorage.removeItem('auth_token')
}

// Llamar esta función al inicializar la app 