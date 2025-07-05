export interface PublicationDTO {
  id: string;
  title: string;
  content: string;
  status: string;
  platform: string;
  companyId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePublicationRequestDTO {
  title: string;
  content: string;
  platform: string;
  scheduledDate?: string;
}

export interface CreatePublicationResponseDTO {
  message: string;
  publication: PublicationDTO;
}
