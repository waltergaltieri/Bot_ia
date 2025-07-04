import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, Building2, User, Mail, Phone, Save } from 'lucide-react'
import api from '../../services/api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

interface CompanyFormData {
  name: string
  description?: string
  logoUrl?: string
  branchManagerEmail?: string
  branchManagerName?: string
  branchManagerPhone?: string
  branchManagerPassword?: string
}

const CompanyForm: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const isEditing = !!id
  const [isLoading, setIsLoading] = useState(false)

  // Solo Super Admin puede acceder a esta página
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">No tienes permisos para acceder a esta página</p>
      </div>
    )
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>()

  // Cargar datos de la empresa si estamos editando
  const { data: companyData } = useQuery(
    ['company', id],
    async () => {
      const response = await api.get(`/companies/${id}`)
      return response.data
    },
    {
      enabled: isEditing,
      onSuccess: (data) => {
        reset({
          name: data.name,
          description: data.description || '',
          logoUrl: data.logoUrl || '',
        })
      },
    }
  )

  const createMutation = useMutation(
    (data: CompanyFormData) => api.post('/companies', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['companies'])
        toast.success('Empresa creada exitosamente')
        navigate('/companies')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al crear empresa')
      },
    }
  )

  const updateMutation = useMutation(
    (data: CompanyFormData) => api.put(`/companies/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['companies'])
        queryClient.invalidateQueries(['company', id])
        toast.success('Empresa actualizada exitosamente')
        navigate('/companies')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al actualizar empresa')
      },
    }
  )

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true)
    try {
      // Limpiar campos vacíos
      const cleanData = { ...data }
      if (!cleanData.description) delete cleanData.description
      if (!cleanData.logoUrl) delete cleanData.logoUrl
      
      // Para nuevas empresas, si se proporciona info del branch manager, también enviarlo
      if (!isEditing) {
        if (!cleanData.branchManagerEmail) delete cleanData.branchManagerEmail
        if (!cleanData.branchManagerName) delete cleanData.branchManagerName
        if (!cleanData.branchManagerPhone) delete cleanData.branchManagerPhone
        if (!cleanData.branchManagerPassword) delete cleanData.branchManagerPassword
      }

      if (isEditing) {
        updateMutation.mutate(cleanData)
      } else {
        createMutation.mutate(cleanData)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/companies')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Actualiza la información de la empresa' : 'Crea una nueva empresa en el sistema'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Información de la Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Nombre de la empresa *"
                  {...register('name', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 2,
                      message: 'El nombre debe tener al menos 2 caracteres',
                    },
                  })}
                  error={errors.name?.message}
                  icon={<Building2 className="w-4 h-4" />}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Descripción"
                  {...register('description')}
                  error={errors.description?.message}
                  helperText="Breve descripción de la empresa"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="URL del logo"
                  type="url"
                  {...register('logoUrl')}
                  error={errors.logoUrl?.message}
                  helperText="URL de la imagen del logo de la empresa"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Branch Manager - Solo para nuevas empresas */}
        {!isEditing && (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Gerente de Sucursal (Opcional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Si proporcionas esta información, se creará automáticamente un usuario Gerente de Sucursal para esta empresa.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre completo"
                  {...register('branchManagerName')}
                  error={errors.branchManagerName?.message}
                  icon={<User className="w-4 h-4" />}
                />

                <Input
                  label="Email"
                  type="email"
                  {...register('branchManagerEmail')}
                  error={errors.branchManagerEmail?.message}
                  icon={<Mail className="w-4 h-4" />}
                />

                <Input
                  label="Teléfono"
                  type="tel"
                  {...register('branchManagerPhone')}
                  error={errors.branchManagerPhone?.message}
                  icon={<Phone className="w-4 h-4" />}
                />

                <Input
                  label="Contraseña"
                  type="password"
                  {...register('branchManagerPassword')}
                  error={errors.branchManagerPassword?.message}
                  helperText="La contraseña del gerente de sucursal"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/companies')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Actualizar' : 'Crear'} Empresa
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CompanyForm 