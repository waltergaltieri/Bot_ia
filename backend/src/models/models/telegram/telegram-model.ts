import { IncommingMessage, ITelegramModel, SendMessageConfig } from "../../interfaces/i_telegram_model";
import { config } from "../../../config";
import { logger } from "../../../utils/logger";
import { Result, success, fail, getLinkedInAuthUrl } from "../../../utils";
import axios from "axios";

export class TelegramModel implements ITelegramModel {
  private baseUrl: string;
  private botToken: string;

  constructor() {
    this.botToken = config.telegram.botToken;
    this.baseUrl = `${config.telegram.baseUrl}${this.botToken}`;
  }

  telegramCommands = {
    "/linkedin": (chatId: string) => this.onLinkedinCommand(chatId),
  }

  async sendMessage({ chatId, text }: SendMessageConfig): Promise<Result<any, string>> {
    try {
      const response = await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text,
      });
      logger.info(`Mensaje enviado a chat ${chatId}: ${text}`);
      return success(response.data);
    } catch (error: any) {
      logger.error("Error enviando mensaje de Telegram:", error.response?.data || error.message);
      return fail(error.response?.data || error.message);
    }
  }

  async setWebhook(webhookUrl: string, options?: any): Promise<Result<string, string>> {
    try {
      const url = webhookUrl || config.telegram.webhookUrl;
      const response = await axios.post(`${this.baseUrl}/setWebhook`, {
        url,
        allowed_updates: ["message", "edited_message", "callback_query"],
        ...options,
      });
      logger.info(`Webhook de Telegram configurado: ${url}`);
      return success(response.data);
    } catch (error: any) {
      logger.error("Error configurando webhook de Telegram:", error.response?.data || error.message);
      return fail(error.response?.data || error.message);
    }
  }

  async getWebhookInfo(): Promise<Result<any, string>> {
    try {
      const response = await axios.get(`${this.baseUrl}/getWebhookInfo`);
      logger.info("Información del webhook obtenida exitosamente", {
        result: response.data,
      });
      return success(response.data);
    } catch (error: any) {
      logger.error("Error obteniendo información del webhook:", error.response?.data || error.message);
      return fail(error.response?.data || error.message);
    }
  }

  async deleteWebhook(): Promise<Result<any, string>> {
    try {
      const response = await axios.post(`${this.baseUrl}/deleteWebhook`);
      logger.info("Webhook de Telegram eliminado");
      return success(response.data);
    } catch (error: any) {
      logger.error("Error eliminando webhook de Telegram:", error.response?.data || error.message);
      return fail(error.response?.data || error.message);
    }
  }

  async getMe(): Promise<Result<any, string>> {
    try {
      const response = await axios.get(`${this.baseUrl}/getMe`);
      logger.info("Información del bot obtenida exitosamente", {
        result: response.data,
      });
      return success(response.data);
    } catch (error: any) {
      logger.error("Error obteniendo información del bot:", error.response?.data || error.message);
      return fail(error.response?.data || error.message);
    }
  }

  async sendChatAction(chatId: number | string, action: string): Promise<Result<any, string>> {
    try {
      const response = await axios.post(`${this.baseUrl}/sendChatAction`, {
        chat_id: chatId,
        action,
      });
      return success(response.data);
    } catch (error: any) {
      logger.error("Error enviando acción de chat:", error.response?.data || error.message);
      return fail(error.response?.data || error.message);
    }
  }

  async onMessage({ chatId, text }: IncommingMessage): Promise<Result<any, string>> {
    try {
      await this.sendChatAction(chatId, "typing");

      const commandKey = Object.keys(this.telegramCommands).find(cmd => text.startsWith(cmd));
      if (commandKey) {
        // Use bracket notation and type assertion to avoid 'this' type error
        const callback = (this.telegramCommands as Record<string, (chatId: string) => Promise<Result<any, string>>>)[commandKey];
        if (typeof callback === 'function') {
          return await callback(chatId);
        }
      }

      return success("No se procesó ningún comando específico.");
    } catch (error: any) {
      logger.error("Error procesando webhook de Telegram:", error);
      return fail(error.message);
    }
  }

  private async onLinkedinCommand(chatId: string): Promise<Result<any, string>> {
    const authUrl = getLinkedInAuthUrl();
    await this.sendMessage({ chatId, text: `Para autenticarte en LinkedIn, visita el siguiente enlace: ${authUrl}` });
    return success({ success: true, message: "Comando /linkedin procesado." });
  }
}
