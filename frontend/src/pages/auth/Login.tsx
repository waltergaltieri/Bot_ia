import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Bot, 
  Shield, 
  Users, 
  User,
  Building,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Link } from 'react-router-dom'

interface LoginFormData {
  email: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const demoUsers = [
    {
      role: 'Super Admin',
      email: 'superadmin@global.com',
      description: 'Administración del sistema',
      icon: Shield,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      role: 'Branch Manager',
      email: 'admin@techstart.com',
      description: 'CEO de empresa cliente',
      icon: Building,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      role: 'Manager',
      email: 'manager@techstart.com',
      description: 'Director de sucursal',
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      role: 'Employee',
      email: 'lucia.ventas@techstart.com',
      description: 'Empleado de sucursal',
      icon: User,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const copyToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      toast.success('Email copiado al portapapeles')
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch (error) {
      toast.error('Error al copiar email')
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await login(data.email, data.password)
      toast.success('¡Bienvenido!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Lado Izquierdo - Formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenido de vuelta
              </h2>
              <p className="text-gray-600">
                Accede a tu panel de control inteligente
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  required
                  {...register('email', {
                    required: 'Email es requerido',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email inválido',
                    },
                  })}
                  error={errors.email?.message}
                  placeholder="Ingresa tu email"
                  className="text-lg"
                />
              </div>
              
              <div>
                <div className="relative">
                  <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    {...register('password', {
                      required: 'Contraseña es requerida',
                    })}
                    error={errors.password?.message}
                    placeholder="Ingresa tu contraseña"
                    className="text-lg pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 text-lg rounded-xl transition-all duration-200 transform hover:scale-105"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </div>

              <div className="text-center">
                <Link
                  to="/register"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  ¿No tienes cuenta? Regístrate aquí
                </Link>
              </div>
            </form>
          </div>

          {/* Lado Derecho - Cuentas de Prueba */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Prueba el Sistema
              </h3>
              <p className="text-gray-600 mb-6">
                Utiliza estas cuentas de prueba para explorar las diferentes funcionalidades según el rol
              </p>
            </div>

            <div className="space-y-4">
              {demoUsers.map((user) => {
                const Icon = user.icon
                const isCopied = copiedEmail === user.email
                
                return (
                  <div 
                    key={user.email}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${user.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {user.role}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {user.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {user.email}
                            </code>
                            <button
                              onClick={() => copyToClipboard(user.email)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copiar email"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Información adicional */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Información Importante</h4>
              </div>
              <div className="text-sm text-blue-800 space-y-2">
                <p>• <strong>Contraseña:</strong> Cualquier contraseña funciona</p>
                <p>• <strong>Roles:</strong> Cada cuenta tiene permisos específicos</p>
                <p>• <strong>Datos:</strong> Sistema con datos de prueba realistas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 