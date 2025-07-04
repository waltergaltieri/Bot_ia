import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  Settings, 
  Share2,
  Bot,
  Calendar,
  Activity,
  FileText,
  TrendingUp,
  Shield
} from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

const TeamDetails: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  const { data: team, isLoading } = useQuery(
    ['team', id],
    async () => {
      const response = await api.get(`/teams/${id}`)
      return response.data
    },
    {
      enabled: !!id,
    }
  )

  const { data: teamStats } = useQuery(
    ['team-stats', id],
    async () => {
      const response = await api.get(`/teams/${id}/stats`)
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

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Equipo no encontrado</p>
      </div>
    )
  }

  const getToneLabel = (tone: string) => {
    switch (tone) {
      case 'professional':
        return 'Profesional'
      case 'casual':
        return 'Casual'
      case 'friendly':
        return 'Amigable'
      case 'energetic':
        return 'Enérgico'
      default:
        return tone
    }
  }

  const getToneBadgeColor = (tone: string) => {
    switch (tone) {
      case 'professional':
        return 'bg-blue-100 text-blue-800'
      case 'casual':
        return 'bg-green-100 text-green-800'
      case 'friendly':
        return 'bg-yellow-100 text-yellow-800'
      case 'energetic':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return '💼'
      case 'instagram':
        return '📸'
      case 'tiktok':
        return '🎵'
      default:
        return '📱'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/teams')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalles del Equipo</h1>
            <p className="text-gray-600">Información completa del equipo</p>
          </div>
        </div>

        {(currentUser?.role === 'admin' || currentUser?.id === team.managerId) && (
          <Link to={`/teams/${team.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Equipo */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
                  <p className="text-gray-600">{team.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Manager</p>
                      <p className="text-gray-900">{team.managerName || 'Manager'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Miembros</p>
                      <p className="text-gray-900">{team.memberCount || 0} usuarios</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Creado</p>
                      <p className="text-gray-900">
                        {new Date(team.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estado</p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          team.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {team.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración de IA */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Configuración de IA
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Tono</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getToneBadgeColor(team.aiSettings?.tone || 'professional')}`}
                  >
                    {getToneLabel(team.aiSettings?.tone || 'professional')}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Idioma</p>
                  <p className="text-gray-900">{team.aiSettings?.language === 'es' ? 'Español' : team.aiSettings?.language}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Hashtags</p>
                  <p className="text-gray-900">
                    {team.aiSettings?.includeHashtags 
                      ? `Hasta ${team.aiSettings.maxHashtags} hashtags` 
                      : 'Desactivados'
                    }
                  </p>
                </div>
              </div>

              {team.aiSettings?.customPrompt && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Prompt personalizado</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-900">{team.aiSettings.customPrompt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Redes Sociales Conectadas
              </h3>
            </div>
            <div className="p-6">
              {team.socialAccounts && team.socialAccounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.socialAccounts.map((account, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{getPlatformIcon(account.platform)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">{account.platform}</p>
                        <p className="text-sm text-gray-600">{account.accountName}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          account.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {account.isActive ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay redes sociales conectadas
                </p>
              )}
            </div>
          </div>

          {/* Miembros del Equipo */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Miembros del Equipo</h3>
            </div>
            <div className="p-6">
              {team.members && team.members.length > 0 ? (
                <div className="space-y-3">
                  {team.members.map((member: any) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          member.role === 'manager' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {member.role === 'manager' ? 'Manager' : 'Empleado'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay miembros asignados a este equipo
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
                  {teamStats?.totalPublications || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Engagement</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {teamStats?.totalEngagement || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Promedio/mes</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {teamStats?.averagePerMonth || 0}
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
              {teamStats?.recentPublications?.length > 0 ? (
                <div className="space-y-3">
                  {teamStats.recentPublications.map((publication: any, index: number) => (
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

export default TeamDetails 