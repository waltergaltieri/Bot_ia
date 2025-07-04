import React from 'react'
import { 
  Activity as ActivityIcon, 
  TrendingUp, 
  Users, 
  FileText,
  Share2,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react'

const Activity: React.FC = () => {
  const recentActivity = [
    {
      id: 1,
      type: 'publication',
      title: 'Nueva publicación en Instagram',
      description: 'Sucursal Centro publicó contenido sobre el nuevo producto',
      timestamp: '2024-01-25T10:30:00',
      company: 'Sucursal Centro',
      status: 'completed'
    },
    {
      id: 2,
      type: 'team',
      title: 'Nuevo empleado agregado',
      description: 'María González se unió al equipo de Sucursal Norte',
      timestamp: '2024-01-25T09:15:00',
      company: 'Sucursal Norte',
      status: 'completed'
    },
    {
      id: 3,
      type: 'social',
      title: 'Red social vinculada',
      description: 'Facebook conectado exitosamente',
      timestamp: '2024-01-25T08:45:00',
      company: 'Sucursal Sur',
      status: 'completed'
    },
    {
      id: 4,
      type: 'analytics',
      title: 'Reporte de rendimiento',
      description: 'Métricas actualizadas para el mes de enero',
      timestamp: '2024-01-25T08:00:00',
      company: 'General',
      status: 'completed'
    }
  ]

  const activityStats = [
    {
      title: 'Actividades Hoy',
      value: '12',
      icon: ActivityIcon,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Publicaciones',
      value: '8',
      icon: FileText,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Interacciones',
      value: '156',
      icon: Share2,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Empleados Activos',
      value: '28',
      icon: Users,
      color: 'bg-orange-50 text-orange-600'
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'publication':
        return FileText
      case 'team':
        return Users
      case 'social':
        return Share2
      case 'analytics':
        return TrendingUp
      default:
        return ActivityIcon
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'publication':
        return 'bg-green-100 text-green-800'
      case 'team':
        return 'bg-blue-100 text-blue-800'
      case 'social':
        return 'bg-purple-100 text-purple-800'
      case 'analytics':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Hace unos minutos'
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} horas`
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Actividad Empresarial
          </h1>
          <p className="text-gray-600">
            Monitoreo en tiempo real de todas las actividades
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Última actualización</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleTimeString('es-ES')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activityStats.map((stat) => {
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

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Actividad Reciente
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                        {activity.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs font-medium text-gray-500">
                        Sucursal:
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {activity.company}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Activity 