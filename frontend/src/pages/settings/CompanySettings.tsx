import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { Save, Upload, Trash2, Building, Settings, Users, Shield, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

interface CompanyFormData {
  name: string
  description?: string
  website?: string
  industry?: string
  size?: string
  phone?: string
  address?: string
}

const CompanySettings: React.FC = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [deleteModal, setDeleteModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>()

  // Cargar datos de la empresa
  const { data: company, isLoading } = useQuery(
    ['company', user?.companyId],
    async () => {
      const response = await api.get(`/companies/${user?.companyId}`)
      return response.data
    },
    {
      enabled: !!user?.companyId,
      onSuccess: (data) => {
        reset({
          name: data.name,
          description: data.description || '',
          website: data.website || '',
          industry: data.industry || '',
          size: data.size || '',
          phone: data.phone || '',
          address: data.address || '',
        })
        if (data.logoUrl) {
          setLogoPreview(data.logoUrl)
        }
      },
    }
  )

  // Cargar estadísticas de la empresa
  const { data: stats } = useQuery(
    ['company-stats', user?.companyId],
    async () => {
      const response = await api.get(`/companies/${user?.companyId}/stats`)
      return response.data
    },
    {
      enabled: !!user?.companyId,
    }
  )

  const updateMutation = useMutation(
    (data: CompanyFormData) => api.put(`/companies/${user?.companyId}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['company'])
        toast.success('Empresa actualizada exitosamente')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al actualizar empresa')
      },
    }
  )

  const uploadLogoMutation = useMutation(
    (file: File) => {
      const formData = new FormData()
      formData.append('logo', file)
      return api.post(`/companies/${user?.companyId}/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['company'])
        toast.success('Logo actualizado exitosamente')
        setLogoFile(null)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al subir logo')
      },
    }
  )

  const deleteCompanyMutation = useMutation(
    () => api.delete(`/companies/${user?.companyId}`),
    {
      onSuccess: () => {
        toast.success('Empresa eliminada exitosamente')
        // Redirigir al usuario o cerrar sesión
        window.location.href = '/login'
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al eliminar empresa')
      },
    }
  )

  const onSubmit = async (data: CompanyFormData) => {
    updateMutation.mutate(data)
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = () => {
    if (logoFile) {
      uploadLogoMutation.mutate(logoFile)
    }
  }

  const handleDeleteCompany = () => {
    deleteCompanyMutation.mutate()
    setDeleteModal(false)
  }

  const industryOptions = [
    'Tecnología',
    'Salud',
    'Educación',
    'Finanzas',
    'Retail',
    'Manufactura',
    'Servicios',
    'Inmobiliario',
    'Turismo',
    'Alimentación',
    'Otro',
  ]

  const sizeOptions = [
    '1-10 empleados',
    '11-50 empleados',
    '51-200 empleados',
    '201-500 empleados',
    '501-1000 empleados',
    '1000+ empleados',
  ]

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración de Empresa</h1>
        <p className="text-gray-600">
          Gestiona la información y configuración de tu empresa
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Usuarios</p>
              <p className="text-lg font-semibold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Equipos</p>
              <p className="text-lg font-semibold text-gray-900">{stats?.totalTeams || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Publicaciones</p>
              <p className="text-lg font-semibold text-gray-900">{stats?.totalPublications || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Redes Conectadas</p>
              <p className="text-lg font-semibold text-gray-900">{stats?.connectedAccounts || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información de la Empresa */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Información de la Empresa
              </h3>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre de la empresa *"
                  {...register('name', {
                    required: 'El nombre es requerido',
                  })}
                  error={errors.name?.message}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industria
                  </label>
                  <select
                    {...register('industry')}
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Seleccionar industria</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Sitio web"
                  type="url"
                  placeholder="https://www.empresa.com"
                  {...register('website')}
                  error={errors.website?.message}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño de la empresa
                  </label>
                  <select
                    {...register('size')}
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Seleccionar tamaño</option>
                    {sizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Teléfono"
                  type="tel"
                  placeholder="+34 123 456 789"
                  {...register('phone')}
                  error={errors.phone?.message}
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Describe tu empresa..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <textarea
                    {...register('address')}
                    rows={2}
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Dirección completa de la empresa..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={updateMutation.isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Logo y Configuración */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Logo de la Empresa</h3>
            </div>
            <div className="p-6">
              <div className="text-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo de la empresa"
                    className="w-32 h-32 object-contain mx-auto mb-4 border border-gray-200 rounded-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Building className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                
                <div className="space-y-2">
                  <label htmlFor="logo-upload">
                    <Button variant="outline" size="sm" as="span">
                      <Upload className="w-4 h-4 mr-2" />
                      Seleccionar Logo
                    </Button>
                  </label>
                  
                  {logoFile && (
                    <div>
                      <Button
                        size="sm"
                        onClick={handleLogoUpload}
                        loading={uploadLogoMutation.isLoading}
                      >
                        Subir Logo
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Formato recomendado: PNG o JPG, máximo 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Información de la cuenta */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Información de la Cuenta</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha de creación</p>
                <p className="text-sm text-gray-900">
                  {company?.createdAt ? new Date(company.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : '-'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">ID de la empresa</p>
                <p className="text-sm text-gray-900 font-mono">{company?.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Estado</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  company?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {company?.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>

          {/* Zona de Peligro */}
          <div className="bg-white rounded-lg shadow border border-red-200">
            <div className="p-6 border-b border-red-200">
              <h3 className="text-lg font-semibold text-red-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Zona de Peligro
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Eliminar Empresa</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Esta acción eliminará permanentemente toda la empresa, incluyendo todos los usuarios, 
                    equipos, publicaciones y datos asociados.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Empresa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Eliminar Empresa"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleteCompanyMutation.isLoading}
              onClick={handleDeleteCompany}
            >
              Eliminar Permanentemente
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">¡Advertencia!</p>
              <p className="text-sm text-red-700">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Al eliminar la empresa se perderán permanentemente:
          </p>
          
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Todos los usuarios y sus datos</li>
            <li>Todos los equipos y configuraciones</li>
            <li>Todas las publicaciones e historiales</li>
            <li>Conexiones a redes sociales</li>
            <li>Métricas y analytics</li>
          </ul>
          
          <p className="text-gray-600">
            Escribe <strong>"{company?.name}"</strong> para confirmar:
          </p>
          
          <Input
            placeholder={`Escribe "${company?.name}" para confirmar`}
            className="font-mono"
          />
        </div>
      </Modal>
    </div>
  )
}

export default CompanySettings 