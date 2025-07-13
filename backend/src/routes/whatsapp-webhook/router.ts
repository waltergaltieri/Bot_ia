import { IWhatsAppModel } from "./../../models/interfaces/i-whatsapp-model";
import express from "express";
import { IWhatsappWebhookController, WhatsappWebhookController } from "../../controllers";

export interface IWhatsappRouter {
  whatsappModel: IWhatsAppModel;
}

export const createWhatsappWebhookRouter = ({ whatsappModel }: IWhatsappRouter) => {
  const whatsappWebhookRouter = express.Router();
  const whatsappWebhookController: IWhatsappWebhookController = new WhatsappWebhookController(whatsappModel);

  whatsappWebhookRouter.get("/webhook", whatsappWebhookController.verifyWebhook);

  whatsappWebhookRouter.post("/webhook", whatsappWebhookController.processIncomingMessage);

  return whatsappWebhookRouter;
};
