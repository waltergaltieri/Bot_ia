import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  name: string
  companyName: string
  phone?: string
}

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        companyName: data.companyName,
        phone: data.phone,
      })
      toast.success('¡Empresa creada exitosamente!')
      navigate('/onboarding')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear la empresa')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crea tu empresa
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              inicia sesión si ya tienes cuenta
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Nombre de la empresa *"
              {...register('companyName', {
                required: 'El nombre de la empresa es requerido',
              })}
              error={errors.companyName?.message}
            />

            <Input
              label="Tu nombre completo *"
              {...register('name', {
                required: 'Tu nombre es requerido',
              })}
              error={errors.name?.message}
            />

            <Input
              label="Email corporativo *"
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Email inválido',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Teléfono (opcional)"
              type="tel"
              placeholder="+34 123 456 789"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <Input
              label="Contraseña *"
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres',
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirmar contraseña *"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña',
                validate: (value) =>
                  value === password || 'Las contraseñas no coinciden',
              })}
              error={errors.confirmPassword?.message}
            />
          </div>

          <div className="text-sm text-gray-600">
            <p>Al crear una cuenta, aceptas nuestros{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                términos de servicio
              </a>
              {' '}y{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                política de privacidad
              </a>.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
          >
            Crear empresa
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Register 