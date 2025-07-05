import { EngagementData } from './engagement-data';
import { PublicationStatus } from '../types';

export interface Publication {
  id: string;
  team_id: string;
  user_id: string;
  original_media_url: string;
  generated_content: string;
  platform: string;
  status: PublicationStatus;
  published_at?: string;
  engagement_data?: EngagementData;
  created_at: string;
  updated_at: string;
}
