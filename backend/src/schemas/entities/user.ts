import { UserRole } from '../types';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  company_id: string;
  team_id?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
