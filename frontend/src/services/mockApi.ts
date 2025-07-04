import { 
  mockCompany, 
  mockCompanies,
  mockSubCompanies,
  mockParentCompany,
  mockUsers, 
  mockTeams, 
  mockPublications, 
  mockDashboardMetrics,
  mockAnalytics,
  mockCompanyStats,
  mockSocialAccounts,
  simulateNetworkDelay,
  createMockResponse 
} from './mockData'

// Variable para controlar si usar mocks
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true

// Función para obtener el usuario actual del localStorage
const getCurrentUser = () => {
  const token = localStorage.getItem('auth_token')
  if (!token) return null
  
  // Obtener el ID del usuario actual desde localStorage
  const currentUserId = localStorage.getItem('current_user_id')
  if (currentUserId) {
    const user = mockUsers.find(u => u.id === currentUserId)
    if (user) return user
  }
  
  // Si no hay usuario específico, devolver Super Admin por defecto
  return mockUsers.find(u => u.role === 'super_admin') || mockUsers[0]
}

class MockApiService {
  async get(url: string, config?: any) {
    if (!USE_MOCK_DATA) {
      throw new Error('Mock API disabled')
    }

    await simulateNetworkDelay()
    const currentUser = getCurrentUser()

    // Dashboard metrics
    if (url === '/metrics/dashboard') {
      return createMockResponse(mockDashboardMetrics)
    }

    // Analytics
    if (url === '/analytics') {
      return createMockResponse(mockAnalytics)
    }

    // Companies - Solo Super Admin puede ver todas las empresas
    if (url === '/companies') {
      if (currentUser?.role === 'super_admin') {
        return createMockResponse(mockCompanies)
      } else {
        // Branch managers y otros solo ven su empresa
        const userCompany = mockCompanies.find(c => c.id === currentUser?.companyId)
        return createMockResponse(userCompany ? [userCompany] : [])
      }
    }

    // Sub-companies - Branch Managers pueden ver sus sub-empresas
    if (url === '/sub-companies') {
      if (currentUser?.role === 'super_admin') {
        // Super Admin ve todas las sub-empresas
        return createMockResponse(mockSubCompanies)
      } else if (currentUser?.role === 'branch_manager') {
        // Branch Manager ve sus sub-empresas
        const userSubCompanies = mockSubCompanies.filter(c => c.parentCompanyId === currentUser?.companyId)
        return createMockResponse(userSubCompanies)
      } else {
        // Otros roles no tienen acceso
        throw new Error('Access denied')
      }
    }

    // Single company
    if (url.startsWith('/companies/')) {
      const companyId = url.split('/')[2]
      const company = mockCompanies.find(c => c.id === companyId)
      
      // Verificar permisos
      if (currentUser?.role !== 'super_admin' && currentUser?.companyId !== companyId) {
        throw new Error('Access denied')
      }
      
      if (!company) throw new Error('Company not found')
      return createMockResponse(company)
    }

    // Users
    if (url === '/users') {
      const roleFilter = config?.params?.roles
      let filteredUsers = mockUsers
      
      // Filtrar por empresa según el rol del usuario
      if (currentUser?.role === 'super_admin') {
        // Super Admin puede ver usuarios de todas las empresas
        filteredUsers = mockUsers
      } else if (currentUser?.role === 'branch_manager') {
        // Branch Manager ve usuarios de todas sus sub-empresas
        const userSubCompanies = mockSubCompanies.filter(c => c.parentCompanyId === currentUser?.companyId)
        const subCompanyIds = userSubCompanies.map(c => c.id)
        filteredUsers = mockUsers.filter(user => subCompanyIds.includes(user.companyId))
      } else {
        // Otros roles solo ven usuarios de su empresa
        filteredUsers = mockUsers.filter(user => user.companyId === currentUser?.companyId)
      }
      
      if (roleFilter) {
        const allowedRoles = roleFilter.split(',')
        filteredUsers = filteredUsers.filter(user => allowedRoles.includes(user.role))
      }
      
      return createMockResponse(filteredUsers)
    }

    // Single user
    if (url.startsWith('/users/') && !url.includes('/stats')) {
      const userId = url.split('/')[2]
      const user = mockUsers.find(u => u.id === userId)
      
      // Verificar permisos
      if (currentUser?.role !== 'super_admin' && currentUser?.companyId !== user?.companyId) {
        throw new Error('Access denied')
      }
      
      if (!user) throw new Error('User not found')
      return createMockResponse(user)
    }

    // User stats
    if (url.includes('/users/') && url.includes('/stats')) {
      const userId = url.split('/')[2]
      const user = mockUsers.find(u => u.id === userId)
      
      // Verificar permisos
      if (currentUser?.role !== 'super_admin' && currentUser?.companyId !== user?.companyId) {
        throw new Error('Access denied')
      }
      
      return createMockResponse({
        totalPublications: 45,
        totalEngagement: 2340,
        averageEngagement: 52,
        topPlatform: 'LinkedIn',
        monthlyGrowth: 12.5,
      })
    }

    // Teams
    if (url === '/teams') {
      let filteredTeams = mockTeams
      
      // Filtrar por empresa según el rol del usuario
      if (currentUser?.role === 'super_admin') {
        // Super Admin ve todos los equipos
        filteredTeams = mockTeams
      } else if (currentUser?.role === 'branch_manager') {
        // Branch Manager ve equipos de todas sus sub-empresas
        const userSubCompanies = mockSubCompanies.filter(c => c.parentCompanyId === currentUser?.companyId)
        const subCompanyIds = userSubCompanies.map(c => c.id)
        filteredTeams = mockTeams.filter(team => subCompanyIds.includes(team.companyId))
      } else {
        // Otros roles solo ven equipos de su empresa
        filteredTeams = mockTeams.filter(team => team.companyId === currentUser?.companyId)
      }
      
      return createMockResponse(filteredTeams)
    }

    // Single team
    if (url.startsWith('/teams/') && !url.includes('/stats')) {
      const teamId = url.split('/')[2]
      const team = mockTeams.find(t => t.id === teamId)
      
      // Verificar permisos
      if (currentUser?.role !== 'super_admin' && currentUser?.companyId !== team?.companyId) {
        throw new Error('Access denied')
      }
      
      if (!team) throw new Error('Team not found')
      return createMockResponse(team)
    }

    // Publications
    if (url === '/publications') {
      let filteredPublications = mockPublications
      
      // Filtrar por empresa según el rol del usuario
      if (currentUser?.role === 'super_admin') {
        // Super Admin ve todas las publicaciones
        filteredPublications = mockPublications
      } else if (currentUser?.role === 'branch_manager') {
        // Branch Manager ve publicaciones de todas sus sub-empresas
        const userSubCompanies = mockSubCompanies.filter(c => c.parentCompanyId === currentUser?.companyId)
        const subCompanyIds = userSubCompanies.map(c => c.id)
        const userTeams = mockTeams.filter(team => subCompanyIds.includes(team.companyId))
        const userTeamIds = userTeams.map(team => team.id)
        filteredPublications = mockPublications.filter(pub => userTeamIds.includes(pub.teamId))
      } else {
        // Otros roles solo ven publicaciones de su empresa
        const userTeams = mockTeams.filter(team => team.companyId === currentUser?.companyId)
        const userTeamIds = userTeams.map(team => team.id)
        filteredPublications = mockPublications.filter(pub => userTeamIds.includes(pub.teamId))
      }
      
      return createMockResponse(filteredPublications)
    }

    // Social accounts
    if (url === '/social-accounts') {
      return createMockResponse(mockSocialAccounts)
    }

    // Company stats
    if (url === '/company/stats') {
      return createMockResponse(mockCompanyStats)
    }

    // Dashboard metrics
    if (url === '/metrics/dashboard') {
      const currentUser = getCurrentUser()
      
      if (currentUser?.role === 'super_admin') {
        // Métricas para Super Admin (Administración de Ventas)
        return createMockResponse({
          totalCompanies: mockCompanies.length,
          totalSubCompanies: mockSubCompanies.length,
          totalUsers: mockUsers.length,
          activeUsers: mockUsers.filter(u => u.isActive).length,
          totalRevenue: '$45K',
          systemUptime: '98.5%',
          recentActivity: [
            {
              description: 'Nuevo cliente adquirido: Holding Marketing Pro',
              timestamp: '2 horas atrás',
              type: 'sale_completed'
            },
            {
              description: 'Renovación de contrato: Grupo Empresarial Rodríguez',
              timestamp: '4 horas atrás',
              type: 'contract_renewed'
            },
            {
              description: 'Demo realizada: Empresa Tecnológica XYZ',
              timestamp: '6 horas atrás',
              type: 'demo_completed'
            }
          ]
        })
      } else if (currentUser?.role === 'branch_manager') {
        // Métricas para Branch Manager (Cliente CEO)
        const userSubCompanies = mockSubCompanies.filter(c => c.parentCompanyId === currentUser?.companyId)
        const subCompanyIds = userSubCompanies.map(c => c.id)
        const userTeams = mockTeams.filter(team => subCompanyIds.includes(team.companyId))
        const userTeamIds = userTeams.map(team => team.id)
        const userPublications = mockPublications.filter(pub => userTeamIds.includes(pub.teamId))
        const userUsers = mockUsers.filter(user => subCompanyIds.includes(user.companyId))
        
        // Calcular engagement total
        const totalEngagement = userPublications.reduce((sum, pub) => {
          return sum + (pub.engagementData?.likes || 0) + (pub.engagementData?.comments || 0) + (pub.engagementData?.shares || 0)
        }, 0)
        
        return createMockResponse({
          totalSubCompanies: userSubCompanies.length,
          totalTeams: userTeams.length,
          totalUsers: userUsers.length,
          activeUsers: userUsers.filter(u => u.isActive).length,
          totalPublications: userPublications.length,
          totalEngagement: totalEngagement.toLocaleString(),
          conversionRate: 12.5,
          recentActivity: [
            {
              description: 'Nueva sucursal habilitada: Digital Solutions Pro',
              timestamp: '1 hora atrás',
              type: 'sub_company_created'
            },
            {
              description: 'Equipo de desarrollo creado en TechStart Solutions',
              timestamp: '3 horas atrás',
              type: 'team_created'
            },
            {
              description: 'Nuevo empleado contratado en Digital Solutions Pro',
              timestamp: '5 horas atrás',
              type: 'user_created'
            }
          ]
        })
      } else {
        // Métricas específicas de empresa para otros roles
        return createMockResponse({
          totalPublications: 45,
          totalEngagement: 1250,
          activeUsers: 8,
          conversionRate: 12.5,
          engagementByPlatform: {
            LinkedIn: 45,
            Instagram: 35,
            Twitter: 20
          },
          weeklyActivity: [
            { day: 'Lun', value: 120 },
            { day: 'Mar', value: 150 },
            { day: 'Mié', value: 180 },
            { day: 'Jue', value: 140 },
            { day: 'Vie', value: 200 },
            { day: 'Sáb', value: 90 },
            { day: 'Dom', value: 60 }
          ],
          recentActivity: [
            {
              description: 'Nueva publicación publicada en LinkedIn',
              timestamp: '1 hora atrás'
            },
            {
              description: 'Usuario Miguel Fernández se unió al equipo',
              timestamp: '3 horas atrás'
            },
            {
              description: 'Campaña de marketing iniciada',
              timestamp: '5 horas atrás'
            }
          ]
        })
      }
    }

    // Auth endpoints
    if (url === '/auth/me') {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error('No authenticated user')
      }
      return createMockResponse({ user: currentUser })
    }

