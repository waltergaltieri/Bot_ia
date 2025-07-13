import { WhatsAppMessage, WebhookVerification, MessageToSend } from "../../schemas";
import { Result } from "../../utils";

export interface IWhatsAppModel {
  processIncomingMessage: (whatsappMessage: WhatsAppMessage) => Promise<Result<any, string>>;

  sendMessage: (messageToSend: MessageToSend) => Promise<Result<any, string>>;

  verifyWebhook: (verificationRequest: WebhookVerification) => Promise<Result<string, string>>;

  echoMessage: (whatsappMessage: WhatsAppMessage) => Promise<Result<any, string>>;
}
