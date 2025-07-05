export interface CompanyDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  parentCompanyId?: string;
  branchManagerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequestDTO {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  branchManagerId?: string;
}

export interface CreateCompanyResponseDTO {
  message: string;
  company: CompanyDTO;
}
