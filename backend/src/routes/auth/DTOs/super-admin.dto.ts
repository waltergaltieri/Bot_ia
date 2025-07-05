export interface CreateSuperAdminRequestDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface CreateSuperAdminResponseDTO {
  message: string;
  user: {
    id: string;
    email: string;
    companyId: string;
    role: string;
  };
}
