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
