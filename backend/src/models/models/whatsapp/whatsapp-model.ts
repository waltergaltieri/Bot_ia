import axios from "axios";
import { config } from "../../../config";
import { MessageToSend, WebhookVerification, WhatsAppMessage, WhatsAppWebhookPayload } from "../../../schemas";
import { fail, Result } from "../../../utils";
import { IWhatsAppModel } from "../../interfaces/i-whatsapp-model";
import { SendWhatsAppMessageRequestDTO } from "../../../routes/whatsapp/DTOs/whatsapp.dto";

export class WhatsAppModel implements IWhatsAppModel {
  private readonly facebookBaseUrl: string = "https://graph.facebook.com/v18.0";
  private readonly whatsappPhoneNumberId = config.whatsapp.phoneNumberId;

  private get whatsappApiUrl(): string {
    return `${this.facebookBaseUrl}/${this.whatsappPhoneNumberId}`;
  }

  async processIncomingMessage(whatsappMessage: WhatsAppMessage): Promise<Result<any, string>> {
    try {
      const { type } = whatsappMessage;

      switch (type) {
        case "text":
          return await this.processTextMessage(whatsappMessage);

        default:
          return fail(`Unsupported message type: ${type}`);
      }
    } catch (error: any) {
      return fail(`Error processing incoming message: ${error?.message ?? String(error)}`);
    }
  }

  async verifyWebhook(verificationRequest: WebhookVerification): Promise<Result<string, string>> {
    const { mode, token, challenge } = verificationRequest;
    var verifyToken = process.env.WHTASAPP_WEBHOOK_VERIFICATION_TOKEN;

    const isSubscribeMode = mode === "subscribe";
    const isTokenValid = token === verifyToken;

    if (isSubscribeMode && isTokenValid) {
      return { success: true, data: challenge };
    }

    return { success: false, error: "Webhook verification failed" };
  }

  async sendMessage(messageToSend: MessageToSend): Promise<Result<any, string>> {
    try {
      const { to, message, replyToMessageId } = messageToSend;
      const response = await axios({
        method: "POST",
        url: `${this.whatsappApiUrl}/messages`,
        headers: {
          Authorization: `Bearer ${config.whatsapp.facebookAccessToken}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: to,
          text: { body: message },
          context: replyToMessageId ? { message_id: replyToMessageId } : undefined,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return fail(`Error sending message: ${error?.message ?? String(error)}`);
    }
  }

  async echoMessage(whatsappMessage: WhatsAppMessage): Promise<Result<any, string>> {
    const { from, text } = whatsappMessage;

    if (!text || !text.body) {
      return fail("Received message does not contain text");
    }

    try {
      const response = await this.sendMessage({
        to: from,
        message: `Echo: ${text.body}`,
        replyToMessageId: whatsappMessage.id,
      });

      if (!response.success) {
        return fail(`Failed to send echo message: ${response.error}`);
      }

      return { success: true, data: "Echo message sent successfully" };
    } catch (error: any) {
      return fail(`Error sending echo message: ${error?.message ?? String(error)}`);
    }
  }

  private async markMessageAsRead(messageId: string): Promise<Result<any, string>> {
    try {
      const response = await axios({
        method: "POST",
        url: `${this.whatsappApiUrl}/messages`,
        headers: {
          Authorization: `Bearer ${config.whatsapp.facebookAccessToken}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return fail(`Error marking message as read: ${error?.message ?? String(error)}`);
    }
  }

  private async processTextMessage(whatsappMessage: WhatsAppMessage): Promise<Result<any, string>> {
    const { id, from, text } = whatsappMessage;

    if (!text || !text.body) {
      return fail("Received message does not contain text");
    }

    try {
      // Echo the received message back to the sender
      const response = await this.sendMessage({
        to: from,
        message: `Echo: ${text.body}`,
        replyToMessageId: id,
      });

      if (!response.success) {
        return fail(`Failed to send echo message: ${response.error}`);
      }

      // Mark the incoming message as read
      const readResponse = await this.markMessageAsRead(id);
      if (!readResponse.success) {
        return fail(`Failed to mark message as read: ${readResponse.error}`);
      }

      return { success: true, data: "Message processed successfully" };
    } catch (error: any) {
      return fail(`Error processing text message: ${error?.message ?? String(error)}`);
    }
  }
}
