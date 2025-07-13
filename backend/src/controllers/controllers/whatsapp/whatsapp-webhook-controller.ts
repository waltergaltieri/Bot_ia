import { Request, Response } from "express";
import { IWhatsAppModel } from "../../../models/interfaces/i-whatsapp-model";
import { WhatsAppMessage, WhatsAppWebhookPayload } from "../../../schemas";
import { sendBadRequest, sendOk, sendInternalServerError } from "../../../utils/http-response-util";
import { IWhatsappWebhookController } from "../..";

export class WhatsappWebhookController implements IWhatsappWebhookController {
  constructor(private whatsappModel: IWhatsAppModel) {}

  verifyWebhook = async (req: Request, res: Response): Promise<Response> => {
    const isVerified = await this.whatsappModel.verifyWebhook({
      mode: String(req.query["hub.mode"]),
      token: String(req.query["hub.verify_token"]),
      challenge: String(req.query["hub.challenge"]),
    });

    return isVerified.success ? res.status(200).send(isVerified.data) : res.status(403).send(isVerified.error);
  };

  processIncomingMessage = async (req: Request, res: Response): Promise<Response> => {
    try {
      const payload: WhatsAppWebhookPayload = req.body;
      const validationError = this.validatePayloadStructure(payload);

      if (validationError) return sendOk(res, { success: true, message: "Message processed successfully" });

      const message = this.extractMessageFromPayload(payload);

      if (!message) return sendOk(res, { success: true, message: "Message processed successfully" });

      this.whatsappModel.processIncomingMessage(message);

      return sendOk(res, { success: true, message: "Message processed successfully" });
    } catch (error) {
      console.error("Error processing incoming message:", error);
      return sendInternalServerError(res, "Failed to process message", error instanceof Error ? error.message : "Unknown error");
    }
  };

  private validatePayloadStructure = (payload: WhatsAppWebhookPayload): string | null => {
    if (!payload) {
      return "Payload is missing";
    }

    if (!payload.entry || !Array.isArray(payload.entry) || payload.entry.length === 0) {
      return "Invalid or empty entry array";
    }

    return null;
  };

  private extractMessageFromPayload = (payload: WhatsAppWebhookPayload): WhatsAppMessage | null => {
    const entry = payload.entry[0];

    if (!entry?.changes || !Array.isArray(entry.changes) || entry.changes.length === 0) {
      return null;
    }

    const change = entry.changes[0];

    if (!change?.value?.messages || !Array.isArray(change.value.messages) || change.value.messages.length === 0) {
      return null;
    }

    return change.value.messages[0] || null;
  };
}
