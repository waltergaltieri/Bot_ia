export interface RegisterRequestDTO {
  email: string;
  password: string;
  name: string;
  companyName: string;
  phone?: string;
}

export interface RegisterResponseDTO {
  message: string;
  user: {
    id: string;
    email: string;
    companyId: string;
    role: string;
  };
}
