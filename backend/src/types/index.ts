export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  company_id: string;
  team_id?: string;
  role: 'super_admin' | 'branch_manager' | 'manager' | 'employee';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  parent_company_id?: string;
  branch_manager_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  company_id: string;
  manager_id: string;
  social_accounts: SocialAccount[];
  ai_settings: AISettings;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  platform: 'linkedin' | 'instagram' | 'tiktok';
  account_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  is_active: boolean;
}

export interface AISettings {
  tone: 'professional' | 'casual' | 'friendly' | 'energetic';
  language: string;
  include_hashtags: boolean;
  max_hashtags: number;
  custom_prompt?: string;
}

export interface Publication {
  id: string;
  team_id: string;
  user_id: string;
  original_media_url: string;
  generated_content: string;
  platform: string;
  status: 'pending' | 'approved' | 'published' | 'failed';
  published_at?: string;
  engagement_data?: EngagementData;
  created_at: string;
  updated_at: string;
}

export interface EngagementData {
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  clicks?: number;
} 