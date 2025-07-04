import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Users, Settings, Share2, Bot } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstTeam: {
      name: '',
      description: '',
    },
    firstUser: {
      name: '',
      phone: '',
    },
    preferences: {
      enableNotifications: true,
      autoPublish: false,
      weeklyReports: true,
    },
  })

  const steps = [
    {
      title: 'Bienvenido a WhatsApp Social Bot',
      description: 'Te ayudaremos a configurar tu empresa paso a paso',
      icon: Bot,
    },
    {
      title: 'Crear tu primer equipo',
      description: 'Los equipos organizan a tus empleados y sus publicaciones',
      icon: Users,
    },
    {
      title: 'Agregar tu primer empleado',
      description: 'Invita a un empleado para que comience a usar el bot',
      icon: Users,
    },
    {
      title: 'Configurar preferencias',
      description: 'Personaliza cómo quieres que funcione el sistema',
      icon: Settings,
    },
    {
      title: '¡Todo listo!',
      description: 'Tu empresa está configurada y lista para usar',
      icon: CheckCircle,
    },
  ]

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Finalizar onboarding
      await completeOnboarding()
      return
    }

    if (currentStep === 1) {
      // Validar datos del equipo
      if (!formData.firstTeam.name.trim()) {
        toast.error('El nombre del equipo es requerido')
        return
      }
    }

    if (currentStep === 2) {
      // Validar datos del empleado
      if (!formData.firstUser.name.trim()) {
        toast.error('El nombre del empleado es requerido')
        return
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    setIsLoading(true)
    try {
      await api.post('/onboarding/complete', {
        team: formData.firstTeam,
        user: formData.firstUser,
        preferences: formData.preferences,
      })
      
      toast.success('¡Configuración completada!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error completando la configuración')
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...data },
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Bot className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Bienvenido a WhatsApp Social Bot!
              </h2>
              <p className="text-gray-600">
                Te ayudaremos a configurar tu empresa en unos simples pasos para que puedas 
                comenzar a generar contenido automáticamente.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Bot className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Bot Inteligente</h3>
                <p className="text-sm text-gray-600">
                  IA que genera contenido optimizado para cada red social
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Gestión de Equipos</h3>
                <p className="text-sm text-gray-600">
                  Organiza a tus empleados en equipos con configuraciones específicas
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Share2 className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Multi-plataforma</h3>
                <p className="text-sm text-gray-600">
                  Publica automáticamente en LinkedIn, Instagram y TikTok
                </p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Crear tu primer equipo
              </h2>
              <p className="text-gray-600">
                Los equipos te permiten organizar a tus empleados y configurar 
                diferentes estilos de contenido.
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Nombre del equipo *"
                placeholder="Ej: Equipo de Ventas"
                value={formData.firstTeam.name}
                onChange={(e) => updateFormData('firstTeam', { name: e.target.value })}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  rows={3}
                  className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Describe el propósito de este equipo..."
                  value={formData.firstTeam.description}
                  onChange={(e) => updateFormData('firstTeam', { description: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Agregar tu primer empleado
              </h2>
              <p className="text-gray-600">
                Invita a un empleado para que pueda comenzar a enviar contenido al bot de WhatsApp.
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Nombre completo *"
                placeholder="Ej: Juan Pérez"
                value={formData.firstUser.name}
                onChange={(e) => updateFormData('firstUser', { name: e.target.value })}
              />
              
              <Input
                label="Teléfono de WhatsApp *"
                placeholder="+34 123 456 789"
                value={formData.firstUser.phone}
                onChange={(e) => updateFormData('firstUser', { phone: e.target.value })}
                helperText="El empleado recibirá instrucciones en este número"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> El empleado recibirá un mensaje de WhatsApp con instrucciones 
                sobre cómo usar el bot para enviar contenido.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Configurar preferencias
              </h2>
              <p className="text-gray-600">
                Personaliza cómo quieres que funcione el sistema según tus necesidades.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferences.enableNotifications}
                    onChange={(e) => updateFormData('preferences', { enableNotifications: e.target.checked })}
                    className="text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Habilitar notificaciones</p>
                    <p className="text-sm text-gray-500">
                      Recibe notificaciones por email sobre nuevas publicaciones
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferences.autoPublish}
                    onChange={(e) => updateFormData('preferences', { autoPublish: e.target.checked })}
                    className="text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Publicación automática</p>
                    <p className="text-sm text-gray-500">
                      Publica contenido automáticamente sin requerir aprobación manual
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferences.weeklyReports}
                    onChange={(e) => updateFormData('preferences', { weeklyReports: e.target.checked })}
                    className="text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Reportes semanales</p>
                    <p className="text-sm text-gray-500">
                      Recibe un resumen semanal del rendimiento de tus publicaciones
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Todo listo!
              </h2>
              <p className="text-gray-600">
                Tu empresa está configurada y lista para comenzar a generar contenido automáticamente.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-3">Próximos pasos:</h3>
              <ul className="text-left text-sm text-green-800 space-y-2">
                <li>• Conecta tus cuentas de redes sociales</li>
                <li>• Invita a más empleados a tu equipo</li>
                <li>• Configura el bot de WhatsApp</li>
                <li>• Comienza a generar contenido</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <React.Fragment key={index}>
                <div className={`flex flex-col items-center ${
                  isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive ? 'border-primary-600 bg-primary-50' : 
                    isCompleted ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            loading={isLoading}
          >
            {currentStep === steps.length - 1 ? (
              'Completar configuración'
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding 