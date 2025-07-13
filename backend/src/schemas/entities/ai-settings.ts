import { AITone } from '../types';

export interface AISettings {
  tone: AITone;
  language: string;
  include_hashtags: boolean;
  max_hashtags: number;
  custom_prompt?: string;
}
