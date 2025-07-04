import { User, Company, Team, Publication, EngagementData } from '../types'

// Empresa matriz para Super Admin (Nosotros - Plataforma)
export const mockParentCompany: Company = {
  id: 'parent-company-1',
  name: 'WhatsApp Social Bot Platform',
  description: 'Plataforma de gestión de contenido social multi-tenant',
  logoUrl: 'https://via.placeholder.com/200x200/6B46C1/FFFFFF?text=WSB',
  isActive: true,
  createdAt: '2024-01-01T08:00:00.000Z',
  updatedAt: '2024-01-01T08:00:00.000Z',
}

// Clientes (Branch Managers) que compran nuestro bot
export const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'Grupo Empresarial Rodríguez',
    description: 'Cliente que compró nuestro bot para gestionar sus sucursales',
    logoUrl: 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=GER',
    parentCompanyId: 'parent-company-1',
    branchManagerId: 'user-2', // Carlos Rodríguez es el CEO del cliente
    isActive: true,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'company-2',
    name: 'Corporación Innovación Digital',
    description: 'Cliente que compró nuestro bot para sus empresas tecnológicas',
    logoUrl: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=CID',
    parentCompanyId: 'parent-company-1',
    branchManagerId: 'user-7', // Elena Jiménez es la CEO del cliente
    isActive: true,
    createdAt: '2024-01-20T08:00:00.000Z',
    updatedAt: '2024-01-20T08:00:00.000Z',
  },
  {
    id: 'company-3',
    name: 'Holding Marketing Pro',
    description: 'Cliente que compró nuestro bot para sus agencias',
    logoUrl: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=HMP',
    parentCompanyId: 'parent-company-1',
    branchManagerId: 'user-8', // Roberto Sánchez es el CEO del cliente
    isActive: true,
    createdAt: '2024-01-25T08:00:00.000Z',
    updatedAt: '2024-01-25T08:00:00.000Z',
  },
]

// Sucursales/Sub-empresas de los clientes (Branch Managers)
export const mockSubCompanies: Company[] = [
  // Sucursales de Grupo Empresarial Rodríguez (Cliente 1)
  {
    id: 'sub-company-1',
    name: 'TechStart Solutions',
    description: 'Sucursal de tecnología del Grupo Empresarial Rodríguez',
    logoUrl: 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=TS',
    parentCompanyId: 'company-1', // Pertenece al cliente Grupo Empresarial Rodríguez
    branchManagerId: 'user-2',
    isActive: true,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'sub-company-2',
    name: 'Digital Solutions Pro',
    description: 'Sucursal de soluciones digitales del Grupo Empresarial Rodríguez',
    logoUrl: 'https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=DSP',
    parentCompanyId: 'company-1', // Pertenece al cliente Grupo Empresarial Rodríguez
    branchManagerId: 'user-2',
    isActive: true,
    createdAt: '2024-01-16T08:00:00.000Z',
    updatedAt: '2024-01-16T08:00:00.000Z',
  },
  // Sucursales de Corporación Innovación Digital (Cliente 2)
  {
    id: 'sub-company-3',
    name: 'InnovateTech Hub',
    description: 'Sucursal de innovación de Corporación Innovación Digital',
    logoUrl: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=ITH',
    parentCompanyId: 'company-2', // Pertenece al cliente Corporación Innovación Digital
    branchManagerId: 'user-7',
    isActive: true,
    createdAt: '2024-01-20T08:00:00.000Z',
    updatedAt: '2024-01-20T08:00:00.000Z',
  },
  {
    id: 'sub-company-4',
    name: 'AI Solutions Lab',
    description: 'Sucursal de IA de Corporación Innovación Digital',
    logoUrl: 'https://via.placeholder.com/200x200/06B6D4/FFFFFF?text=AISL',
    parentCompanyId: 'company-2', // Pertenece al cliente Corporación Innovación Digital
    branchManagerId: 'user-7',
    isActive: true,
    createdAt: '2024-01-21T08:00:00.000Z',
    updatedAt: '2024-01-21T08:00:00.000Z',
  },
  // Sucursales de Holding Marketing Pro (Cliente 3)
  {
    id: 'sub-company-5',
    name: 'Digital Marketing Pro',
    description: 'Sucursal de marketing de Holding Marketing Pro',
    logoUrl: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=DMP',
    parentCompanyId: 'company-3', // Pertenece al cliente Holding Marketing Pro
    branchManagerId: 'user-8',
    isActive: true,
    createdAt: '2024-01-25T08:00:00.000Z',
    updatedAt: '2024-01-25T08:00:00.000Z',
  },
  {
    id: 'sub-company-6',
    name: 'Social Media Experts',
    description: 'Sucursal de redes sociales de Holding Marketing Pro',
    logoUrl: 'https://via.placeholder.com/200x200/EC4899/FFFFFF?text=SME',
    parentCompanyId: 'company-3', // Pertenece al cliente Holding Marketing Pro
    branchManagerId: 'user-8',
    isActive: true,
    createdAt: '2024-01-26T08:00:00.000Z',
    updatedAt: '2024-01-26T08:00:00.000Z',
  },
]

