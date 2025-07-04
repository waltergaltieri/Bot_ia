import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Bell, User, LogOut, Settings } from 'lucide-react'
import Button from '../ui/Button'

const Header: React.FC = () => {
  const { user, logout } = useAuth()

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'branch_manager':
        return 'Gerente de Sucursal'
      case 'manager':
        return 'Manager'
      case 'employee':
        return 'Empleado'
      default:
        return role
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800'
      case 'branch_manager':
        return 'bg-purple-100 text-purple-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'employee':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            WhatsApp Social Bot
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* Perfil de usuario */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.name}</p>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role || '')}`}
                >
                  {getRoleLabel(user?.role || '')}
                </span>
                {user?.role === 'super_admin' && (
                  <span className="text-xs text-gray-500">
                    • Vista Global
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header 