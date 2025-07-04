import React from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const Sales: React.FC = () => {
  const salesData = [
    {
      id: 1,
      client: 'Grupo Empresarial Rodríguez',
      plan: 'Premium',
      amount: 2500,
      status: 'completed',
      date: '2024-01-15',
      salesRep: 'Ana García'
    },
    {
      id: 2,
      client: 'Corporación Innovación Digital',
      plan: 'Enterprise',
      amount: 5000,
      status: 'completed',
      date: '2024-01-20',
      salesRep: 'Carlos López'
    },
    {
      id: 3,
      client: 'Holding Marketing Pro',
      plan: 'Premium',
      amount: 3000,
      status: 'pending',
      date: '2024-01-25',
      salesRep: 'María Rodríguez'
    }
  ]

  const statsCards = [
    {
      title: 'Ventas del Mes',
      value: '$10,500',
      change: '+25%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Clientes Nuevos',
      value: '3',
      change: '+50%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Tasa de Conversión',
      value: '68%',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Target,
    },
    {
      title: 'Valor Promedio',
      value: '$3,500',
      change: '+8%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Ventas
          </h1>
          <p className="text-gray-600">
            Administración de ventas y clientes del bot
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Período actual</p>
          <p className="text-sm font-medium text-gray-900">
            Enero 2024
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

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Ventas Recientes
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendedor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesData.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.client}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {sale.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${sale.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sale.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sale.status === 'completed' ? 'Completada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.salesRep}
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

export default Sales 