import React from 'react'

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 ¡Aplicación Funcionando!
        </h1>
        <p className="text-gray-600 mb-6">
          La aplicación React se está ejecutando correctamente.
        </p>
        <div className="space-y-4">
          <div className="bg-green-100 text-green-800 p-3 rounded-lg">
            ✅ React cargado
          </div>
          <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
            ✅ Tailwind CSS funcionando
          </div>
          <div className="bg-purple-100 text-purple-800 p-3 rounded-lg">
            ✅ Componente renderizado
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Variables de entorno:{' '}
          <br />
          VITE_USE_MOCK_DATA: {import.meta.env.VITE_USE_MOCK_DATA || 'undefined'}
          <br />
          VITE_API_URL: {import.meta.env.VITE_API_URL || 'undefined'}
        </p>
      </div>
    </div>
  )
}

export default TestPage 