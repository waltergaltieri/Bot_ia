export interface WhatsAppMessageDTO {
  id: string;
  phoneNumber: string;
  message: string;
  status: string;
  companyId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendWhatsAppMessageRequestDTO {
  message: string;
  to: string;
  replyToMessageId?: string;
}

export interface SendWhatsAppMessageResponseDTO {
  message: string;
  messageId: string;
  status: string;
}