    // Fallback para URLs no manejadas
    throw new Error(`Mock endpoint not found: ${url}`)
  }

  async post(url: string, data: any) {
    if (!USE_MOCK_DATA) {
      throw new Error('Mock API disabled')
    }

    await simulateNetworkDelay()
    const currentUser = getCurrentUser()

    // Auth login
    if (url === '/auth/login') {
      const { email, password } = data
      
      // Buscar el usuario por email
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
      
      if (!user) {
        throw new Error('Usuario no encontrado')
      }
      
      if (!user.isActive) {
        throw new Error('Usuario desactivado')
      }
      
      // En mock, aceptamos cualquier contraseña
      // En producción aquí validarías la contraseña
      
      // Guardar el usuario actual en localStorage para que getCurrentUser lo use
      localStorage.setItem('current_user_id', user.id)
      
      return createMockResponse({
        token: 'mock-jwt-token',
        user: user,
      })
    }

    // Auth register
    if (url === '/auth/register') {
      return createMockResponse({
        message: 'Usuario registrado exitosamente',
        user: {
          id: `user-${Date.now()}`,
          email: data.email,
          name: data.name,
          companyId: `company-${Date.now()}`,
          role: 'branch_manager',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    }

    // Create company (Solo Super Admin)
    if (url === '/companies') {
      if (currentUser?.role !== 'super_admin') {
        throw new Error('Access denied')
      }
      
      return createMockResponse({
        id: `company-${Date.now()}`,
        ...data,
        parentCompanyId: 'parent-company-1',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    // Create user
    if (url === '/users') {
      return createMockResponse({
        id: `user-${Date.now()}`,
        ...data,
        companyId: currentUser?.role === 'super_admin' ? data.companyId : currentUser?.companyId,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    // Create team
    if (url === '/teams') {
      return createMockResponse({
        id: `team-${Date.now()}`,
        ...data,
        companyId: currentUser?.role === 'super_admin' ? data.companyId : currentUser?.companyId,
        socialAccounts: [],
        aiSettings: {
          tone: 'professional',
          language: 'es',
          includeHashtags: true,
          maxHashtags: 5,
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    return createMockResponse({ message: 'Created successfully' })
  }

  async put(url: string, data: any) {
    if (!USE_MOCK_DATA) {
      throw new Error('Mock API disabled')
    }

    await simulateNetworkDelay()
    return createMockResponse({ message: 'Updated successfully' })
  }

  async patch(url: string, data: any) {
    if (!USE_MOCK_DATA) {
      throw new Error('Mock API disabled')
    }

    await simulateNetworkDelay()
    return createMockResponse({ message: 'Patched successfully' })
  }

  async delete(url: string) {
    if (!USE_MOCK_DATA) {
      throw new Error('Mock API disabled')
    }

    await simulateNetworkDelay()
    return createMockResponse({ message: 'Deleted successfully' })
  }
}

export default new MockApiService() 