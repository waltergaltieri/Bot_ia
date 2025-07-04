import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { 
  Filter, 
  Search, 
  Eye, 
  MessageCircle, 
  Heart, 
  Share2, 
  ExternalLink,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { Publication } from '../../types'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'

const PublicationsList: React.FC = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)

  const { data: publications, isLoading } = useQuery(
    ['publications', user?.companyId, statusFilter, platformFilter],
    async () => {
      const response = await api.get('/publications', {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          platform: platformFilter !== 'all' ? platformFilter : undefined,
        },
      })
      return response.data
    }
  )

  const { data: teams } = useQuery(['teams'], async () => {
    const response = await api.get('/teams')
    return response.data
  })

  const filteredPublications = publications?.filter((pub: Publication) =>
    pub.generatedContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.platform.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado'
      case 'pending':
        return 'Pendiente'
      case 'approved':
        return 'Aprobado'
      case 'failed':
        return 'Fallido'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Publicaciones</h1>
        <p className="text-gray-600">
          Gestiona y monitorea todas las publicaciones de contenido ({filteredPublications.length} publicaciones)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="published">Publicados</option>
            <option value="failed">Fallidos</option>
          </select>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="all">Todas las plataformas</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: publications?.length || 0, color: 'blue' },
          { 
            label: 'Publicados', 
            value: publications?.filter((p: Publication) => p.status === 'published').length || 0, 
            color: 'green' 
          },
          { 
            label: 'Pendientes', 
            value: publications?.filter((p: Publication) => p.status === 'pending').length || 0, 
            color: 'yellow' 
          },
          { 
            label: 'Fallidos', 
            value: publications?.filter((p: Publication) => p.status === 'failed').length || 0, 
            color: 'red' 
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Publications Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublications.map((publication: Publication) => (
            <div
              key={publication.id}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPublication(publication)}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPlatformIcon(publication.platform)}</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {publication.platform}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(publication.status)}
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(publication.status)}`}
                    >
                      {getStatusLabel(publication.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <User className="w-3 h-3" />
                  <span>{publication.userName || 'Usuario'}</span>
                  <Calendar className="w-3 h-3 ml-2" />
                  <span>{new Date(publication.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-gray-900 line-clamp-4 mb-4">
                  {publication.generatedContent}
                </p>

                {/* Engagement Stats */}
                {publication.engagementData && publication.status === 'published' && (
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <Heart className="w-4 h-4 text-red-500 mb-1" />
                      <span className="text-xs text-gray-600">
                        {publication.engagementData.likes}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageCircle className="w-4 h-4 text-blue-500 mb-1" />
                      <span className="text-xs text-gray-600">
                        {publication.engagementData.comments}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Share2 className="w-4 h-4 text-green-500 mb-1" />
                      <span className="text-xs text-gray-600">
                        {publication.engagementData.shares}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Eye className="w-4 h-4 text-purple-500 mb-1" />
                      <span className="text-xs text-gray-600">
                        {publication.engagementData.views || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPublications.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron publicaciones</p>
        </div>
      )}

      {/* Publication Detail Modal */}
      <Modal
        isOpen={!!selectedPublication}
        onClose={() => setSelectedPublication(null)}
        title="Detalles de Publicación"
        size="lg"
      >
        {selectedPublication && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getPlatformIcon(selectedPublication.platform)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {selectedPublication.platform}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedPublication.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {getStatusIcon(selectedPublication.status)}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPublication.status)}`}
                >
                  {getStatusLabel(selectedPublication.status)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contenido Generado</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedPublication.generatedContent}
                </p>
              </div>
            </div>

            {/* Media */}
            {selectedPublication.originalMediaUrl && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Media Original</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <img
                    src={selectedPublication.originalMediaUrl}
                    alt="Media original"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Engagement Data */}
            {selectedPublication.engagementData && selectedPublication.status === 'published' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Métricas de Engagement</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPublication.engagementData.likes}
                    </p>
                    <p className="text-xs text-gray-600">Likes</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPublication.engagementData.comments}
                    </p>
                    <p className="text-xs text-gray-600">Comentarios</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Share2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPublication.engagementData.shares}
                    </p>
                    <p className="text-xs text-gray-600">Compartidos</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Eye className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPublication.engagementData.views || 0}
                    </p>
                    <p className="text-xs text-gray-600">Visualizaciones</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedPublication.status === 'published' && (
              <div className="flex justify-center">
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver en {selectedPublication.platform}
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PublicationsList 