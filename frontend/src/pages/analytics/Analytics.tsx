import React, { useState } from 'react'
import { useQuery } from 'react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  Users,
  FileText,
  Share2,
  Eye,
  Heart,
  MessageCircle,
  Repeat,
  Building,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Button from '../../components/ui/Button'
import EngagementChart from '../../components/charts/EngagementChart'
import ActivityChart from '../../components/charts/ActivityChart'

const Analytics: React.FC = () => {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState('30')
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [selectedCompany, setSelectedCompany] = useState('all')

  const { data: analytics, isLoading } = useQuery(
    ['analytics', user?.companyId, dateRange, selectedTeam, selectedCompany],
    async () => {
      const response = await api.get('/analytics', {
        params: {
          days: dateRange,
          teamId: selectedTeam !== 'all' ? selectedTeam : undefined,
          companyId: selectedCompany !== 'all' ? selectedCompany : undefined,
        },
      })
      return response.data
    },
    {
      enabled: !!user?.companyId,
    }
  )

  const { data: teams } = useQuery(['teams'], async () => {
    const response = await api.get('/teams')
    return response.data
  })

  const { data: subCompanies } = useQuery(
    ['sub-companies'],
    async () => {
      const response = await api.get('/sub-companies')
      return response.data
    },
    {
      enabled: user?.role === 'branch_manager',
    }
  )

  const exportData = async () => {
    try {
      const response = await api.get('/analytics/export', {
        params: {
          days: dateRange,
          teamId: selectedTeam !== 'all' ? selectedTeam : undefined,
          companyId: selectedCompany !== 'all' ? selectedCompany : undefined,
        },
        responseType: 'blob',
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `analytics-${dateRange}days.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error exportando datos:', error)
    }
  }

  const getStatsCards = () => {
    if (user?.role === 'branch_manager') {
      return [
        {
          title: 'Total Engagement',
          value: analytics?.totalEngagement || 0,
          change: analytics?.engagementChange || 0,
          icon: TrendingUp,
          color: 'green',
          description: 'Interacciones totales'
        },
        {
          title: 'Publicaciones',
          value: analytics?.totalPublications || 0,
          change: analytics?.publicationsChange || 0,
          icon: FileText,
          color: 'blue',
          description: 'Contenido publicado'
        },
        {
          title: 'Conversiones',
          value: analytics?.totalConversions || 0,
          change: analytics?.conversionsChange || 0,
          icon: Target,
          color: 'purple',
          description: 'Conversiones logradas'
        },
        {
          title: 'Alcance Total',
          value: analytics?.totalReach || 0,
          change: analytics?.reachChange || 0,
          icon: Eye,
          color: 'orange',
          description: 'Personas alcanzadas'
        },
      ]
    } else {
      return [
        {
          title: 'Total Publicaciones',
          value: analytics?.totalPublications || 0,
          change: analytics?.publicationsChange || 0,
          icon: FileText,
          color: 'blue',
        },
        {
          title: 'Total Engagement',
          value: analytics?.totalEngagement || 0,
          change: analytics?.engagementChange || 0,
          icon: TrendingUp,
          color: 'green',
        },
        {
          title: 'Alcance Total',
          value: analytics?.totalReach || 0,
          change: analytics?.reachChange || 0,
          icon: Eye,
          color: 'purple',
        },
        {
          title: 'Usuarios Activos',
          value: analytics?.activeUsers || 0,
          change: analytics?.usersChange || 0,
          icon: Users,
          color: 'yellow',
        },
      ]
    }
  }

  const statsCards = getStatsCards()

  const engagementMetrics = [
    {
      label: 'Likes',
      value: analytics?.engagement?.likes || 0,
      icon: Heart,
      color: 'text-red-500',
    },
    {
      label: 'Comentarios',
      value: analytics?.engagement?.comments || 0,
      icon: MessageCircle,
      color: 'text-blue-500',
    },
    {
      label: 'Compartidos',
      value: analytics?.engagement?.shares || 0,
      icon: Repeat,
      color: 'text-green-500',
    },
    {
      label: 'Visualizaciones',
      value: analytics?.engagement?.views || 0,
      icon: Eye,
      color: 'text-purple-500',
    },
  ]

  // Datos para gráficos
  const chartData = [
    { name: 'Lun', engagement: 400, publications: 2, reach: 2400 },
    { name: 'Mar', engagement: 300, publications: 3, reach: 1398 },
    { name: 'Mié', engagement: 200, publications: 1, reach: 9800 },
    { name: 'Jue', engagement: 278, publications: 4, reach: 3908 },
    { name: 'Vie', engagement: 189, publications: 2, reach: 4800 },
    { name: 'Sáb', engagement: 239, publications: 3, reach: 3800 },
    { name: 'Dom', engagement: 349, publications: 1, reach: 4300 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
            {user?.role === 'branch_manager' ? 'Resultados Generales' : 'Analytics'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'branch_manager' 
              ? 'Análisis detallado de todas tus sucursales y equipos'
              : 'Análisis detallado del rendimiento de tu contenido'
            }
          </p>
        </div>
        
        <Button onClick={exportData} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar Datos
        </Button>
      </div>

      {/* Filtros Mejorados */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Período:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              title="Seleccionar período de tiempo"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 3 meses</option>
              <option value="365">Último año</option>
            </select>
          </div>

          {/* Filtro por Sucursal - Solo para Branch Manager */}
          {user?.role === 'branch_manager' && (
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Sucursal:</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                title="Seleccionar sucursal"
              >
                <option value="all">Todas las sucursales</option>
                {subCompanies?.map((company: any) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Equipo:</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              title="Seleccionar equipo"
            >
              <option value="all">Todos los equipos</option>
              {teams?.map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
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
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                                     {'description' in stat && stat.description && (
                     <p className="text-xs text-gray-500 mt-1">
                       {stat.description}
                     </p>
                   )}
                </div>
                <div className={`p-3 bg-${stat.color}-50 rounded-full`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                {stat.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ml-1 ${
                    stat.change >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}
                >
                  {stat.change >= 0 ? '+' : ''}{stat.change}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs período anterior
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Engagement */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement Semanal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="engagement" stackId="1" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Publicaciones */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Publicaciones por Día
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="publications" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Métricas de Engagement Detalladas */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Métricas de Engagement Detalladas
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementMetrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {metric.value.toLocaleString()}
                  </h4>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Gráfico de Distribución */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribución de Actividad
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Likes', value: 400 },
                { name: 'Comentarios', value: 300 },
                { name: 'Compartidos', value: 200 },
                { name: 'Visualizaciones', value: 100 }
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Analytics 