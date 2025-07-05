import { SocialPlatform } from '../types';

export interface SocialAccount {
  platform: SocialPlatform;
  account_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  is_active: boolean;
}
