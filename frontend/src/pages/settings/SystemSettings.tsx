import React, { useState } from 'react'
import { 
  Settings, 
  Shield, 
  Database, 
  Server, 
  Globe,
  Bell,
  Key,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')

  const systemStatus = {
    server: 'operational',
    database: 'connected',
    backup: 'scheduled',
    api: 'healthy'
  }

  const securitySettings = [
    {
      name: 'Autenticación de dos factores',
      description: 'Requerir 2FA para todos los usuarios',
      enabled: true,
      critical: true
    },
    {
      name: 'Encriptación de datos',
      description: 'Datos encriptados en tránsito y reposo',
      enabled: true,
      critical: true
    },
    {
      name: 'Backup automático',
      description: 'Backup diario de la base de datos',
      enabled: true,
      critical: false
    },
    {
      name: 'Monitoreo de seguridad',
      description: 'Alertas de seguridad en tiempo real',
      enabled: true,
      critical: false
    }
  ]

  const apiEndpoints = [
    {
      name: 'API de Autenticación',
      status: 'healthy',
      responseTime: '45ms',
      uptime: '99.9%'
    },
    {
      name: 'API de Publicaciones',
      status: 'healthy',
      responseTime: '120ms',
      uptime: '99.8%'
    },
    {
      name: 'API de Analytics',
      status: 'warning',
      responseTime: '350ms',
      uptime: '99.5%'
    },
    {
      name: 'API de Notificaciones',
      status: 'healthy',
      responseTime: '80ms',
      uptime: '99.9%'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operativo'
      case 'healthy':
        return 'Saludable'
      case 'connected':
        return 'Conectado'
      case 'warning':
        return 'Advertencia'
      case 'error':
        return 'Error'
      default:
        return 'Desconocido'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Configuración del Sistema
          </h1>
          <p className="text-gray-600">
            Administración y monitoreo del sistema del bot
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Servidor</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {getStatusText(systemStatus.server)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Server className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Base de Datos</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {getStatusText(systemStatus.database)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Backup</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                Programado
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">API</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                Saludable
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Seguridad
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'api'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              API Status
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notificaciones
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración General del Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Sistema
                      </label>
                      <input
                        type="text"
                        defaultValue="Bot IA Management System"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zona Horaria
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option>America/Mexico_City</option>
                        <option>UTC</option>
                        <option>America/New_York</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idioma Predeterminado
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option>Español</option>
                        <option>English</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Modo de Mantenimiento
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input type="radio" name="maintenance" className="mr-2" />
                          <span className="text-sm">Desactivado</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="maintenance" className="mr-2" />
                          <span className="text-sm">Activado</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logs del Sistema
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm">Habilitar logs detallados</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración de Seguridad
                </h3>
                <div className="space-y-4">
                  {securitySettings.map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{setting.name}</h4>
                          {setting.critical && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Crítico
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          setting.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {setting.enabled ? 'Habilitado' : 'Deshabilitado'}
                        </span>
                        <button className="text-primary-600 hover:text-primary-900 text-sm">
                          Configurar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Status */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Estado de los Endpoints de API
                </h3>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint) => (
                    <div key={endpoint.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{endpoint.name}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>Tiempo de respuesta: {endpoint.responseTime}</span>
                          <span>Uptime: {endpoint.uptime}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(endpoint.status)}`}>
                          {getStatusText(endpoint.status)}
                        </span>
                        <button className="text-primary-600 hover:text-primary-900 text-sm">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración de Notificaciones del Sistema
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Alertas de Seguridad</h4>
                      <p className="text-sm text-gray-600">Notificaciones sobre intentos de acceso sospechoso</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">SMS</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Alertas de Sistema</h4>
                      <p className="text-sm text-gray-600">Notificaciones sobre problemas del servidor</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">SMS</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Reportes Diarios</h4>
                      <p className="text-sm text-gray-600">Resumen diario de actividad del sistema</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">SMS</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemSettings 