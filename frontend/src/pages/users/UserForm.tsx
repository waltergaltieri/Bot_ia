import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, User, Mail, Phone, Shield, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

interface UserFormData {
  name: string
  email: string
  phone?: string
  role: 'admin' | 'manager' | 'employee' | 'branch_manager' | 'super_admin'
  teamId?: string
  password?: string
  confirmPassword?: string
}

const UserForm: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const isEditing = !!id
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormData>()

  const password = watch('password')

  // Cargar datos del usuario si estamos editando
  const { data: userData } = useQuery(
    ['user', id],
    async () => {
      const response = await api.get(`/users/${id}`)
      return response.data
    },
    {
      enabled: isEditing,
      onSuccess: (data) => {
        reset({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          role: data.role,
          teamId: data.teamId || '',
        })
      },
    }
  )

  // Cargar equipos disponibles
  const { data: teams } = useQuery(['teams'], async () => {
    const response = await api.get('/teams')
    return response.data
  })

  const createMutation = useMutation(
    (data: UserFormData) => api.post('/users', data),
    {
      onSuccess: () => {
        toast.success('Usuario creado exitosamente')
        navigate('/users')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al crear usuario')
      },
    }
  )

  const updateMutation = useMutation(
    (data: UserFormData) => api.put(`/users/${id}`, data),
    {
      onSuccess: () => {
        toast.success('Usuario actualizado exitosamente')
        navigate('/users')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al actualizar usuario')
      },
    }
  )

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    try {
      // Limpiar campos vacíos
      const cleanData = { ...data }
      if (!cleanData.phone) delete cleanData.phone
      if (!cleanData.teamId) delete cleanData.teamId
      if (isEditing && !cleanData.password) {
        delete cleanData.password
        delete cleanData.confirmPassword
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

  const roleOptions = [
    { value: 'employee', label: 'Empleado', description: 'Puede enviar contenido y ver sus publicaciones' },
    { value: 'manager', label: 'Manager', description: 'Gestiona equipos y ve analytics de su equipo' },
    { value: 'branch_manager', label: 'Gerente de Sucursal', description: 'Gestiona toda la sucursal, equipos y usuarios' },
    { value: 'super_admin', label: 'Super Admin', description: 'Acceso completo a todas las sucursales y empresas' },
  ]

  // Filtrar roles según el usuario actual
  const availableRoles = roleOptions.filter(role => {
    // Solo Super Admin puede crear otros Super Admins
    if (role.value === 'super_admin' && currentUser?.role !== 'super_admin') {
      return false
    }
    
    // Super Admin puede crear cualquier rol
    if (currentUser?.role === 'super_admin') return true
    
    // Branch Manager puede crear managers y empleados
    if (currentUser?.role === 'branch_manager') {
      return ['manager', 'employee'].includes(role.value)
    }
    
    // Manager solo puede crear empleados
    if (currentUser?.role === 'manager') {
      return role.value === 'employee'
    }
    
    return false
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/users')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Modifica los datos del usuario' : 'Crea un nuevo usuario para tu empresa'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre completo *"
                {...register('name', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                  },
                })}
                error={errors.name?.message}
                icon={<User className="w-4 h-4" />}
              />

              <Input
                label="Email *"
                type="email"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email inválido',
                  },
                })}
                error={errors.email?.message}
                icon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Teléfono (WhatsApp)"
                type="tel"
                placeholder="+34 123 456 789"
                {...register('phone')}
                error={errors.phone?.message}
                icon={<Phone className="w-4 h-4" />}
                helperText="Número de WhatsApp para recibir notificaciones del bot"
              />
            </div>
          </div>

          {/* Rol y Permisos */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Rol y Permisos
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol del usuario *
                </label>
                <div className="space-y-3">
                  {availableRoles.map((role) => (
                    <label key={role.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value={role.value}
                        {...register('role', { required: 'Selecciona un rol' })}
                        className="mt-1 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{role.label}</p>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
                )}
              </div>

              {/* Asignación de equipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignar a equipo (opcional)
                </label>
                <select
                  {...register('teamId')}
                  className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Sin asignar</option>
                  {teams?.map((team: any) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Los usuarios pueden ser asignados a un equipo específico
                </p>
              </div>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'Cambiar Contraseña (opcional)' : 'Contraseña'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={isEditing ? 'Nueva contraseña' : 'Contraseña *'}
                type="password"
                {...register('password', {
                  required: !isEditing ? 'La contraseña es requerida' : false,
                  minLength: {
                    value: 8,
                    message: 'La contraseña debe tener al menos 8 caracteres',
                  },
                })}
                error={errors.password?.message}
                helperText={isEditing ? 'Dejar vacío para no cambiar' : undefined}
              />

              <Input
                label={isEditing ? 'Confirmar nueva contraseña' : 'Confirmar contraseña *'}
                type="password"
                {...register('confirmPassword', {
                  required: password ? 'Confirma la contraseña' : false,
                  validate: (value) => {
                    if (password && value !== password) {
                      return 'Las contraseñas no coinciden'
                    }
                    return true
                  },
                })}
                error={errors.confirmPassword?.message}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/users')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading || createMutation.isLoading || updateMutation.isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm 