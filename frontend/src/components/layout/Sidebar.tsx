import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText, 
  BarChart3, 
  Settings,
  Share2,
  Building,
  Building2,
  DollarSign,
  TrendingUp,
  Target,
  CreditCard,
  Users2,
  PieChart,
  Activity
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Sidebar: React.FC = () => {
  const { user } = useAuth()

  const navigationItems = [
    // Super Admin - Gestión de Ventas y Sistema
    {
      name: 'Dashboard de Ventas',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin'],
    },
    {
      name: 'Clientes',
      href: '/companies',
      icon: Building2,
      roles: ['super_admin'],
    },
    {
      name: 'Ventas',
      href: '/sales',
      icon: DollarSign,
      roles: ['super_admin'],
    },
    {
      name: 'Facturación',
      href: '/billing',
      icon: CreditCard,
      roles: ['super_admin'],
    },
    {
      name: 'Métricas Comerciales',
      href: '/analytics',
      icon: TrendingUp,
      roles: ['super_admin'],
    },
    {
      name: 'Configuración del Sistema',
      href: '/settings/system',
      icon: Settings,
      roles: ['super_admin'],
    },

    // Branch Manager - Gestión Empresarial
    {
      name: 'Dashboard Empresarial',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['branch_manager'],
    },
    {
      name: 'Mis Sucursales',
      href: '/sub-companies',
      icon: Building,
      roles: ['branch_manager'],
    },
    {
      name: 'Resultados Generales',
      href: '/analytics',
      icon: BarChart3,
      roles: ['branch_manager'],
    },
    {
      name: 'Métricas por Sucursal',
      href: '/analytics/by-company',
      icon: PieChart,
      roles: ['branch_manager'],
    },
    {
      name: 'Actividad Empresarial',
      href: '/activity',
      icon: Activity,
      roles: ['branch_manager'],
    },
    {
      name: 'Configuración Empresarial',
      href: '/settings/company',
      icon: Settings,
      roles: ['branch_manager'],
    },

    // Manager - Gestión de Sucursal
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['manager'],
    },
    {
      name: 'Equipos',
      href: '/teams',
      icon: Users,
      roles: ['manager'],
    },
    {
      name: 'Usuarios',
      href: '/users',
      icon: UserPlus,
      roles: ['manager'],
    },
    {
      name: 'Publicaciones',
      href: '/publications',
      icon: FileText,
      roles: ['manager'],
    },
    {
      name: 'Redes Sociales',
      href: '/settings/social-accounts',
      icon: Share2,
      roles: ['manager'],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['manager'],
    },
    {
      name: 'Configuración',
      href: '/settings/company',
      icon: Settings,
      roles: ['manager'],
    },

    // Employee - Vista Personal
    {
      name: 'Mi Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['employee'],
    },
    {
      name: 'Mis Publicaciones',
      href: '/publications',
      icon: FileText,
      roles: ['employee'],
    },
    {
      name: 'Mis Métricas',
      href: '/analytics',
      icon: BarChart3,
      roles: ['employee'],
    },
    {
      name: 'Mis Redes Sociales',
      href: '/settings/social-accounts',
      icon: Share2,
      roles: ['employee'],
    },
  ]

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || '')
  )

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-sm border-r border-gray-200 z-20">
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar 