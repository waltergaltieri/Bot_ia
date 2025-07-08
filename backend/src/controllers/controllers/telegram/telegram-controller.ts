import { config } from "../../../config";
import { Request, Response } from "express";
import { ITelegram } from "../../interfaces/i_telegram";
import { ITelegramModel } from "../../../models/interfaces/i_telegram_model";
import { logger } from "../../../utils/logger";

export class TelegramController implements ITelegram {
  private telegramModel: ITelegramModel;

  constructor({ telegramModel }: { telegramModel: ITelegramModel }) {
    this.telegramModel = telegramModel;
  }

  setWebhook = async (req: Request, res: Response) => {
    try {
      const webhookUrl = config.telegram.webhookUrl;
      const result = await this.telegramModel.setWebhook(webhookUrl);
      if (result.success) {
        res.json({
          success: true,
          message: "Webhook configurado exitosamente",
          result: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Error configurando webhook",
          error: result.error,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error configurando webhook",
        error: error.message,
      });
    }
  };

  getWebhookInfo = async (req: Request, res: Response) => {
    try {
      const result = await this.telegramModel.getWebhookInfo();
      if (result.success) {
        res.json({
          success: true,
          message: "Información del webhook obtenida exitosamente",
          result: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Error obteniendo información del webhook",
          error: result.error,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error obteniendo información del webhook",
        error: error.message,
      });
    }
  };

  deleteWebhook = async (req: Request, res: Response) => {
    try {
      const result = await this.telegramModel.deleteWebhook();
      if (result.success) {
        res.json({
          success: true,
          message: "Webhook eliminado exitosamente",
          result: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Error eliminando webhook",
          error: result.error,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error eliminando webhook",
        error: error.message,
      });
    }
  };

  getMe = async (req: Request, res: Response) => {
    try {
      const result = await this.telegramModel.getMe();
      if (result.success) {
        res.json({
          success: true,
          message: "Información del bot obtenida exitosamente",
          result: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Error obteniendo información del bot",
          error: result.error,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error obteniendo información del bot",
        error: error.message,
      });
    }
  };

  onMessage = async (req: Request, res: Response) => {
    try {
      logger.info("Incoming webhook message:", JSON.stringify(req.body, null, 2));
      const message = req.body.message;
      if (!message?.text) {
        logger.warn("Mensaje recibido sin texto, ignorando.");
        res.sendStatus(200);
        return;
      }

      this.telegramModel.onMessage({
        chatId: message.chat.id,
        text: message.text,
      });

      res.sendStatus(200);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error obteniendo información del bot",
        error: error.message,
      });
    }
  };
}
