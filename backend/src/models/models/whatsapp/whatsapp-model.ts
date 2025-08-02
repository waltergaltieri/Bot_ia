import axios from "axios";
import { config } from "../../../config";
import {
  MessageToSend,
  User,
  WebhookVerification,
  WhatsAppImage,
  WhatsAppMessage,
  WhatsAppWebhookPayload,
} from "../../../schemas";
import { fail, getLinkedInAuthUrl, Result } from "../../../utils";
import { IWhatsAppModel } from "../../interfaces/i-whatsapp-model";
import { SendWhatsAppMessageRequestDTO } from "../../../routes/whatsapp/DTOs/whatsapp.dto";
import { UserScheme } from "../../../config/db";
import { IAModel, IIA, IUserModel, UserModel } from "../..";
import { PublicationModel } from "../publication/publication-model";
import { logger } from "env-var";

export class WhatsAppModel implements IWhatsAppModel {
  private readonly facebookBaseUrl: string = "https://graph.facebook.com/v18.0";
  private readonly whatsappPhoneNumberId = config.whatsapp.phoneNumberId;

  private readonly userModel: IUserModel = new UserModel();
  private readonly analyzerIa: IIA = new IAModel();

  private readonly PublicationModel: PublicationModel = new PublicationModel();

  private get whatsappApiUrl(): string {
    return `${this.facebookBaseUrl}/${this.whatsappPhoneNumberId}`;
  }

  async processIncomingMessage(whatsappMessage: WhatsAppMessage): Promise<Result<any, string>> {
    try {
      const { type, from } = whatsappMessage;

      const isNewUser = await this.userModel.isNewUser(from);

      if (isNewUser) {
        const result = await this.userModel.saveOrUpdateUser({
          phone: from,
          role: "employee",
        });

        if (!result.success) return fail(`Failed to save new user: ${result.error}`);

        const user: User = result.data;
        await this.sendWelcomeMessage(from);

        if (!user.linkedinProfile) await this.sendLinkedinAuthMessage(from);
        return { success: true, data: "New user registered and welcome message sent" };
      } else {
        switch (type) {
          case "text":
            return await this.processTextMessage(whatsappMessage);

          case "image":
            console.log("Processing image message");
            return await this.processMessageWithImage(whatsappMessage);

          default:
            console.warn(`Unsupported message type: ${type}`);
            return fail(`Unsupported message type: ${type}`);
        }
      }
    } catch (error: any) {
      console.error("Error processing incoming message:", error);
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

    if (!text || !text.body) return fail("Received message does not contain text");

    try {
      const iaResponse = await this.analyzerIa.getResponse({ message: text.body, phoneNumber: from, type: "text" });
      const response = await this.sendMessage({
        to: from,
        message: iaResponse,
      });

      if (!response.success) {
        return fail(`Failed to send echo message: ${response.error}`);
      }

      const readResponse = await this.markMessageAsRead(id);
      if (!readResponse.success) {
        return fail(`Failed to mark message as read: ${readResponse.error}`);
      }

      return { success: true, data: "Message processed successfully" };
    } catch (error: any) {
      return fail(`Error processing text message: ${error?.message ?? String(error)}`);
    }
  }

  async processMessageWithImage(whatsappMessage: WhatsAppMessage): Promise<Result<any, string>> {
    const { from, id, image } = whatsappMessage;
    if (!image) return fail("Received message does not contain an image");

    const base64Image = await this.downloadMedia(image);
    if (!base64Image.success) {
      return fail(`Failed to download image: ${base64Image.error}`);
    }

    const iaResponse = await this.analyzerIa.getResponse({
      message: base64Image.data,
      phoneNumber: from,
      type: "image",
    });
    return { success: true, data: "Message with image processed successfully" };
  }

  private async sendWelcomeMessage(phone: string): Promise<void> {
    const welcomeMessage = "¡Bienvenido al servicio de automatizacion de Postia!";
    const messageToSend: SendWhatsAppMessageRequestDTO = {
      message: welcomeMessage,
      to: phone,
    };

    const result = await this.sendMessage({
      to: messageToSend.to,
      message: messageToSend.message,
    });

    if (!result.success) {
      console.error(`Failed to send welcome message: ${result.error}`);
    }
  }

  private async sendLinkedinAuthMessage(phone: string): Promise<void> {
    const linkedinAuthUrl = getLinkedInAuthUrl(phone);
    const linkedinAuthMessage = `Por favor, autentícate con LinkedIn para poder subir tus publicaciones.\n${linkedinAuthUrl}`;
    const messageToSend: SendWhatsAppMessageRequestDTO = {
      message: linkedinAuthMessage,
      to: phone,
    };

    const result = await this.sendMessage({
      to: messageToSend.to,
      message: messageToSend.message,
    });

    if (!result.success) {
      console.error(`Failed to send LinkedIn auth message: ${result.error}`);
    }
  }

  private async downloadMedia(image: WhatsAppImage): Promise<Result<string, string>> {
    try {
      const { id } = image;
      const metaRes = await axios.get(`${this.facebookBaseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${config.whatsapp.facebookAccessToken}` },
      });

      const metaData = metaRes.data;

      const imgRes = await axios.get(metaData.url, {
        headers: { Authorization: `Bearer ${config.whatsapp.facebookAccessToken}` },
        responseType: "arraybuffer",
      });

      const imageBuffer = Buffer.from(imgRes.data, "binary");
      return { success: true, data: imageBuffer.toString("base64") };
    } catch (error: any) {
      console.error("❌ Error descargando imagen:", error.response?.data || error.message);
      return fail("Error downloading media");
    }
  }
}