// Datos mock de la empresa principal (para compatibilidad)
export const mockCompany: Company = mockSubCompanies[0]

// Datos mock de usuarios con la estructura correcta
export const mockUsers: User[] = [
  // Super Admin (Nosotros - Administración de Ventas)
  {
    id: 'user-1',
    email: 'superadmin@global.com',
    name: 'Ana García',
    phone: '+34 123 456 789',
    companyId: 'parent-company-1', // Trabaja en nuestra plataforma
    role: 'super_admin',
    isActive: true,
    createdAt: '2024-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z',
  },
  // Branch Manager (Cliente CEO) - Grupo Empresarial Rodríguez
  {
    id: 'user-2',
    email: 'admin@techstart.com',
    name: 'Carlos Rodríguez',
    phone: '+34 123 456 790',
    companyId: 'company-1', // Es el CEO del cliente Grupo Empresarial Rodríguez
    role: 'branch_manager',
    isActive: true,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
  // Manager (Director de Sucursal) - TechStart Solutions
  {
    id: 'user-3',
    email: 'manager@techstart.com',
    name: 'Lucía Martínez',
    phone: '+34 123 456 791',
    companyId: 'sub-company-1', // Es director de la sucursal TechStart Solutions
    teamId: 'team-1',
    role: 'manager',
    isActive: true,
    createdAt: '2024-01-16T09:00:00.000Z',
    updatedAt: '2024-01-16T09:00:00.000Z',
  },
  // Employee (Empleado) - TechStart Solutions
  {
    id: 'user-4',
    email: 'lucia.ventas@techstart.com',
    name: 'Miguel Fernández',
    phone: '+34 123 456 792',
    companyId: 'sub-company-1', // Trabaja en la sucursal TechStart Solutions
    teamId: 'team-1',
    role: 'employee',
    isActive: true,
    createdAt: '2024-01-17T10:00:00.000Z',
    updatedAt: '2024-01-17T10:00:00.000Z',
  },
  // Employee (Empleado) - TechStart Solutions
  {
    id: 'user-5',
    email: 'miguel.marketing@techstart.com',
    name: 'Sofía López',
    phone: '+34 123 456 793',
    companyId: 'sub-company-1', // Trabaja en la sucursal TechStart Solutions
    teamId: 'team-2',
    role: 'employee',
    isActive: true,
    createdAt: '2024-01-18T11:00:00.000Z',
    updatedAt: '2024-01-18T11:00:00.000Z',
  },
  // Employee inactivo - TechStart Solutions
  {
    id: 'user-6',
    email: 'sofia.desarrollo@techstart.com',
    name: 'David Ruiz',
    phone: '+34 123 456 794',
    companyId: 'sub-company-1', // Trabaja en la sucursal TechStart Solutions
    teamId: 'team-3',
    role: 'employee',
    isActive: false,
    createdAt: '2024-01-19T12:00:00.000Z',
    updatedAt: '2024-01-19T12:00:00.000Z',
  },
  // Branch Manager (Cliente CEO) - Corporación Innovación Digital
  {
    id: 'user-7',
    email: 'admin@innovatetech.com',
    name: 'Elena Jiménez',
    phone: '+34 123 456 795',
    companyId: 'company-2', // Es la CEO del cliente Corporación Innovación Digital
    role: 'branch_manager',
    isActive: true,
    createdAt: '2024-01-20T08:00:00.000Z',
    updatedAt: '2024-01-20T08:00:00.000Z',
  },
  // Branch Manager (Cliente CEO) - Holding Marketing Pro
  {
    id: 'user-8',
    email: 'admin@digitalmarketing.com',
    name: 'Roberto Sánchez',
    phone: '+34 123 456 796',
    companyId: 'company-3', // Es el CEO del cliente Holding Marketing Pro
    role: 'branch_manager',
    isActive: true,
    createdAt: '2024-01-25T08:00:00.000Z',
    updatedAt: '2024-01-25T08:00:00.000Z',
  },
]

// Teams mock data actualizados para sub-empresas
export const mockTeams: Team[] = [
  // Equipos para TechStart Solutions (sub-company-1)
  {
    id: 'team-1',
    name: 'Equipo Desarrollo',
    description: 'Equipo de desarrollo de software',
    companyId: 'sub-company-1',
    managerId: 'user-3',
    socialAccounts: [
      {
        platform: 'linkedin',
        accountId: 'linkedin-tech-dev',
        accountName: 'TechStart Development',
        accessToken: 'mock-linkedin-token-1',
        isActive: true,
      },
    ],
    aiSettings: {
      tone: 'professional',
      language: 'es',
      includeHashtags: true,
      maxHashtags: 5,
      customPrompt: 'Enfoque en tecnología e innovación',
    },
    isActive: true,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'team-2',
    name: 'Equipo Marketing',
    description: 'Equipo de marketing digital',
    companyId: 'sub-company-1',
    managerId: 'user-3',
    socialAccounts: [
      {
        platform: 'instagram',
        accountId: 'instagram-tech-marketing',
        accountName: '@techstart_marketing',
        accessToken: 'mock-instagram-token-1',
        isActive: true,
      },
    ],
    aiSettings: {
      tone: 'friendly',
      language: 'es',
      includeHashtags: true,
      maxHashtags: 8,
      customPrompt: 'Contenido atractivo para redes sociales',
    },
    isActive: true,
    createdAt: '2024-01-16T09:00:00.000Z',
    updatedAt: '2024-01-16T09:00:00.000Z',
  },
  {
    id: 'team-3',
    name: 'Equipo Ventas',
    description: 'Equipo de ventas y atención al cliente',
    companyId: 'sub-company-1',
    managerId: 'user-3',
    socialAccounts: [],
    aiSettings: {
      tone: 'professional',
      language: 'es',
      includeHashtags: false,
      maxHashtags: 3,
      customPrompt: 'Comunicación profesional con clientes',
    },
    isActive: true,
    createdAt: '2024-01-17T10:00:00.000Z',
    updatedAt: '2024-01-17T10:00:00.000Z',
  },
  
  // Equipos para InnovateTech Hub (sub-company-3)
  {
    id: 'team-4',
    name: 'Equipo Innovación',
    description: 'Equipo de investigación e innovación',
    companyId: 'sub-company-3',
    managerId: 'user-7',
    socialAccounts: [
      {
        platform: 'linkedin',
        accountId: 'linkedin-innovate-tech',
        accountName: 'InnovateTech Hub',
        accessToken: 'mock-linkedin-token-2',
        isActive: true,
      },
    ],
    aiSettings: {
      tone: 'professional',
      language: 'es',
      includeHashtags: true,
      maxHashtags: 6,
      customPrompt: 'Enfoque en innovación y futuro tecnológico',
    },
    isActive: true,
    createdAt: '2024-01-20T08:00:00.000Z',
    updatedAt: '2024-01-20T08:00:00.000Z',
  },
  
  // Equipos para Digital Marketing Pro (sub-company-5)
  {
    id: 'team-5',
    name: 'Equipo Creative',
    description: 'Equipo creativo y de contenido',
    companyId: 'sub-company-5',
    managerId: 'user-8',
    socialAccounts: [
      {
        platform: 'instagram',
        accountId: 'instagram-digital-marketing',
        accountName: '@digitalmarketingpro',
        accessToken: 'mock-instagram-token-2',
        isActive: true,
      },
      {
        platform: 'tiktok',
        accountId: 'tiktok-digital-marketing',
        accountName: '@digitalmarketingpro',
        accessToken: 'mock-tiktok-token-1',
        isActive: true,
      },
    ],
    aiSettings: {
      tone: 'energetic',
      language: 'es',
      includeHashtags: true,
      maxHashtags: 10,
      customPrompt: 'Contenido viral y creativo para redes sociales',
    },
    isActive: true,
    createdAt: '2024-01-25T08:00:00.000Z',
    updatedAt: '2024-01-25T08:00:00.000Z',
  },
]

// Datos mock de publicaciones
export const mockPublications: Publication[] = [
  {
    id: 'pub-1',
    teamId: 'team-1',
    userId: 'user-3',
    originalMediaUrl: 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=Producto+Demo',
    generatedContent: `🚀 ¡Increíble demo de nuestro nuevo producto! 

Acabamos de presentar las últimas funcionalidades que revolucionarán la forma en que nuestros clientes gestionan sus proyectos.

✨ Características destacadas:
• Automatización inteligente
• Dashboard intuitivo  
• Integración seamless
• Analytics en tiempo real

¿Quieres conocer más? ¡Contáctanos para una demo personalizada!

#TechStart #Innovación #Producto #Demo #Tecnología`,
    platform: 'linkedin',
    status: 'published',
    publishedAt: '2024-01-20T10:30:00.000Z',
    engagementData: {
      likes: 145,
      comments: 23,
      shares: 12,
      views: 2340,
    },
    createdAt: '2024-01-20T09:15:00.000Z',
    updatedAt: '2024-01-20T10:30:00.000Z',
  },
  {
    id: 'pub-2',
    teamId: 'team-2',
    userId: 'user-4',
    originalMediaUrl: 'https://via.placeholder.com/600x600/10B981/FFFFFF?text=Team+Culture',
    generatedContent: `💪 ¡Viernes de team building en TechStart! 

Nada como terminar la semana compartiendo risas y fortaleciendo nuestros lazos como equipo. 

Aquí algunos de nuestros valores:
🤝 Colaboración
🎯 Innovación constante
🌱 Crecimiento mutuo
🎉 Diversión en el trabajo

¡Únete a nuestro equipo! Link en bio 👆

#TechStartTeam #TeamBuilding #Cultura #Trabajo #Diversión #Hiring`,
    platform: 'instagram',
    status: 'published',
    publishedAt: '2024-01-19T16:45:00.000Z',
    engagementData: {
      likes: 89,
      comments: 15,
      shares: 8,
      views: 1250,
    },
    createdAt: '2024-01-19T15:30:00.000Z',
    updatedAt: '2024-01-19T16:45:00.000Z',
  },
  {
    id: 'pub-3',
    teamId: 'team-3',
    userId: 'user-5',
    originalMediaUrl: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Code+Review',
    generatedContent: `👨‍💻 Code review tips que todo desarrollador debería conocer

1️⃣ Revisa el código como si fueras el autor
2️⃣ Enfócate en la lógica, no en el estilo
3️⃣ Sugiere mejoras, no solo problemas
4️⃣ Sé específico en tus comentarios
5️⃣ Aprende algo nuevo en cada review

¿Cuál es tu tip favorito para code reviews?

#Desarrollo #CodeReview #Programming #TechTips`,
    platform: 'linkedin',
    status: 'approved',
    publishedAt: undefined,
    engagementData: undefined,
    createdAt: '2024-01-21T14:20:00.000Z',
    updatedAt: '2024-01-21T14:20:00.000Z',
  },
  {
    id: 'pub-4',
    teamId: 'team-1',
    userId: 'user-3',
    originalMediaUrl: 'https://via.placeholder.com/600x600/EF4444/FFFFFF?text=Client+Success',
    generatedContent: `🎉 ¡Otro cliente satisfecho! 

Acabamos de completar la implementación de nuestra solución para @ClienteEjemplo y los resultados hablan por sí solos:

📈 40% mejora en eficiencia
⚡ 60% reducción en tiempo de procesamiento  
💰 25% ahorro en costos operativos

¿Tu empresa necesita resultados similares? ¡Hablemos!

#CasoDeExito #Clientes #Resultados #Eficiencia #TechStart`,
    platform: 'linkedin',
    status: 'pending',
    publishedAt: undefined,
    engagementData: undefined,
    createdAt: '2024-01-21T16:10:00.000Z',
    updatedAt: '2024-01-21T16:10:00.000Z',
  },
  {
    id: 'pub-5',
    teamId: 'team-2',
    userId: 'user-4',
    originalMediaUrl: 'https://via.placeholder.com/600x600/F59E0B/FFFFFF?text=Behind+Scenes',
    generatedContent: `🎬 Behind the scenes: Así trabajamos en TechStart

Desde las ideas más locas hasta productos increíbles 🚀

Nuestro proceso creativo:
💡 Brainstorming sin límites
🎨 Prototipado rápido
🧪 Testing constante
🔥 Iteración continua

¡La magia sucede cuando nadie mira! ✨

#BehindTheScenes #Proceso #Creatividad #Desarrollo #TechStart`,
    platform: 'tiktok',
    status: 'failed',
    publishedAt: undefined,
    engagementData: undefined,
    createdAt: '2024-01-20T11:30:00.000Z',
    updatedAt: '2024-01-20T11:30:00.000Z',
  },
]

// Datos mock para métricas del dashboard
export const mockDashboardMetrics = {
  totalPublications: 156,
  totalEngagement: 15420,
  activeUsers: 8,
  conversionRate: 3.2,
  engagementByPlatform: {
    linkedin: 8500,
    instagram: 4920,
    tiktok: 2000,
  },
  weeklyActivity: [
    { date: '2024-01-15', publications: 12, engagement: 1200 },
    { date: '2024-01-16', publications: 8, engagement: 950 },
    { date: '2024-01-17', publications: 15, engagement: 1800 },
    { date: '2024-01-18', publications: 10, engagement: 1100 },
    { date: '2024-01-19', publications: 18, engagement: 2200 },
    { date: '2024-01-20', publications: 14, engagement: 1650 },
    { date: '2024-01-21', publications: 9, engagement: 800 },
  ],
  recentActivity: [
    {
      description: 'Nueva publicación aprobada en LinkedIn por Lucía Martínez',
      timestamp: 'Hace 5 minutos',
    },
    {
      description: 'Miguel Fernández subió nuevo contenido para Instagram',
      timestamp: 'Hace 15 minutos',
    },
    {
      description: 'Equipo de Ventas alcanzó 1000 likes este mes',
      timestamp: 'Hace 1 hora',
    },
    {
      description: 'Nueva integración de TikTok configurada',
      timestamp: 'Hace 2 horas',
    },
  ],
}

// Datos mock para analytics
export const mockAnalytics = {
  totalPublications: 156,
  totalEngagement: 15420,
  totalReach: 125000,
  activeUsers: 8,
  publicationsChange: 12,
  engagementChange: 18,
  reachChange: 25,
  usersChange: 0,
  engagement: {
    likes: 8950,
    comments: 1240,
    shares: 2180,
    views: 45680,
  },
  engagementByPlatform: {
    linkedin: 8500,
    instagram: 4920,
    tiktok: 2000,
  },
  timelineData: [
    { date: '2024-01-01', publications: 45, engagement: 4200 },
    { date: '2024-01-08', publications: 52, engagement: 4800 },
    { date: '2024-01-15', publications: 48, engagement: 4500 },
    { date: '2024-01-22', publications: 59, engagement: 5200 },
  ],
  teamPerformance: [
    {
      name: 'Equipo de Ventas',
      memberCount: 3,
      totalEngagement: 8500,
    },
    {
      name: 'Equipo de Marketing',
      memberCount: 2,
      totalEngagement: 4920,
    },
    {
      name: 'Equipo de Desarrollo',
      memberCount: 3,
      totalEngagement: 2000,
    },
  ],
  topPerformers: [
    {
      name: 'Lucía Martínez',
      role: 'Empleado',
      engagement: 5200,
    },
    {
      name: 'Miguel Fernández',
      role: 'Empleado',
      engagement: 3800,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Manager',
      engagement: 2900,
    },
  ],
}

// Datos mock para estadísticas de empresa
export const mockCompanyStats = {
  totalUsers: 5,
  totalTeams: 3,
  totalPublications: 156,
  connectedAccounts: 5,
}

// Datos mock para cuentas de redes sociales
export const mockSocialAccounts = [
  {
    id: 'social-1',
    platform: 'linkedin',
    accountName: 'TechStart Solutions',
    accountId: 'linkedin-123',
    isActive: true,
    expiresAt: '2024-06-15T00:00:00.000Z',
    lastSync: '2024-01-21T10:30:00.000Z',
  },
  {
    id: 'social-2',
    platform: 'instagram',
    accountName: '@techstart_solutions',
    accountId: 'instagram-456',
    isActive: true,
    expiresAt: '2024-04-20T00:00:00.000Z',
    lastSync: '2024-01-21T09:15:00.000Z',
  },
  {
    id: 'social-3',
    platform: 'tiktok',
    accountName: '@techstartofficial',
    accountId: 'tiktok-789',
    isActive: false,
    expiresAt: '2024-01-10T00:00:00.000Z', // Expirado
    lastSync: '2024-01-10T15:20:00.000Z',
  },
]

// Función para simular delay de red
export const simulateNetworkDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Función para simular respuestas de API
export const createMockResponse = <T>(data: T) => {
  return {
    data,
    status: 200,
    statusText: 'OK',
  }
} 