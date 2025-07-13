export interface MessageToSend {
  message: string;
  to: string;
  replyToMessageId?: string;
}