export interface TeamDTO {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  managerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamRequestDTO {
  name: string;
  description?: string;
  managerId: string;
}

export interface CreateTeamResponseDTO {
  message: string;
  team: TeamDTO;
}
