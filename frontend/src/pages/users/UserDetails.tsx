import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  Shield, 
  Users, 
  Calendar,
  Activity,
  FileText,
  TrendingUp
} from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

const UserDetails: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  const { data: user, isLoading } = useQuery(
    ['user', id],
    async () => {
      const response = await api.get(`/users/${id}`)
      return response.data
    },
    {
      enabled: !!id,
    }
  )

  const { data: userStats } = useQuery(
    ['user-stats', id],
    async () => {
      const response = await api.get(`/users/${id}/stats`)
      return response.data
    },
    {
      enabled: !!id,
    }
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Usuario no encontrado</p>
      </div>
    )
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'branch_manager':
        return 'Gerente de Sucursal'
      case 'manager':
        return 'Manager'
      case 'employee':
        return 'Empleado'
      default:
        return role
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800'
      case 'branch_manager':
        return 'bg-purple-100 text-purple-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'employee':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/users')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalles del Usuario</h1>
            <p className="text-gray-600">Información completa del usuario</p>
          </div>
        </div>

        {(currentUser?.role === 'branch_manager' || currentUser?.role === 'super_admin' || currentUser?.id === user.id) && (
          <Link to={`/users/${user.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Usuario */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Teléfono</p>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {user.teamId && (
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Equipo</p>
                        <p className="text-gray-900">{user.teamName || `Equipo ${user.teamId}`}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Miembro desde</p>
                      <p className="text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Estado:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              {userStats?.recentActivity?.length > 0 ? (
                <div className="space-y-4">
                  {userStats.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay actividad reciente
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Publicaciones</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {userStats?.totalPublications || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Engagement</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {userStats?.totalEngagement || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Promedio/mes</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {userStats?.averagePerMonth || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Publicaciones Recientes */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Últimas Publicaciones</h3>
            </div>
            <div className="p-6">
              {userStats?.recentPublications?.length > 0 ? (
                <div className="space-y-3">
                  {userStats.recentPublications.map((publication: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary-500 pl-3">
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {publication.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {publication.platform} • {publication.date}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Sin publicaciones aún
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails 