export interface UserDTO {
  id: string;
  email: string;
  name: string;
  phone?: string;
  companyId: string;
  role: string;
  teamId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequestDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: string;
  teamId?: string;
}

export interface CreateUserResponseDTO {
  message: string;
  user: UserDTO;
}
