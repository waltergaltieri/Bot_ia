export interface User {
  id: string
  email: string
  name: string
  phone?: string
  companyId: string
  teamId?: string
  role: 'super_admin' | 'branch_manager' | 'manager' | 'employee'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Company {
  id: string
  name: string
  description?: string
  logoUrl?: string
  parentCompanyId?: string
  branchManagerId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  name: string
  description?: string
  companyId: string
  managerId: string
  socialAccounts: SocialAccount[]
  aiSettings: AISettings
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SocialAccount {
  platform: 'linkedin' | 'instagram' | 'tiktok'
  accountId: string
  accountName: string
  accessToken: string
  refreshToken?: string
  expiresAt?: string
  isActive: boolean
}

export interface AISettings {
  tone: 'professional' | 'casual' | 'friendly' | 'energetic'
  language: string
  includeHashtags: boolean
  maxHashtags: number
  customPrompt?: string
}

export interface Publication {
  id: string
  teamId: string
  userId: string
  originalMediaUrl: string
  generatedContent: string
  platform: string
  status: 'pending' | 'approved' | 'published' | 'failed'
  publishedAt?: string
  engagementData?: EngagementData
  createdAt: string
  updatedAt: string
}

export interface EngagementData {
  likes: number
  comments: number
  shares: number
  views?: number
  clicks?: number
}

export interface Metrics {
  totalPublications: number
  totalEngagement: number
  averageEngagement: number
  topPerformingPost: Publication
  engagementByPlatform: Record<string, number>
  publicationsOverTime: Array<{
    date: string
    count: number
  }>
} 