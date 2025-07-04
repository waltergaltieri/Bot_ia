import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Users, Settings, Share2, Bot } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

interface TeamFormData {
  name: string
  description?: string
  managerId: string
  aiSettings: {
    tone: 'professional' | 'casual' | 'friendly' | 'energetic'
    language: string
    includeHashtags: boolean
    maxHashtags: number
    customPrompt?: string
  }
}

const TeamForm: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditing = !!id
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamFormData>({
    defaultValues: {
      aiSettings: {
        tone: 'professional',
        language: 'es',
        includeHashtags: true,
        maxHashtags: 5,
      }
    }
  })

  const includeHashtags = watch('aiSettings.includeHashtags')

  // Cargar datos del equipo si estamos editando
  const { data: teamData } = useQuery(
    ['team', id],
    async () => {
      const response = await api.get(`/teams/${id}`)
      return response.data
    },
    {
      enabled: isEditing,
      onSuccess: (data) => {
        reset({
          name: data.name,
          description: data.description || '',
          managerId: data.managerId,
          aiSettings: {
            tone: data.aiSettings?.tone || 'professional',
            language: data.aiSettings?.language || 'es',
            includeHashtags: data.aiSettings?.includeHashtags ?? true,
            maxHashtags: data.aiSettings?.maxHashtags || 5,
            customPrompt: data.aiSettings?.customPrompt || '',
          }
        })
      },
    }
  )

  // Cargar usuarios que pueden ser managers
  const { data: managers } = useQuery(['managers'], async () => {
    const response = await api.get('/users?roles=admin,manager')
    return response.data
  })

  const createMutation = useMutation(
    (data: TeamFormData) => api.post('/teams', data),
    {
      onSuccess: () => {
        toast.success('Equipo creado exitosamente')
        navigate('/teams')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al crear equipo')
      },
    }
  )

  const updateMutation = useMutation(
    (data: TeamFormData) => api.put(`/teams/${id}`, data),
    {
      onSuccess: () => {
        toast.success('Equipo actualizado exitosamente')
        navigate('/teams')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al actualizar equipo')
      },
    }
  )

  const onSubmit = async (data: TeamFormData) => {
    setIsLoading(true)
    try {
      if (isEditing) {
        updateMutation.mutate(data)
      } else {
        createMutation.mutate(data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const toneOptions = [
    { value: 'professional', label: 'Profesional', description: 'Formal y orientado a negocios' },
    { value: 'casual', label: 'Casual', description: 'Relajado y accesible' },
    { value: 'friendly', label: 'Amigable', description: 'Cálido y personal' },
    { value: 'energetic', label: 'Enérgico', description: 'Dinámico y motivador' },
  ]

  const languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'Inglés' },
    { value: 'fr', label: 'Francés' },
    { value: 'de', label: 'Alemán' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Portugués' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/teams')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Equipo' : 'Nuevo Equipo'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Modifica la configuración del equipo' : 'Crea un nuevo equipo para tu empresa'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del equipo *"
                {...register('name', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                })}
                error={errors.name?.message}
                placeholder="Ej: Equipo de Ventas"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager del equipo *
                </label>
                <select
                  {...register('managerId', { required: 'Selecciona un manager' })}
                  className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Seleccionar manager</option>
                  {managers?.map((manager: any) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} - {manager.email}
                    </option>
                  ))}
                </select>
                {errors.managerId && (
                  <p className="text-sm text-red-600 mt-1">{errors.managerId.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Describe el propósito y objetivos de este equipo..."
                />
              </div>
            </div>
          </div>

          {/* Configuración de IA */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              Configuración de IA
            </h3>
            
            <div className="space-y-6">
              {/* Tono y Idioma */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tono de comunicación *
                  </label>
                  <div className="space-y-3">
                    {toneOptions.map((tone) => (
                      <label key={tone.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value={tone.value}
                          {...register('aiSettings.tone', { required: 'Selecciona un tono' })}
                          className="mt-1 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{tone.label}</p>
                          <p className="text-sm text-gray-500">{tone.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.aiSettings?.tone && (
                    <p className="text-sm text-red-600 mt-1">{errors.aiSettings.tone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma principal *
                  </label>
                  <select
                    {...register('aiSettings.language', { required: 'Selecciona un idioma' })}
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  {errors.aiSettings?.language && (
                    <p className="text-sm text-red-600 mt-1">{errors.aiSettings.language.message}</p>
                  )}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    {...register('aiSettings.includeHashtags')}
                    className="text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Incluir hashtags automáticamente
                  </label>
                </div>
                
                {includeHashtags && (
                  <div className="ml-6">
                    <Input
                      label="Número máximo de hashtags"
                      type="number"
                      min="1"
                      max="30"
                      {...register('aiSettings.maxHashtags', {
                        valueAsNumber: true,
                        min: { value: 1, message: 'Mínimo 1 hashtag' },
                        max: { value: 30, message: 'Máximo 30 hashtags' },
                      })}
                      error={errors.aiSettings?.maxHashtags?.message}
                    />
                  </div>
                )}
              </div>

              {/* Prompt personalizado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt personalizado (opcional)
                </label>
                <textarea
                  {...register('aiSettings.customPrompt')}
                  rows={4}
                  className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Instrucciones adicionales para la IA (ej: siempre mencionar nuestra marca, incluir call-to-action específico, etc.)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Estas instrucciones se añadirán al prompt base para personalizar el contenido generado
                </p>
              </div>
            </div>
          </div>

          {/* Preview de configuración */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Vista previa de configuración</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Tono:</strong> {toneOptions.find(t => t.value === watch('aiSettings.tone'))?.label}</p>
              <p><strong>Idioma:</strong> {languageOptions.find(l => l.value === watch('aiSettings.language'))?.label}</p>
              <p><strong>Hashtags:</strong> {includeHashtags ? `Máximo ${watch('aiSettings.maxHashtags')}` : 'Desactivados'}</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teams')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading || createMutation.isLoading || updateMutation.isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Actualizar Equipo' : 'Crear Equipo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TeamForm 