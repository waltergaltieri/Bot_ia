import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Building, 
  Plus, 
  Users, 
  BarChart3, 
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react'

const SubCompanies: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')

  const subCompanies = [
    {
      id: 1,
      name: 'Sucursal Centro',
      location: 'Ciudad de México',
      manager: 'Carlos López',
      employees: 15,
      status: 'active',
      performance: 85,
      lastActivity: '2024-01-25'
    },
    {
      id: 2,
      name: 'Sucursal Norte',
      location: 'Monterrey',
      manager: 'Ana García',
      employees: 12,
      status: 'active',
      performance: 92,
      lastActivity: '2024-01-24'
    },
    {
      id: 3,
      name: 'Sucursal Sur',
      location: 'Guadalajara',
      manager: 'Miguel Torres',
      employees: 8,
      status: 'inactive',
      performance: 45,
      lastActivity: '2024-01-20'
    }
  ]

  const statsCards = [
    {
      title: 'Total Sucursales',
      value: '3',
      icon: Building,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Sucursales Activas',
      value: '2',
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Total Empleados',
      value: '35',
      icon: Users,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Rendimiento Promedio',
      value: '74%',
      icon: BarChart3,
      color: 'bg-orange-50 text-orange-600'
    },
  ]

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mis Sucursales
          </h1>
          <p className="text-gray-600">
            Gestión y monitoreo de todas tus sucursales
          </p>
        </div>
        
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nueva Sucursal</span>
        </button>
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
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Todas (3)
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activas (2)
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inactive'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Inactivas (1)
            </button>
          </nav>
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
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subCompanies
                  .filter(company => {
                    if (activeTab === 'all') return true
                    if (activeTab === 'active') return company.status === 'active'
                    if (activeTab === 'inactive') return company.status === 'inactive'
                    return true
                  })
                  .map((company) => (
                  <tr key={company.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {company.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.manager}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.employees}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(company.status)}`}>
                        {getStatusText(company.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getPerformanceColor(company.performance)}`}>
                        {company.performance}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(company.lastActivity).toLocaleDateString('es-ES')}
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       <div className="flex space-x-2">
                         <button 
                           className="text-blue-600 hover:text-blue-900"
                           title="Ver detalles"
                           onClick={() => navigate(`/sub-companies/${company.id}`)}
                         >
                           <Eye className="w-4 h-4" />
                         </button>
                         <button 
                           className="text-green-600 hover:text-green-900"
                           title="Editar sucursal"
                         >
                           <Edit className="w-4 h-4" />
                         </button>
                         <button 
                           className="text-red-600 hover:text-red-900"
                           title="Eliminar sucursal"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubCompanies 