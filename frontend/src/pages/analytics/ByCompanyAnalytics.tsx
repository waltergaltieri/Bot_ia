import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Users,
  Building,
  Filter,
  Download,
  Calendar,
  Eye,
  Target,
  Share2,
  Heart,
  MessageCircle,
  Repeat,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from 'lucide-react'
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'

const ByCompanyAnalytics: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('engagement')

  const subCompanies = [
    { id: 1, name: 'Sucursal Centro', location: 'Ciudad de México' },
    { id: 2, name: 'Sucursal Norte', location: 'Monterrey' },
    { id: 3, name: 'Sucursal Sur', location: 'Guadalajara' }
  ]

  const companyMetrics = {
    'Sucursal Centro': {
      engagement: 1250,
      publications: 45,
      conversions: 23,
      reach: 8500,
      growth: 15,
      teams: 3,
      employees: 15,
      performance: 85
    },
    'Sucursal Norte': {
      engagement: 980,
      publications: 32,
      conversions: 18,
      reach: 6200,
      growth: 22,
      teams: 2,
      employees: 12,
      performance: 92
    },
    'Sucursal Sur': {
      engagement: 750,
      publications: 28,
      conversions: 12,
      reach: 4800,
      growth: 8,
      teams: 2,
      employees: 8,
      performance: 45
    }
  }

  const overallMetrics = {
    totalEngagement: 2980,
    totalPublications: 105,
    totalConversions: 53,
    totalReach: 19500,
    averageGrowth: 15,
    totalTeams: 7,
    totalEmployees: 35,
    averagePerformance: 74
  }

  const getMetricsForCompany = (companyName: string) => {
    if (companyName === 'all') {
      return overallMetrics
    }
    return companyMetrics[companyName as keyof typeof companyMetrics] || overallMetrics
  }

  const currentMetrics = getMetricsForCompany(selectedCompany)

  const performanceData = [
    { company: 'Sucursal Centro', engagement: 1250, publications: 45, conversions: 23, performance: 85 },
    { company: 'Sucursal Norte', engagement: 980, publications: 32, conversions: 18, performance: 92 },
    { company: 'Sucursal Sur', engagement: 750, publications: 28, conversions: 12, performance: 45 }
  ]

  // Datos para gráficos
  const weeklyData = [
    { week: 'Semana 1', centro: 1200, norte: 950, sur: 700 },
    { week: 'Semana 2', centro: 1300, norte: 1000, sur: 750 },
    { week: 'Semana 3', centro: 1250, norte: 980, sur: 720 },
    { week: 'Semana 4', centro: 1400, norte: 1100, sur: 800 }
  ]

  const engagementBreakdown = [
    { name: 'Likes', centro: 450, norte: 380, sur: 280 },
    { name: 'Comentarios', centro: 320, norte: 250, sur: 180 },
    { name: 'Compartidos', centro: 280, norte: 220, sur: 160 },
    { name: 'Visualizaciones', centro: 200, norte: 130, sur: 130 }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Activa' : 'Inactiva'
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 80) return 'text-green-600'
    if (performance >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceLevel = (performance: number) => {
    if (performance >= 90) return 'Excelente'
    if (performance >= 80) return 'Muy Bueno'
    if (performance >= 70) return 'Bueno'
    if (performance >= 60) return 'Regular'
    return 'Necesita Mejora'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Métricas por Sucursal
          </h1>
          <p className="text-gray-600">
            Análisis detallado del rendimiento de cada sucursal
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm text-gray-600">Sucursal</label>
              <select 
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="ml-2 p-2 border border-gray-300 rounded-md text-sm"
                title="Seleccionar sucursal"
              >
                <option value="all">Todas las sucursales</option>
                {subCompanies.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm text-gray-600">Período</label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="ml-2 p-2 border border-gray-300 rounded-md text-sm"
                title="Seleccionar período"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último año</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Métrica</label>
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="ml-2 p-2 border border-gray-300 rounded-md text-sm"
                title="Seleccionar métrica"
              >
                <option value="engagement">Engagement</option>
                <option value="publications">Publicaciones</option>
                <option value="conversions">Conversiones</option>
                <option value="reach">Alcance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {('engagement' in currentMetrics ? currentMetrics.engagement : currentMetrics.totalEngagement)?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">
              +{companyMetrics[selectedCompany as keyof typeof companyMetrics]?.growth || overallMetrics.averageGrowth}%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Publicaciones</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {'publications' in currentMetrics ? currentMetrics.publications : currentMetrics.totalPublications}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+12%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversiones</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {'conversions' in currentMetrics ? currentMetrics.conversions : currentMetrics.totalConversions}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+8%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alcance</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {('reach' in currentMetrics ? currentMetrics.reach : currentMetrics.totalReach)?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 ml-1">+15%</span>
          </div>
        </div>
      </div>

      {/* Gráficos Avanzados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Línea - Evolución Semanal */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evolución Semanal por Sucursal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="centro" stroke="#8884d8" name="Sucursal Centro" />
              <Line type="monotone" dataKey="norte" stroke="#82ca9d" name="Sucursal Norte" />
              <Line type="monotone" dataKey="sur" stroke="#ffc658" name="Sucursal Sur" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras - Engagement por Tipo */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="centro" fill="#8884d8" name="Sucursal Centro" />
              <Bar dataKey="norte" fill="#82ca9d" name="Sucursal Norte" />
              <Bar dataKey="sur" fill="#ffc658" name="Sucursal Sur" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Comparison Mejorado */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Comparación de Rendimiento Detallada
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sucursal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publicaciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversiones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceData.map((data) => (
                  <tr key={data.company} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {data.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {data.engagement.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {data.publications}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {data.conversions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getPerformanceColor(data.performance)}`}>
                          {data.performance}%
                        </span>
                        <span className="text-xs text-gray-500">
                          {getPerformanceLevel(data.performance)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {companyMetrics[data.company as keyof typeof companyMetrics]?.teams || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {companyMetrics[data.company as keyof typeof companyMetrics]?.employees || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                        title="Ver detalles de la sucursal"
                        onClick={() => navigate(`/sub-companies/${data.company === 'Sucursal Centro' ? 1 : data.company === 'Sucursal Norte' ? 2 : 3}`)}
                      >
                        <span>Ver Detalles</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Análisis Detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pastel - Distribución de Equipos */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución de Equipos por Sucursal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={[
                  { name: 'Sucursal Centro', value: 3 },
                  { name: 'Sucursal Norte', value: 2 },
                  { name: 'Sucursal Sur', value: 2 }
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
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Resumen Ejecutivo Mejorado */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen Ejecutivo
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Mejor Rendimiento</h4>
              <p className="text-sm text-blue-700 mt-1">
                Sucursal Norte con 92% de rendimiento
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Mayor Engagement</h4>
              <p className="text-sm text-green-700 mt-1">
                Sucursal Centro con 1,250 interacciones
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Más Publicaciones</h4>
              <p className="text-sm text-purple-700 mt-1">
                Sucursal Centro con 45 publicaciones
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900">Necesita Atención</h4>
              <p className="text-sm text-orange-700 mt-1">
                Sucursal Sur con 45% de rendimiento
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ByCompanyAnalytics 