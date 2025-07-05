export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
    companyId: string;
    role: string;
  };
}
