import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Building, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Target,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  UserPlus,
  Team,
  Activity,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const CompanyDetails: React.FC = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  // Datos mock de la sucursal
  const companyData = {
    id: 1,
    name: 'Sucursal Centro',
    location: 'Ciudad de México',
    address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
    phone: '+52 55 1234 5678',
    email: 'centro@techstart.com',
    manager: 'Carlos López',
    status: 'active',
    performance: 85,
    teams: [
      {
        id: 1,
        name: 'Equipo Marketing Digital',
        members: 5,
        performance: 92,
        engagement: 1250,
        publications: 15
      },
      {
        id: 2,
        name: 'Equipo Ventas',
        members: 6,
        performance: 78,
        engagement: 980,
        publications: 12
      },
      {
        id: 3,
        name: 'Equipo Soporte',
        members: 4,
        performance: 88,
        engagement: 650,
        publications: 8
      }
    ],
    employees: [
      {
        id: 1,
        name: 'Ana García',
        role: 'Marketing Manager',
        team: 'Equipo Marketing Digital',
        performance: 95,
        email: 'ana.garcia@techstart.com',
        status: 'active'
      },
      {
        id: 2,
        name: 'Miguel Torres',
        role: 'Sales Representative',
        team: 'Equipo Ventas',
        performance: 82,
        email: 'miguel.torres@techstart.com',
        status: 'active'
      },
      {
        id: 3,
        name: 'Laura Martínez',
        role: 'Customer Support',
        team: 'Equipo Soporte',
        performance: 90,
        email: 'laura.martinez@techstart.com',
        status: 'active'
      }
    ],
    metrics: {
      totalEngagement: 2880,
      totalPublications: 35,
      totalConversions: 23,
      totalReach: 8500,
      growth: 15
    }
  }

  // Datos para gráficos
  const weeklyData = [
    { week: 'Semana 1', engagement: 1200, publications: 8, conversions: 5 },
    { week: 'Semana 2', engagement: 1350, publications: 10, conversions: 7 },
    { week: 'Semana 3', engagement: 1280, publications: 9, conversions: 6 },
    { week: 'Semana 4', engagement: 1450, publications: 12, conversions: 8 }
  ]

  const teamPerformance = [
    { name: 'Marketing Digital', performance: 92, engagement: 1250 },
    { name: 'Ventas', performance: 78, engagement: 980 },
    { name: 'Soporte', performance: 88, engagement: 650 }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600'
    if (performance >= 80) return 'text-yellow-600'
    if (performance >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  const getPerformanceLevel = (performance: number) => {
    if (performance >= 90) return 'Excelente'
    if (performance >= 80) return 'Muy Bueno'
    if (performance >= 70) return 'Bueno'
    if (performance >= 60) return 'Regular'
    return 'Necesita Mejora'
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {companyData.name}
          </h1>
          <p className="text-gray-600">
            Vista detallada de la sucursal y sus equipos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Reporte</span>
          </button>
        </div>
      </div>

      {/* Información de la Sucursal */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Información de la Sucursal
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Ubicación</p>
                <p className="text-sm text-gray-600">{companyData.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Teléfono</p>
                <p className="text-sm text-gray-600">{companyData.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{companyData.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Manager</p>
                <p className="text-sm text-gray-600">{companyData.manager}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Total</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {companyData.metrics.totalEngagement.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-600">
              +{companyData.metrics.growth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Publicaciones</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {companyData.metrics.totalPublications}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-600">+12%</span>
            <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversiones</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {companyData.metrics.totalConversions}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-600">+8%</span>
            <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rendimiento</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {companyData.performance}%
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${getPerformanceColor(companyData.performance)}`}>
              {getPerformanceLevel(companyData.performance)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'teams'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Equipos ({companyData.teams.length})
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'employees'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Empleados ({companyData.employees.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Resumen */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Evolución */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Evolución Semanal
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="engagement" stroke="#8884d8" name="Engagement" />
                      <Line type="monotone" dataKey="publications" stroke="#82ca9d" name="Publicaciones" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Rendimiento por Equipo */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Rendimiento por Equipo
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teamPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="performance" fill="#8884d8" name="Rendimiento %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Equipos */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companyData.teams.map((team) => (
                  <div key={team.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{team.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPerformanceColor(team.performance)}`}>
                        {team.performance}%
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Miembros:</span>
                        <span className="font-medium">{team.members}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Engagement:</span>
                        <span className="font-medium">{team.engagement.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Publicaciones:</span>
                        <span className="font-medium">{team.publications}</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center justify-center space-x-1">
                      <span>Ver Detalles</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Empleados */}
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empleado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rendimiento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companyData.employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {employee.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {employee.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.team}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                              {employee.performance}%
                            </span>
                            <span className="text-xs text-gray-500">
                              {getPerformanceLevel(employee.performance)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                            {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900">
                            Ver Perfil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Distribución */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Distribución de Actividad
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Marketing', value: 45 },
                          { name: 'Ventas', value: 35 },
                          { name: 'Soporte', value: 20 }
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

                {/* Métricas Detalladas */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Métricas Detalladas
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Tasa de Conversión</span>
                      <span className="text-sm font-semibold text-green-600">2.7%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Alcance Promedio</span>
                      <span className="text-sm font-semibold text-blue-600">2,833</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
                      <span className="text-sm font-semibold text-purple-600">3.4%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Tiempo de Respuesta</span>
                      <span className="text-sm font-semibold text-orange-600">2.3h</span>
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

export default CompanyDetails 