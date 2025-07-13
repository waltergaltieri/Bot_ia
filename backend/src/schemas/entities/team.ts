import { SocialAccount } from './social-account';
import { AISettings } from './ai-settings';

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
