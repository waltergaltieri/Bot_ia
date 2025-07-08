import { Router } from "express";
import { ITelegramModel } from '../../models/interfaces/i_telegram_model';
import { TelegramController } from '../../controllers/controllers/telegram/telegram-controller';

export interface ITelegramRouter {
  telegramModel: ITelegramModel;
}

export const createTelegramRouter = ({ telegramModel }: ITelegramRouter) => {
  const telegramRouter = Router();
  const telegramController = new TelegramController({ telegramModel });

  telegramRouter.post('/setup-webhook', telegramController.setWebhook);
  telegramRouter.get('/webhook-info', telegramController.getWebhookInfo);
  telegramRouter.delete('/webhook', telegramController.deleteWebhook);
  telegramRouter.get('/bot-info', telegramController.getMe);
  telegramRouter.post('/webhook', telegramController.onMessage);

  return telegramRouter;
};

