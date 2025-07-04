import React from 'react'
import { useQuery } from 'react-query'
import { 
  Users, 
  Settings, 
  TrendingUp, 
  FileText, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Building2,
  Globe,
  Activity,
  Target,
  DollarSign,
  Shield,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import EngagementChart from '../components/charts/EngagementChart'
import ActivityChart from '../components/charts/ActivityChart'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  const { data: metrics, isLoading } = useQuery(
    ['dashboard-metrics', user?.companyId],
    async () => {
      const response = await api.get('/metrics/dashboard')
      return response.data
    },
    {
      enabled: !!user?.companyId,
    }
  )

  const { data: companies, isLoading: companiesLoading } = useQuery(
    ['companies'],
    async () => {
      const response = await api.get('/companies')
      return response.data
    },
    {
      enabled: user?.role === 'super_admin',
    }
  )

  const { data: subCompanies, isLoading: subCompaniesLoading } = useQuery(
    ['sub-companies'],
    async () => {
      const response = await api.get('/sub-companies')
      return response.data
    },
    {
      enabled: user?.role === 'branch_manager',
    }
  )

  const { data: allUsers, isLoading: usersLoading } = useQuery(
    ['all-users'],
    async () => {
      const response = await api.get('/users')
      return response.data
    },
    {
      enabled: user?.role === 'super_admin',
    }
  )

  // Stats cards diferentes según el rol
  const getStatsCards = () => {
    if (user?.role === 'super_admin') {
      return [
        {
          title: 'Clientes Activos',
          value: companies?.length || 0,
          change: '+2',
          changeType: 'positive' as const,
          icon: Building2,
          description: 'Clientes que compraron nuestro bot'
        },
        {
          title: 'Ingresos Mensuales',
          value: metrics?.totalRevenue || '$45K',
          change: '+15%',
          changeType: 'positive' as const,
          icon: DollarSign,
          description: 'Ingresos por ventas del bot'
        },
        {
          title: 'Sucursales Totales',
          value: metrics?.totalSubCompanies || 0,
          change: '+8',
          changeType: 'positive' as const,
          icon: Globe,
          description: 'Sucursales de todos los clientes'
        },
        {
          title: 'Tasa de Retención',
          value: '94%',
          change: '+2%',
          changeType: 'positive' as const,
          icon: TrendingUp,
          description: 'Clientes que renuevan'
        },
      ]
    } else if (user?.role === 'branch_manager') {
      return [
        {
          title: 'Mis Sucursales',
          value: subCompanies?.length || 0,
          change: '+1',
          changeType: 'positive' as const,
          icon: Building2,
          description: 'Sucursales activas'
        },
        {
          title: 'Engagement Total',
          value: metrics?.totalEngagement || '2.4K',
          change: '+18%',
          changeType: 'positive' as const,
          icon: TrendingUp,
          description: 'Interacciones totales'
        },
        {
          title: 'Publicaciones',
          value: metrics?.totalPublications || 0,
          change: '+25%',
          changeType: 'positive' as const,
          icon: FileText,
          description: 'Contenido publicado'
        },
        {
          title: 'Conversiones',
          value: `${metrics?.conversionRate || 12.5}%`,
          change: '+5%',
          changeType: 'positive' as const,
          icon: Target,
          description: 'Tasa de conversión'
        },
      ]
    } else {
      // Dashboard para Managers y Employees
      return [
        {
          title: 'Publicaciones Totales',
          value: metrics?.totalPublications || 0,
          change: '+12%',
          changeType: 'positive' as const,
          icon: FileText,
          description: 'Contenido publicado'
        },
        {
          title: 'Engagement Total',
          value: metrics?.totalEngagement || 0,
          change: '+8%',
          changeType: 'positive' as const,
          icon: TrendingUp,
          description: 'Interacciones totales'
        },
        {
          title: 'Usuarios Activos',
          value: metrics?.activeUsers || 0,
          change: '+5%',
          changeType: 'positive' as const,
          icon: Users,
          description: 'Empleados activos'
        },
        {
          title: 'Tasa de Conversión',
          value: `${metrics?.conversionRate || 0}%`,
          change: '-2%',
          changeType: 'negative' as const,
          icon: Target,
          description: 'Conversiones del mes'
        },
      ]
    }
  }

  const statsCards = getStatsCards()

  if (isLoading || 
      (user?.role === 'super_admin' && (companiesLoading || usersLoading)) ||
      (user?.role === 'branch_manager' && subCompaniesLoading)
  ) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'super_admin' ? 'Dashboard de Ventas' : 
             user?.role === 'branch_manager' ? 'Dashboard Empresarial' : 'Dashboard'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'super_admin' 
              ? 'Administración de ventas y clientes del bot'
              : user?.role === 'branch_manager'
              ? 'Gestión de tus sucursales y resultados'
              : 'Resumen de la actividad de tu empresa'
            }
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Última actualización</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleString('es-ES')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  {stat.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs mes anterior
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Super Admin Specific Content */}
      {user?.role === 'super_admin' && (
        <>
          {/* Companies Overview */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Clientes Activos
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companies?.map((company: any) => (
                  <div key={company.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{company.name}</h4>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Cliente Activo
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📍 {company.address || 'Dirección no especificada'}</p>
                      <p>📧 {company.email}</p>
                      <p>📞 {company.phone || 'Teléfono no especificado'}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Sucursales:</span>
                        <span className="font-medium">
                          {subCompanies?.filter((c: any) => c.parentCompanyId === company.id).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Plan:</span>
                        <span className="font-medium text-blue-600">Premium</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Estado del Sistema
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Servidor Principal</span>
                  </div>
                  <span className="text-sm text-green-600">Operativo</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Base de Datos</span>
                  </div>
                  <span className="text-sm text-green-600">Conectada</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Backup Automático</span>
                  </div>
                  <span className="text-sm text-yellow-600">En progreso</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Alertas Recientes
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Alto uso de CPU</p>
                    <p className="text-xs text-red-600">Servidor de InnovateTech Hub - 2h atrás</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Nuevo usuario registrado</p>
                    <p className="text-xs text-blue-600">Digital Marketing Pro - 5h atrás</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Branch Manager Specific Content */}
      {user?.role === 'branch_manager' && (
        <>
          {/* Sub-Companies Overview */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Mis Sucursales
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subCompanies?.map((subCompany: any) => (
                  <div key={subCompany.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{subCompany.name}</h4>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Activa
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📍 {subCompany.address || 'Dirección no especificada'}</p>
                      <p>📧 {subCompany.email}</p>
                      <p>📞 {subCompany.phone || 'Teléfono no especificado'}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Equipos:</span>
                        <span className="font-medium">
                          {metrics?.totalTeams || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Engagement:</span>
                        <span className="font-medium text-green-600">+18%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics Filters */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Filtros de Métricas
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sucursal</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Todas las sucursales</option>
                    {subCompanies?.map((subCompany: any) => (
                      <option key={subCompany.id}>{subCompany.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Período</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Último mes</option>
                    <option>Últimos 3 meses</option>
                    <option>Último año</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Métrica</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Engagement</option>
                    <option>Publicaciones</option>
                    <option>Conversiones</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Equipo</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Todos los equipos</option>
                    <option>Equipo Desarrollo</option>
                    <option>Equipo Marketing</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Charts - Solo para roles no Super Admin */}
      {user?.role !== 'super_admin' && user?.role !== 'branch_manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Engagement por Plataforma
            </h3>
            <EngagementChart data={metrics?.engagementByPlatform || {}} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actividad Semanal
            </h3>
            <ActivityChart data={metrics?.weeklyActivity || []} />
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {user?.role === 'super_admin' ? 'Actividad Corporativa Reciente' : 
             user?.role === 'branch_manager' ? 'Actividad Empresarial Reciente' : 'Actividad Reciente'}
          </h3>
        </div>
        <div className="p-6">
          {metrics?.recentActivity?.length > 0 ? (
            <div className="space-y-4">
              {metrics.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {user?.role === 'super_admin' 
                ? 'No hay actividad corporativa reciente'
                : user?.role === 'branch_manager'
                ? 'No hay actividad empresarial reciente'
                : 'No hay actividad reciente'
              }
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 