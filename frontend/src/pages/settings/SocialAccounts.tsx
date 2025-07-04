import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Settings
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

interface SocialAccount {
  id: string
  platform: 'linkedin' | 'instagram' | 'tiktok'
  accountName: string
  accountId: string
  isActive: boolean
  expiresAt?: string
  lastSync?: string
}

const SocialAccounts: React.FC = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [connectModal, setConnectModal] = useState<{ isOpen: boolean; platform?: string }>({
    isOpen: false,
  })
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; accountId?: string }>({
    isOpen: false,
  })

  const { data: accounts, isLoading } = useQuery(
    ['social-accounts', user?.companyId],
    async () => {
      const response = await api.get('/social-accounts')
      return response.data
    }
  )

  const { data: teams } = useQuery(['teams'], async () => {
    const response = await api.get('/teams')
    return response.data
  })

  const connectMutation = useMutation(
    (data: { platform: string; teamId?: string }) => 
      api.post('/social-accounts/connect', data),
    {
      onSuccess: (response) => {
        // Redirigir a la URL de autorización
        window.location.href = response.data.authUrl
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al conectar cuenta')
      },
    }
  )

  const disconnectMutation = useMutation(
    (accountId: string) => api.delete(`/social-accounts/${accountId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['social-accounts'])
        toast.success('Cuenta desconectada exitosamente')
        setDeleteModal({ isOpen: false })
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al desconectar cuenta')
      },
    }
  )

  const refreshMutation = useMutation(
    (accountId: string) => api.post(`/social-accounts/${accountId}/refresh`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['social-accounts'])
        toast.success('Token renovado exitosamente')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al renovar token')
      },
    }
  )

  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Conecta tu página de empresa de LinkedIn',
      color: 'bg-blue-600',
      icon: '💼',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Conecta tu cuenta de Instagram Business',
      color: 'bg-pink-600',
      icon: '📸',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Conecta tu cuenta de TikTok for Business',
      color: 'bg-black',
      icon: '🎵',
    },
  ]

  const getConnectedAccount = (platformId: string) => {
    return accounts?.find((account: SocialAccount) => account.platform === platformId)
  }

  const isTokenExpired = (account: SocialAccount) => {
    if (!account.expiresAt) return false
    return new Date(account.expiresAt) < new Date()
  }

  const handleConnect = (platform: string) => {
    setConnectModal({ isOpen: true, platform })
  }

  const handleConfirmConnect = (teamId?: string) => {
    if (connectModal.platform) {
      connectMutation.mutate({
        platform: connectModal.platform,
        teamId,
      })
      setConnectModal({ isOpen: false })
    }
  }

  const handleDisconnect = (accountId: string) => {
    setDeleteModal({ isOpen: true, accountId })
  }

  const handleConfirmDisconnect = () => {
    if (deleteModal.accountId) {
      disconnectMutation.mutate(deleteModal.accountId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cuentas de Redes Sociales</h1>
        <p className="text-gray-600">
          Conecta tus cuentas de redes sociales para publicar contenido automáticamente
        </p>
      </div>

      {/* Connected Accounts */}
      {accounts && accounts.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Cuentas Conectadas</h3>
          </div>
          <div className="p-6 space-y-4">
            {accounts.map((account: SocialAccount) => {
              const platform = platforms.find(p => p.id === account.platform)
              const isExpired = isTokenExpired(account)
              
              return (
                <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${platform?.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {platform?.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {platform?.name} - {account.accountName}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm">
                        {account.isActive && !isExpired ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">Conectado</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-600">
                              {isExpired ? 'Token expirado' : 'Desconectado'}
                            </span>
                          </>
                        )}
                        {account.lastSync && (
                          <span className="text-gray-500">
                            • Última sincronización: {new Date(account.lastSync).toLocaleString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isExpired && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refreshMutation.mutate(account.id)}
                        loading={refreshMutation.isLoading}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Renovar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Plataformas Disponibles</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const connectedAccount = getConnectedAccount(platform.id)
              
              return (
                <div key={platform.id} className="border border-gray-200 rounded-lg p-6 text-center">
                  <div className={`w-16 h-16 ${platform.color} rounded-lg flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    {platform.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{platform.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                  
                  {connectedAccount ? (
                    <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Conectado</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(platform.id)}
                      loading={connectMutation.isLoading}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Conectar
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Guía de Integración</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>LinkedIn:</strong> Necesitas ser administrador de la página de empresa</p>
          <p>• <strong>Instagram:</strong> Debe ser una cuenta de Instagram Business</p>
          <p>• <strong>TikTok:</strong> Requiere una cuenta de TikTok for Business</p>
        </div>
        <div className="mt-4">
          <a
            href="#"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            Ver documentación completa
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>

      {/* Connect Modal */}
      <Modal
        isOpen={connectModal.isOpen}
        onClose={() => setConnectModal({ isOpen: false })}
        title={`Conectar ${platforms.find(p => p.id === connectModal.platform)?.name}`}
        footer={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setConnectModal({ isOpen: false })}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => handleConfirmConnect()}
              loading={connectMutation.isLoading}
            >
              Conectar Cuenta
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Serás redirigido al sitio web de {platforms.find(p => p.id === connectModal.platform)?.name} 
            para autorizar la conexión.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Asegúrate de tener los permisos necesarios para conectar esta cuenta.
            </p>
          </div>
        </div>
      </Modal>

      {/* Disconnect Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Desconectar Cuenta"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={disconnectMutation.isLoading}
              onClick={handleConfirmDisconnect}
            >
              Desconectar
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          ¿Estás seguro de que quieres desconectar esta cuenta? No podrás publicar contenido 
          en esta plataforma hasta que la reconectes.
        </p>
      </Modal>
    </div>
  )
}

export default SocialAccounts 