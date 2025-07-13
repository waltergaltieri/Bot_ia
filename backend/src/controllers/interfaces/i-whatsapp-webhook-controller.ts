
import { Request, Response } from "express";

export interface IWhatsappWebhookController {
  verifyWebhook(req: Request, res: Response): Promise<Response>;
  processIncomingMessage(req: Request, res: Response): Promise<Response>;
}
